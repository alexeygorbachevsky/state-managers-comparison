import type { Todo, Task } from "../../db";

import { observer } from "../../helpers";
import { dbOptions } from "../../db";
import { TODOS_STORAGE_KEY } from "./constants";

export const getTodosSafelyFromSS = () => {
  let storageTodos = [];
  try {
    storageTodos = JSON.parse(
      sessionStorage.getItem(TODOS_STORAGE_KEY) || "[]",
    );

    if (!Array.isArray(storageTodos)) {
      throw new Error("todos aren't an array");
    }
  } catch (e) {
    sessionStorage.removeItem(TODOS_STORAGE_KEY);
  }

  return storageTodos;
};

export const waitForDBInitialized = () =>
  new Promise(resolve => {
    if (dbOptions.isInitialized) {
      resolve(true);

      return;
    }

    const observeFn = (isDBInitialized: boolean) => {
      if (isDBInitialized) {
        resolve(true);
        observer.unsubscribe(observeFn);
      }
    };

    observer.subscribe(observeFn);
  });

export const serializeTodo = (todo: Todo) => {
  if (!todo.tasks.length) {
    return todo;
  }

  const tasks = [];

  const todoId = todo.id;

  for (const task of todo.tasks) {
    const { todo, ...restTask } = task;

    tasks.push({ ...restTask, todoId });
  }

  return { ...todo, tasks };
};

export const serializeTask = (task: Task) => ({
  ...task,
  todoId: task.todo?.id,
});

export interface ClientTask {
  id: string;
  title: string;
  isChecked: boolean;
  date: string;
  todoId: string;
}

export interface ClientTodo {
  id: string;
  index: number;
  title: string;
  date: string;
  tasks: ClientTask[];
}
