import type { Todo } from "api/mock-server/todos/db";
import type { ClientTodo } from "../../ducks";

import db from "api/mock-server/todos/db";
import { getTodosSafelyFromSS, TODOS_STORAGE_KEY } from "../../ducks";

export const reorderTodosSS = (ids: string[]) => {
  const todos = getTodosSafelyFromSS();

  const indexesMap: { [key: string]: number } = {};
  ids.forEach((id: string, index: number) => {
    indexesMap[id] = todos.length - 1 - index;
  });

  const updatedTodos = todos.map((todo: ClientTodo) => {
    if (typeof indexesMap[todo.id] === "number") {
      return {
        ...todo,
        index: indexesMap[todo.id],
      };
    }

    return todo;
  });

  sessionStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(updatedTodos));
};

export const reorderTodosDB = (ids: string[]) => {
  const allTodos = db.todo.findMany({ orderBy: { index: "desc" } });

  const indexesMap: { [key: string]: number } = {};
  ids.forEach((id: string, index: number) => {
    indexesMap[id] = allTodos.length - 1 - index;
  });

  for (const todo of allTodos) {
    if (typeof indexesMap[todo.id] !== "number") {
      continue;
    }

    db.todo.update({
      where: {
        id: {
          equals: todo.id,
        },
      },
      data: {
        index: indexesMap[todo.id],
      },
    }) as Todo;
  }
};
