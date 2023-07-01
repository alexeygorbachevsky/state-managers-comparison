import { nanoid } from "@reduxjs/toolkit";

import type { Task, Todo } from "api/mock-server/todos/db";
import type { ClientTodo } from "../../ducks";

import db from "api/mock-server/todos/db";
import {
  getTodosSafelyFromSS,
  serializeTodo,
  TODOS_STORAGE_KEY,
} from "../../ducks";

interface CreateTodo {
  todoId: string;
  taskData: Partial<Task>;
}

export const createTodoSS = ({ todoId, taskData }: CreateTodo) => {
  const todos = getTodosSafelyFromSS();

  const targetTodo = todos.find((todo: Todo) => todo.id === todoId);

  targetTodo.tasks.unshift({ ...taskData, todoId, id: nanoid() });

  const serializableTodo = serializeTodo(targetTodo) as ClientTodo;

  const updatedTodos = todos.map((todo: Todo) => {
    if (todo.id === todoId) {
      return serializableTodo;
    }

    return todo;
  });

  sessionStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(updatedTodos));

  return serializableTodo;
};

export const createTodoDB = ({ todoId, taskData }: CreateTodo) => {
  taskData.todo = db.todo.findFirst({
    where: { id: { equals: todoId } },
  }) as Todo;

  const task = db.task.create(taskData);

  taskData.todo = db.todo.update({
    where: { id: { equals: todoId } },
    data: {
      tasks: tasks => [task, ...tasks],
    },
  }) as Todo;

  return serializeTodo(taskData.todo as Todo);
};
