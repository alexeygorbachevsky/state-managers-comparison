import { EntityAdapter, PayloadAction } from "@reduxjs/toolkit";

import {Task, Todo} from "api/client";

import { State } from "../types";

interface CreateTaskArgs {
  todoId: Todo["id"];
  title: Task["title"];
}

const createTaskReducer = (todosAdapter: EntityAdapter<Todo>) => ({
  // Todo: action.meta.arg.todoId
  createTaskPending(state: State, action: PayloadAction<CreateTaskArgs>) {
    state.statuses.todosUpdate[action.payload.todoId] = {
      isTodoUpdating: true,
    };
  },
  createTaskFulfilled(state: State, action: PayloadAction<Todo>) {
    delete state.statuses.todosUpdate[action.payload.id];

    todosAdapter.updateOne(state, {
      ...action.payload,
      changes: {
        tasks: action.payload.tasks,
      },
    });
  },
  createTaskRejected(state: State, action: PayloadAction<string>) {
    // TODO: action.meta.arg.todoId
    delete state.statuses.todosUpdate[action.payload];
  },
});

export default createTaskReducer;
