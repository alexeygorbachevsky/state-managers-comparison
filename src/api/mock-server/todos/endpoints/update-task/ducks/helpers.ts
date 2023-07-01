import type { Task } from "api/mock-server/todos/db";
import type { ClientTask, ClientTodo } from "../../ducks";

import db from "api/mock-server/todos/db";
import {
  getTodosSafelyFromSS,
  serializeTodo,
  TODOS_STORAGE_KEY,
} from "../../ducks";

interface UpdateTask {
  todoId: string;
  id: string;
  taskData: Partial<Task>;
}

export const updateTaskSS = ({ todoId, id, taskData }: UpdateTask) => {
  const todos = getTodosSafelyFromSS();

  const targetTodo = todos.find((el: ClientTask) => el.id === todoId);

  if (!targetTodo) {
    return null;
  }

  let isTaskFound = false;
  targetTodo.tasks = targetTodo.tasks.map((el: ClientTask) => {
    if (el.id === id) {
      isTaskFound = true;
      return {
        ...el,
        ...(taskData.title && { title: taskData.title }),
        ...(typeof taskData.isChecked === "boolean" && {
          isChecked: taskData.isChecked,
        }),
      };
    }

    return el;
  });

  if (!isTaskFound) {
    return null;
  }

  const serializedTodo = serializeTodo(targetTodo) as ClientTodo;

  const updatedTodos = todos.map((el: ClientTodo) => {
    if (el.id === todoId) {
      return serializedTodo;
    }
    return el;
  });

  sessionStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(updatedTodos));

  return serializedTodo;
};

export const updateTaskDB = ({ todoId, id, taskData }: UpdateTask) => {
  const task = db.task.update({
    where: {
      id: {
        equals: id,
      },
      todo: {
        id: {
          equals: todoId,
        },
      },
    },
    data: {
      ...(taskData.title && { title: taskData.title }),
      ...(typeof taskData.isChecked === "boolean" && {
        isChecked: taskData.isChecked,
      }),
    },
  });

  const todo = db.todo.findFirst({
    where: {
      id: {
        equals: todoId,
      },
    },
  });

  if (!todo || !task) {
    return null;
  }

  return serializeTodo(todo) as ClientTodo;
};
