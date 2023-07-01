import {
  ActionReducerMapBuilder,
  EntityAdapter,
  EntityState,
  nanoid,
} from "@reduxjs/toolkit";

import type { Todo } from "api/client";
import type { ExtraInitialState } from "../types";

import { removeTodo as removeTodoFetch } from "api/client";

import { addAlertThunk, AlertTypes, ALERT_DEFAULT_TIMEOUT } from "../../alerts";
import {createAppAsyncThunk} from "../../../types";

const removeTodo = createAppAsyncThunk<
  Awaited<ReturnType<typeof removeTodoFetch>>,
  Todo["id"]
>("todos/removeTodo", async (id, { dispatch, getState }) => {
  const { isSessionStorage, loadDelay } = getState().todos;

  let todo;
  try {
    todo = await removeTodoFetch({ id, isSessionStorage, loadDelay });
  } catch (err) {
    dispatch(
      addAlertThunk({
        id: nanoid(),
        message: "Error is occurred - unable to remove todo.",
        type: AlertTypes.error,
      }),
    );

    throw err;
  }

  dispatch(
    addAlertThunk({
      id: nanoid(),
      message: `Todo "${todo.title}" is successfully removed`,
      type: AlertTypes.success,
      timeout: ALERT_DEFAULT_TIMEOUT,
    }),
  );

  return todo;
});

export const removeTodoReducer = (
  builder: ActionReducerMapBuilder<EntityState<Todo> & ExtraInitialState>,
  todosAdapter: EntityAdapter<Todo>,
) => {
  builder
    .addCase(removeTodo.pending, (state, action) => {
      state.statuses.todosUpdate[action.meta.arg] = {
          isTodoUpdating: true
      };
    })
    .addCase(removeTodo.fulfilled, (state, action) => {
      delete state.statuses.todosUpdate[action.payload.id];

      todosAdapter.removeOne(state, action.payload.id);

      state.cursor = (state.ids[state.ids.length - 1] || null) as
        | Todo["id"]
        | null;
    })
    .addCase(removeTodo.rejected, (state, action) => {
      delete state.statuses.todosUpdate[action.meta.arg];
    });

  return builder;
};

export default removeTodo;
