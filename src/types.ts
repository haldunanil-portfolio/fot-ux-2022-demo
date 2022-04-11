export interface Todo {
  id: string;
  created_at: string;
  updated_at: string;
  completed: boolean;
  text: string;
}

export interface TodosResponse {
  todos: Todo[];
}

export interface HasuraError {
  code: string;
  error: string;
  path: string;
}

export interface AddTodoVariables {
  text: string;
}

export interface AddTodoResponse {
  insert_todos_one: Todo;
}

export interface MarkTodoAsDoneVariables {
  id: string;
  completed: boolean;
  text: string;
}

export interface MarkTodoAsDoneTodoResponse {
  update_todos: {
    affected_rows: number;
    returning: Todo[];
  };
}

export interface DeleteTodoVariables {
  id: string;
  text: string;
}

export interface DeleteTodoResponse {
  delete_todos_by_pk: Pick<Todo, "id" | "text">;
}

export interface PreviousTodosContext {
  previousTodos: TodosResponse;
}
