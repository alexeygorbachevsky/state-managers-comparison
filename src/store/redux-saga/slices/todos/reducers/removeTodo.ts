import { EntityAdapter, PayloadAction } from "@reduxjs/toolkit";
import { Todo } from "api/client";

import { State } from "../types";

const removeTodoReducer = (todosAdapter: EntityAdapter<Todo>) => ({
  removeTodoPending(state: State, action: PayloadAction<Todo["id"]>) {
    state.statuses.todosUpdate[action.payload] = {
      isTodoUpdating: true,
    };
  },
  removeTodoFulfilled(state: State, action: PayloadAction<Todo>) {
    delete state.statuses.todosUpdate[action.payload.id];

    todosAdapter.removeOne(state, action.payload.id);

    state.cursor = (state.ids[state.ids.length - 1] || null) as
      | Todo["id"]
      | null;
  },
  removeTodoRejected(state: State, action: PayloadAction<Todo["id"]>) {
    delete state.statuses.todosUpdate[action.payload];
  },
});

export default removeTodoReducer;
