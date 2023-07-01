import type { Todo } from "api/mock-server/todos/db";
import type { ClientTodo } from "../../ducks";

import db from "api/mock-server/todos/db";
import {
  getTodosSafelyFromSS,
  serializeTodo,
  TODOS_STORAGE_KEY,
} from "../../ducks";

export const removeTodoFromSS = (id: string) => {
  let todos = getTodosSafelyFromSS();

  let deletedTodo;
  todos = todos.filter((el: ClientTodo) => {
    if (el.id === id) {
      deletedTodo = el;
      return false;
    }

    return true;
  });

  if (!deletedTodo) {
    return null;
  }

  sessionStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));

  return serializeTodo(deletedTodo) as ClientTodo;
};

export const removeTodoFromDB = (id: string) => {
  db.task.delete({
    where: {
      todo: {
        id: {
          equals: id,
        },
      },
    },
  });

  const deletedTodo = db.todo.delete({
    where: { id: { equals: id } },
  }) as Todo;

  if (!deletedTodo) {
    return null;
  }

  return serializeTodo(deletedTodo) as ClientTodo;
};
