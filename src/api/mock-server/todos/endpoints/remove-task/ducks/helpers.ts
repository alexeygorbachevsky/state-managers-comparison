import type { Todo } from "api/mock-server/todos/db";
import type { ClientTask, ClientTodo } from "../../ducks";

import db from "api/mock-server/todos/db";
import {
  getTodosSafelyFromSS,
  serializeTodo,
  TODOS_STORAGE_KEY,
} from "../../ducks";

interface RemoveTask {
  taskId: string;
  todoId: string;
}

export const removeTaskFromSS = ({ taskId, todoId }: RemoveTask) => {
  const todos = getTodosSafelyFromSS();
  const todo = todos.find((el: Todo) => el.id === todoId);

  if (!todo) {
    return null;
  }

  const serializedTodo = serializeTodo(todo) as ClientTodo;

  serializedTodo.tasks = serializedTodo.tasks.filter(
    (task: ClientTask) => task.id !== taskId,
  );

  const updatedTodos = todos.map((el: Todo) => {
    if (el.id === todoId) {
      return serializedTodo;
    }
    return el;
  });

  sessionStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(updatedTodos));

  return serializedTodo;
};

export const removeTaskFromDB = ({ taskId, todoId }: RemoveTask) => {
  db.task.delete({
    where: {
      id: {
        equals: taskId,
      },
    },
  });

  const todo = db.todo.findFirst({
    where: { id: { equals: todoId } },
  }) as Todo;

  if (!todo) {
    return null;
  }

  return serializeTodo(todo) as ClientTodo;
};
