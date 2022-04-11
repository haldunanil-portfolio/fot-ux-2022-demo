import React from "react";

import { Todo } from "../../types";

export interface TodoItemProps extends Pick<Todo, "id" | "completed"> {
  children?: React.ReactNode | React.ReactNode[];
  disabled?: boolean;
  onDone: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}
