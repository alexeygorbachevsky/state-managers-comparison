import { DraggableLocation } from "react-beautiful-dnd";

import type { DelaysType } from "constants/sessionStorage";

import { Todo } from "api/client";

import { instance } from "../config";

interface ReorderTodosArgs {
  source: DraggableLocation;
  destination: DraggableLocation;
  isSessionStorage: boolean;
  loadDelay: DelaysType;
}

interface ReorderTodosReturn {
  sourceTodo: Todo;
  destinationTodo: Todo;
}

interface UpdateTodoTitle {
  (args: ReorderTodosArgs): Promise<ReorderTodosReturn>;
}

const reorderTasks: UpdateTodoTitle = async data => {
  const response = await instance.put(`tasks-reorder`, data);

  return response.data;
};

export default reorderTasks;
