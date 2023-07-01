import { setupWorker } from "msw";

import {
  createTodo,
  getTodos,
  removeTodo,
  updateTodoTitle,
  createTask,
  removeTask,
  updateTask,
  reorderTodos,
  reorderTasks,
} from "./endpoints";

import { initializeDB } from "./helpers";

initializeDB();

export const worker = setupWorker(
  getTodos,
  createTodo,
  removeTodo,
  updateTodoTitle,
  createTask,
  removeTask,
  updateTask,
  reorderTodos,
  reorderTasks,
);
// worker.printHandlers() // Optional: nice for debugging to see all available route handlers that will be intercepted
