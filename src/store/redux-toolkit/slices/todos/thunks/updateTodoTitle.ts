import {
  ActionReducerMapBuilder,
  EntityAdapter,
  EntityState,
  nanoid,
} from "@reduxjs/toolkit";

import type { Todo } from "api/client";
import type { ExtraInitialState } from "../types";

import { updateTodoTitle as updateTodoTitleFetch } from "api/client";

import { addAlertThunk, AlertTypes, ALERT_DEFAULT_TIMEOUT } from "../../alerts";
import { createAppAsyncThunk } from "../../../types";

interface UpdateTodoTitle {
  id: Todo["id"];
  title: Todo["title"];
}

const updateTodoTitle = createAppAsyncThunk<
  Awaited<ReturnType<typeof updateTodoTitleFetch>>,
  UpdateTodoTitle
>("todos/updateTodoTitle", async (data, { dispatch, getState }) => {
  const { isSessionStorage, loadDelay } = getState().todos;

  let todo;
  try {
    todo = await updateTodoTitleFetch({ ...data, isSessionStorage, loadDelay });
  } catch (err) {
    dispatch(
      addAlertThunk({
        id: nanoid(),
        message: "Error is occurred - unable to update todo title.",
        type: AlertTypes.error,
      }),
    );

    throw err;
  }

  dispatch(
    addAlertThunk({
      id: nanoid(),
      message: `Todo title is successfully updated to "${todo.title}"`,
      type: AlertTypes.success,
      timeout: ALERT_DEFAULT_TIMEOUT,
    }),
  );

  return todo;
});

export const updateTodoTitleReducer = (
  builder: ActionReducerMapBuilder<EntityState<Todo> & ExtraInitialState>,
  todosAdapter: EntityAdapter<Todo>,
) => {
  builder
    .addCase(updateTodoTitle.pending, (state, action) => {
      state.statuses.todosUpdate[action.meta.arg.id] = {
        isTodoUpdating: true,
      };
    })
    .addCase(updateTodoTitle.fulfilled, (state, action) => {
      delete state.statuses.todosUpdate[action.payload.id];

      todosAdapter.updateOne(state, {
        ...action.payload,
        changes: { title: action.payload.title },
      });
    })
    .addCase(updateTodoTitle.rejected, (state, action) => {
      delete state.statuses.todosUpdate[action.meta.arg.id];
    });

  return builder;
};

export default updateTodoTitle;
