import { Task, Todo } from "api/client";

import { TaskListFilter } from "constants/tasks";

export const selectTasksByFilter = (
  todo: Todo,
  todoId: Task["todoId"],
  filter: TaskListFilter,
) => {
  if (!todo) {
    return [];
  }

  if (filter === TaskListFilter.all) {
    return todo.tasks;
  }

  return todo.tasks.filter(task => {
    if (filter === TaskListFilter.done) {
      return task.isChecked;
    }

    return !task.isChecked;
  });
};
