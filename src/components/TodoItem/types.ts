import React from "react";

import { Todo } from "../../types";

export interface TodoItemProps extends Pick<Todo, "id" | "completed"> {
  disabled?: boolean;
  text: string;
  onDone: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}
