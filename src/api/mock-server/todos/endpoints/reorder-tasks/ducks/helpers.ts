import { DraggableLocation } from "react-beautiful-dnd";

import type { Todo } from "api/mock-server/todos/db";
import type { ClientTodo } from "../../ducks";

import db from "api/mock-server/todos/db";
import {
  getTodosSafelyFromSS,
  serializeTodo,
  TODOS_STORAGE_KEY,
} from "../../ducks";

interface ReorderTasks {
  source: DraggableLocation;
  destination: DraggableLocation;
}

export const reorderTasksSS = ({ destination, source }: ReorderTasks) => {
  const todos = getTodosSafelyFromSS();

  const sourceTodo = todos.find(
    (todo: ClientTodo) => todo.id === source.droppableId,
  );

  if (!sourceTodo) {
    return null;
  }

  const targetTask = sourceTodo.tasks[source.index];

  let updatedSourceTodo;
  let updatedDestinationTodo;

  const updatedTodos = todos.map((todo: ClientTodo) => {
    if (
      todo.id === source.droppableId &&
      source.droppableId === destination.droppableId
    ) {
      todo.tasks.splice(source.index, 1);
      todo.tasks.splice(destination.index, 0, targetTask);

      updatedSourceTodo = {
        ...todo,
        tasks: todo.tasks,
      };
      updatedDestinationTodo = updatedSourceTodo;

      return updatedDestinationTodo;
    }

    if (todo.id === source.droppableId) {
      todo.tasks.splice(source.index, 1);

      updatedSourceTodo = {
        ...todo,
        tasks: todo.tasks,
      };

      return updatedSourceTodo;
    }

    if (todo.id === destination.droppableId) {
      targetTask.todoId = destination.droppableId;
      todo.tasks.splice(destination.index, 0, targetTask);

      updatedDestinationTodo = {
        ...todo,
        tasks: todo.tasks,
      };

      return updatedDestinationTodo;
    }

    return todo;
  });

  sessionStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(updatedTodos));

  return { updatedSourceTodo, updatedDestinationTodo };
};

export const reorderTasksDB = ({ destination, source }: ReorderTasks) => {
  const allTodos = db.todo.findMany({ orderBy: { index: "desc" } });

  const sourceTodo = db.todo.findFirst({
    where: {
      id: {
        equals: source.droppableId,
      },
    },
  });

  const sourceTask = sourceTodo?.tasks[source.index];

  if (!sourceTask) {
    return null;
  }

  let todosUpdatedCount = 0;

  for (const todo of allTodos) {
    if (
      todo.id === source.droppableId &&
      todo.id === destination.droppableId &&
      todosUpdatedCount === 1
    ) {
      break;
    }

    if (todosUpdatedCount === 2) {
      break;
    }

    if (todo.id === source.droppableId || todo.id === destination.droppableId) {
      todosUpdatedCount++;

      db.todo.update({
        where: {
          id: {
            equals: todo.id,
          },
        },
        data: {
          tasks: prevTasks => {
            const tasks = prevTasks.slice();

            if (
              todo.id === source.droppableId &&
              todo.id === destination.droppableId
            ) {
              tasks.splice(source.index, 1);
              tasks.splice(destination.index, 0, sourceTask);

              return tasks;
            }

            if (todo.id === destination.droppableId) {
              tasks.splice(destination.index, 0, sourceTask);

              db.task.update({
                where: {
                  todo: {
                    id: {
                      equals: sourceTodo?.id,
                    },
                  },
                },
                data: {
                  todo,
                },
              });

              return tasks;
            }

            tasks.splice(source.index, 1);

            return tasks;
          },
        },
      }) as Todo;
    }
  }

  const updatedSourceTodo = db.todo.findFirst({
    where: {
      id: {
        equals: source.droppableId,
      },
    },
  }) as Todo;

  const updatedDestinationTodo = db.todo.findFirst({
    where: {
      id: {
        equals: destination.droppableId,
      },
    },
  }) as Todo;

  return {
    updatedSourceTodo: serializeTodo(updatedSourceTodo),
    updatedDestinationTodo: serializeTodo(updatedDestinationTodo),
  };
};
