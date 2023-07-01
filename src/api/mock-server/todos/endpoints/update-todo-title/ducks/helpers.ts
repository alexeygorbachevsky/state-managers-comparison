import type { Todo } from "api/mock-server/todos/db";
import type { ClientTodo } from "../../ducks";

import db from "api/mock-server/todos/db";
import {
  getTodosSafelyFromSS,
  serializeTodo,
  TODOS_STORAGE_KEY,
} from "../../ducks";

interface UpdateTodoTitle {
  id: string;
  todoData: Partial<Todo>;
}

export const updateTodoTitleSS = ({ todoData, id }: UpdateTodoTitle) => {
  const todos = getTodosSafelyFromSS();

  const targetTodo = todos.find((el: ClientTodo) => el.id === id);

  if (!targetTodo) {
    return null;
  }

  targetTodo.title = todoData.title;

  const serializedTodo = serializeTodo(targetTodo) as ClientTodo;

  const updatedTodos = todos.map((el: ClientTodo) => {
    if (el.id === id) {
      return serializedTodo;
    }

    return el;
  });

  sessionStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(updatedTodos));

  return serializedTodo;
};

export const updateTodoTitleDB = ({ todoData, id }: UpdateTodoTitle) => {
  const todo = db.todo.update({
    where: {
      id: {
        equals: id,
      },
    },
    data: {
      title: todoData.title,
    },
  });

  if (!todo) {
    return null;
  }

  return serializeTodo(todo) as ClientTodo;
};
