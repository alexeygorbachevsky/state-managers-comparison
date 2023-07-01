import { EntityAdapter, PayloadAction } from "@reduxjs/toolkit";
import { Todo } from "api/client";
import { STATUS } from "constants/status";

import { State } from "../types";

const loadTodosReducer = (todosAdapter: EntityAdapter<Todo>) => ({
  loadTodosPending(state: State) {
    state.statuses.todosLoad = STATUS.loading;
  },
  loadTodosFulfilled(
    state: State,
    action: PayloadAction<{ isLastBatch: boolean; todos: Todo[] }>,
  ) {
    state.statuses.todosLoad = STATUS.succeeded;
    state.isLastBatch = action.payload.isLastBatch;

    const todos = action.payload.todos;

    if (todos.length) {
      state.cursor = todos[todos.length - 1].id;
    }

    todosAdapter.addMany(state, todos);
  },
  loadTodosRejected(state: State) {
    state.statuses.todosLoad = STATUS.failed;
  },
});

export default loadTodosReducer;
