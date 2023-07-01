import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "store/redux-toolkit/types";
import type { Todo, Task } from "api/client";

import { TaskListFilter } from "constants/tasks";

export const selectTodoById = (state: RootState, todoId: Todo["id"]) =>
  state.todos.entities[todoId];

export const selectTodoIds = (state: RootState) => state.todos.ids;

// Should remember that selector will be broken if it will get different inputs on every call,
// so we need selectors factory for every to do list
// https://redux.js.org/usage/deriving-data-selectors#selector-factories
// https://redux.js.org/usage/deriving-data-selectors#creating-unique-selector-instances
export const makeSelectTasksByFilter = () =>
  createSelector(
    [
      (state: RootState, todoId: Task["todoId"]) =>
        selectTodoById(state, todoId) as Todo,
      (_state: RootState, _todoId: Task["todoId"], filter: TaskListFilter) =>
        filter,
    ],
    (todo, filter) => {
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
    },
  );
