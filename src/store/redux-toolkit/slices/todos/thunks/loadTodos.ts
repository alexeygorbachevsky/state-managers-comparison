import {
  ActionReducerMapBuilder,
  EntityState,
  EntityAdapter,
  nanoid,
} from "@reduxjs/toolkit";

import type { Todo } from "api/client";
import type { ExtraInitialState } from "../types";

import { fetchTodos } from "api/client";

import { STATUS } from "constants/status";

import { addAlertThunk, AlertTypes } from "../../alerts";
import {createAppAsyncThunk} from "../../../types";

interface LoadTodosPayload {
  batchSize?: number;
}

const loadTodos = createAppAsyncThunk<
  Awaited<ReturnType<typeof fetchTodos>>,
  LoadTodosPayload | void
>("todos/loadTodos", async (_, { getState, dispatch }) => {
  const { cursor, search, isSessionStorage, loadDelay } = getState().todos;

  let data;

  try {
    data = await fetchTodos({
      cursor,
      search,
      isSessionStorage,
      loadDelay
    });
  } catch (err) {
    dispatch(
      addAlertThunk({
        id: nanoid(),
        message: "Error is occurred - unable to load todos.",
        type: AlertTypes.error,
      }),
    );

    throw err;
  }

  return data;
});

export const loadTodosReducer = (
  builder: ActionReducerMapBuilder<EntityState<Todo> & ExtraInitialState>,
  todosAdapter: EntityAdapter<Todo>,
) => {
  builder
    .addCase(loadTodos.pending, state => {
      state.statuses.todosLoad = STATUS.loading;
    })
    .addCase(loadTodos.fulfilled, (state, action) => {
      state.statuses.todosLoad = STATUS.succeeded;
      state.isLastBatch = action.payload.isLastBatch;

      const todos = action.payload.todos;

      if (todos.length) {
        state.cursor = todos[todos.length - 1].id;
      }

      todosAdapter.addMany(state, todos);
    })
    .addCase(loadTodos.rejected, state => {
      state.statuses.todosLoad = STATUS.failed;
    });

  return builder;
};

export default loadTodos;
