import {
  ActionReducerMapBuilder,
  EntityAdapter,
  EntityState,
  nanoid,
} from "@reduxjs/toolkit";

import type { Todo } from "api/client";
import type { ExtraInitialState } from "../types";

import { createTodo as createTodoFetch } from "api/client";

import { addAlertThunk, ALERT_DEFAULT_TIMEOUT, AlertTypes } from "../../alerts";
import {createAppAsyncThunk} from "../../../types";

const createTodo = createAppAsyncThunk<
  Awaited<ReturnType<typeof createTodoFetch>>,
  Todo["title"]
>("todos/createTodo", async (title, { dispatch, getState }) => {
  const { isSessionStorage, loadDelay } = getState().todos;

  let todo;
  try {
    todo = await createTodoFetch({ title, isSessionStorage, loadDelay });
  } catch (err) {
    dispatch(
      addAlertThunk({
        id: nanoid(),
        message: "Error is occurred - unable to create todo.",
        type: AlertTypes.error,
      }),
    );

    throw err;
  }

  dispatch(
    addAlertThunk({
      id: nanoid(),
      message: `Todo "${todo.title}" is successfully created`,
      type: AlertTypes.success,
      timeout: ALERT_DEFAULT_TIMEOUT,
    }),
  );

  return todo;
});

export const createTodoReducer = (
  builder: ActionReducerMapBuilder<EntityState<Todo> & ExtraInitialState>,
  todosAdapter: EntityAdapter<Todo>,
) => {
  builder
    .addCase(createTodo.pending, state => {
      state.statuses.isTodoCreating = true;
    })
    .addCase(createTodo.fulfilled, (state, action) => {
      state.statuses.isTodoCreating = false;
      todosAdapter.addOne(state, action.payload);
    })
    .addCase(createTodo.rejected, state => {
      state.statuses.isTodoCreating = false;
    });

  return builder;
};

export default createTodo;
