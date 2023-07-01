import { PayloadAction } from "@reduxjs/toolkit";
import { Todo } from "api/client";

import { State } from "../types";

interface ReorderTodos {
  sourceIndex: number;
  destinationIndex: number;
}

const reorderTodosReducer = () => ({
  reorderTodosPending(state: State, action: PayloadAction<ReorderTodos>) {
    // TODO: add instead meta.arg
    state.statuses.isTodosReordering = true;

    state.prevDragIds = state.ids as string[];

    const targetId = state.ids[action.payload.sourceIndex];
    state.ids.splice(action.payload.sourceIndex, 1);
    state.ids.splice(action.payload.destinationIndex, 0, targetId);

    state.ids.forEach((id, index) => {
      state.entities[id]!.index = state.ids.length - 1 - index;
    });
  },
  reorderTodosFulfilled(state: State, action: PayloadAction<Todo["id"][]>) {
    state.ids = action.payload;

    state.ids.forEach((id, index) => {
      state.entities[id]!.index = state.ids.length - 1 - index;
    });
    state.statuses.isTodosReordering = false;
  },
  // TODO: add instead meta.arg
  reorderTodosRejected(state: State) {
    state.statuses.isTodosReordering = false;

    // backup after fail
    state.ids = state.prevDragIds;
    state.ids.forEach((id, index) => {
      state.entities[id]!.index = state.ids.length - 1 - index;
    });
  },
});

export default reorderTodosReducer;
