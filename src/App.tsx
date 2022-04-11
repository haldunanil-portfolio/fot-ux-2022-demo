import React, { useCallback, useState } from "react";
import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  Loader,
  Paper,
  TextInput,
  Title,
} from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { showNotification } from "@mantine/notifications";

import { TodoItem } from "./components/TodoItem";
import {
  AddTodoResponse,
  AddTodoVariables,
  DeleteTodoResponse,
  DeleteTodoVariables,
  HasuraError,
  MarkTodoAsDoneTodoResponse,
  MarkTodoAsDoneVariables,
  PreviousTodosContext,
  Todo,
  TodosResponse,
} from "./types";

library.add(far, fas);

export const BASE_URL = process.env.REACT_APP_HASURA_REST_ENDPOINT;
export const TODOS_URL = `${BASE_URL}/todos`;

const fetchHelper = (input: RequestInfo, init?: RequestInit) => {
  return fetch(input, init).then(async (res) => {
    if (res.ok) {
      return res.json();
    }

    return Promise.reject(await res.json());
  });
};

function App() {
  const queryClient = useQueryClient();

  const todos = useQuery<TodosResponse, HasuraError, Todo[]>(
    "todos",
    ({ signal }) => fetchHelper(TODOS_URL, { signal }),
    {
      select: (data) => data.todos,
      onError: (err) => {
        showNotification({
          message: err.error,
          icon: <FontAwesomeIcon icon="times" />,
          color: "red",
        });
      },
    }
  );

  const [newTodo, setNewTodo] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  };

  const addMutation = useMutation<
    AddTodoResponse,
    HasuraError,
    AddTodoVariables
  >(
    (data) =>
      fetchHelper(TODOS_URL, { method: "POST", body: JSON.stringify(data) }),
    {
      onMutate: async () => {
        await queryClient.cancelQueries("todos");
      },
      onSuccess: (data) => {
        showNotification({
          message: `Todo "${data.insert_todos_one.text}" added successfully!`,
          icon: <FontAwesomeIcon icon="check" />,
          color: "teal",
        });
      },
      onError: (err, data) => {
        showNotification({
          title: `Todo "${data.text}" could not be added`,
          message: err.error,
          icon: <FontAwesomeIcon icon="times" />,
          color: "red",
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries("todos");
      },
    }
  );

  const deleteMutation = useMutation<
    DeleteTodoResponse,
    HasuraError,
    DeleteTodoVariables
  >((data) => fetchHelper(`${TODOS_URL}/${data.id}`, { method: "DELETE" }), {
    onMutate: async (deletedTodo) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries("todos");

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData("todos");

      // Optimistically update to the new value
      queryClient.setQueryData("todos", (old: TodosResponse) => ({
        ...old,
        todos: old.todos.filter((todo) => todo.id !== deletedTodo.id),
      }));

      // Return a context object with the snapshotted value
      return { previousTodos };
    },
    onSuccess: (data) => {
      showNotification({
        message: `Todo "${data.delete_todos_by_pk.text}" deleted successfully!`,
        icon: <FontAwesomeIcon icon="check" />,
        color: "teal",
      });
    },
    onError: (err, data, context: PreviousTodosContext) => {
      queryClient.setQueryData("todos", context.previousTodos);

      showNotification({
        title: `Todo "${data.text}" could not be added`,
        message: err.error,
        icon: <FontAwesomeIcon icon="times" />,
        color: "red",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries("todos");
    },
  });

  const doneMutation = useMutation<
    MarkTodoAsDoneTodoResponse,
    HasuraError,
    MarkTodoAsDoneVariables
  >(
    ({ id, text, ...data }) =>
      fetchHelper(`${TODOS_URL}/${id}/set-completed`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    {
      onMutate: async (completedTodo) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await Promise.all([
          queryClient.cancelQueries("todos"),
          queryClient.cancelMutations(),
        ]);

        // Snapshot the previous value
        const previousTodos = queryClient.getQueryData("todos");

        // Optimistically update to the new value
        queryClient.setQueryData("todos", (old: TodosResponse) => {
          const todos = [...old.todos];

          const todoIdx = todos.findIndex(
            (todo) => todo.id === completedTodo.id
          );

          const todo = todos[todoIdx];

          todo.completed = completedTodo.completed;

          todos.splice(todoIdx, 1, todo);

          return { ...old, todos };
        });

        // Return a context object with the snapshotted value
        return { previousTodos };
      },
      onSuccess: (data) => {
        const updatedTodo = data.update_todos.returning.pop();

        showNotification({
          message: `Todo "${updatedTodo.text}" marked as ${
            updatedTodo.completed ? "done" : "pending"
          }!`,
          icon: <FontAwesomeIcon icon="check" />,
          color: "teal",
        });
      },
      onError: (err, data, context: PreviousTodosContext) => {
        queryClient.setQueryData("todos", context.previousTodos);

        showNotification({
          title: `Todo "${data.text}" could not be marked as ${
            data.completed ? "completed" : "pending"
          }`,
          message: err.error,
          icon: <FontAwesomeIcon icon="times" />,
          color: "red",
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries("todos");
      },
    }
  );

  const handleDone = useCallback(
    (id: string, completed: boolean, text: string) => {
      return () => {
        doneMutation.mutate({ id, completed: !completed, text });
      };
    },
    [doneMutation]
  );

  const handleDelete = useCallback(
    (id: string, text: string) => {
      return () => {
        // eslint-disable-next-line no-restricted-globals
        const isConfirmed = confirm(
          `Are you sure you want to delete todo "${text}"?`
        );

        if (!isConfirmed) {
          return;
        }

        deleteMutation.mutate({ id, text });
      };
    },
    [deleteMutation]
  );

  const handleAdd = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      addMutation.mutate({ text: newTodo });

      setNewTodo("");
    },
    [addMutation, newTodo]
  );

  return (
    <div className="App">
      <Container mt="xl">
        <Center mb="lg">
          <Title>Todo List</Title>
        </Center>

        <form onSubmit={handleAdd}>
          <TextInput
            className="add-todo-input"
            label="Add todo"
            placeholder="Type a new todo here..."
            value={newTodo}
            onChange={handleChange}
            disabled={todos.isLoading || addMutation.isLoading}
          />
          <Button
            className="submit-button"
            type="submit"
            mt="sm"
            disabled={todos.isLoading || addMutation.isLoading}
            leftIcon={
              addMutation.isLoading ? (
                <FontAwesomeIcon icon="spinner" spin />
              ) : undefined
            }
          >
            {addMutation.isLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>

        <Divider my="xl" />

        {todos.isLoading ? (
          <Center>
            <Loader />
          </Center>
        ) : (
          <Box mb="xl">
            <Paper shadow="xs">
              {todos.data?.map((todo, idx) => {
                return (
                  <React.Fragment key={todo.id}>
                    <TodoItem
                      id={todo.id}
                      completed={todo.completed}
                      onDone={handleDone(todo.id, todo.completed, todo.text)}
                      onDelete={handleDelete(todo.id, todo.text)}
                    >
                      {todo.text}
                    </TodoItem>
                    {idx !== todos.data?.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })}
            </Paper>
          </Box>
        )}
      </Container>
    </div>
  );
}

export default App;
