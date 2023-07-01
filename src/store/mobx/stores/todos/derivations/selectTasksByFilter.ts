import type { Task } from "api/client";
import type TodosStore from "../todosStore";

import { TaskListFilter } from "constants/tasks";

function selectTasksByFilter(
  this: TodosStore,
  id: Task["todoId"],
  filter: TaskListFilter,
) {
  const todo = this.selectTodoById(id);

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
}

export default selectTasksByFilter;
