import { EntityId } from "@reduxjs/toolkit";

import type { DelaysType } from "constants/sessionStorage";
import type { Todo } from "../types";

import { instance } from "../config";

interface ReorderTodosArgs {
  ids: EntityId[];
  isSessionStorage: boolean;
  loadDelay: DelaysType;
}

interface ReorderTodosReturn {
  ids: Todo["id"][];
}

interface UpdateTodoTitle {
  (args: ReorderTodosArgs): Promise<ReorderTodosReturn>;
}

const reorderTodos: UpdateTodoTitle = async data => {
  const response = await instance.put(`todos-reorder`, data);

  return response.data;
};

export default reorderTodos;
