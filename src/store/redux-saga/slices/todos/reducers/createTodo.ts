import { EntityAdapter, PayloadAction } from "@reduxjs/toolkit";
import { Todo } from "api/client";

import { State } from "../types";

const createTodoReducer = (todosAdapter: EntityAdapter<Todo>) => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createTodoPending(state: State, action: PayloadAction<Todo["title"]>) {
    state.statuses.isTodoCreating = true;
  },
  createTodoFulfilled(state: State, action: PayloadAction<Todo>) {
    state.statuses.isTodoCreating = false;
    todosAdapter.addOne(state, action.payload);
  },
  createTodoRejected(state: State) {
    state.statuses.isTodoCreating = false;
  },
});

export default createTodoReducer;
