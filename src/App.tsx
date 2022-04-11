import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  Grid,
  Paper,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { v4 as uuidv4 } from "uuid";
import React, { useState } from "react";

library.add(far, fas);

const TodoItem = ({ children, completed, onDone, onDelete }: any) => {
  return (
    <Box p="md">
      <Grid>
        <Grid.Col span={10} sx={{ display: "flex", alignItems: "center" }}>
          <Text sx={{ ...(completed && { textDecoration: "line-through" }) }}>
            {children}
          </Text>
        </Grid.Col>
        <Grid.Col span={2}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="outline" color="green" mr="sm" onClick={onDone}>
              <FontAwesomeIcon icon="check" />
            </Button>
            <Button variant="outline" color="red" onClick={onDelete}>
              <FontAwesomeIcon icon="times" />
            </Button>
          </Box>
        </Grid.Col>
      </Grid>
    </Box>
  );
};

function App() {
  const [todos, setTodos] = useState([
    {
      id: "514fb447-0844-4cb5-aa7d-93ac1f376acc",
      text: "Crush this presentation",
      completed: false,
    },
    {
      id: "2168ca94-06d4-4a03-9f66-acc7202381a2",
      text: "Get milk",
      completed: true,
    },
  ]);
  const [newTodo, setNewTodo] = useState("");

  const handleDone = (id: string) => {
    return () => {
      const newTodos = [...todos];

      const todoIdx = newTodos.findIndex((todo) => todo.id === id);

      if (todoIdx === -1) {
        return newTodos;
      }

      const todo = newTodos[todoIdx];

      todo.completed = !todo.completed;

      newTodos.splice(todoIdx, 1, todo);

      setTodos(newTodos);
    };
  };

  const handleDelete = (id: string) => {
    return () => {
      const todo = todos.find((todo) => todo.id === id);

      if (!todo) {
        return;
      }

      // eslint-disable-next-line no-restricted-globals
      const isConfirmed = confirm(
        `Are you sure you want to delete todo "${todo.text}"?`
      );

      if (!isConfirmed) {
        return;
      }

      setTodos(todos.filter((todo) => todo.id !== id));
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodo(e.target.value);
  };

  const invalid = todos.some((todo) => todo.text === newTodo);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();

    if (invalid) {
      return;
    }

    setTodos([...todos, { id: uuidv4(), completed: false, text: newTodo }]);
    setNewTodo("");
  };

  return (
    <div className="App">
      <Container mt="xl">
        <Center mb="lg">
          <Title>Todo List</Title>
        </Center>
        <form onSubmit={handleAdd}>
          <TextInput
            label="Add todo"
            placeholder="Type a new todo here..."
            value={newTodo}
            onChange={handleChange}
            error={invalid && "Todo already exists!"}
          />
          <Button type="submit" mt="sm">
            Submit
          </Button>
        </form>

        <Box mt="lg">
          <Paper shadow="xs">
            {todos.map((todo, idx) => {
              return (
                <React.Fragment key={todo.id}>
                  <TodoItem
                    completed={todo.completed}
                    onDone={handleDone(todo.id)}
                    onDelete={handleDelete(todo.id)}
                  >
                    {todo.text}
                  </TodoItem>
                  {idx !== todos.length - 1 && <Divider />}
                </React.Fragment>
              );
            })}
          </Paper>
        </Box>
      </Container>
    </div>
  );
}

export default App;
