import { EntityAdapter, PayloadAction } from "@reduxjs/toolkit";
import { Todo } from "api/client";

import { State } from "../types";

interface UpdateTodoTitle {
  id: Todo["id"];
  title: Todo["title"];
}

const updateTodoTitleReducer = (todosAdapter: EntityAdapter<Todo>) => ({
  updateTodoTitlePending(state: State, action: PayloadAction<UpdateTodoTitle>) {
    state.statuses.todosUpdate[action.payload.id] = {
      isTodoUpdating: true,
    };
  },
  updateTodoTitleFulfilled(state: State, action: PayloadAction<Todo>) {
    delete state.statuses.todosUpdate[action.payload.id];

    todosAdapter.updateOne(state, {
      ...action.payload,
      changes: { title: action.payload.title },
    });
  },
  updateTodoTitleRejected(state: State, action: PayloadAction<UpdateTodoTitle>) {
    delete state.statuses.todosUpdate[action.payload.id];
  },
});

export default updateTodoTitleReducer;
