import { ActionReducerMapBuilder, EntityState, nanoid } from "@reduxjs/toolkit";

import type { ExtraInitialState } from "../types";

import type { Todo } from "api/client";
import { reorderTodos as reorderTodosFetch } from "api/client";

import { addAlertThunk, ALERT_DEFAULT_TIMEOUT, AlertTypes } from "../../alerts";
import {createAppAsyncThunk} from "../../../types";

interface ReorderTodos {
  sourceIndex: number;
  destinationIndex: number;
}

const reorderTodos = createAppAsyncThunk<
  Awaited<ReturnType<typeof reorderTodosFetch>>,
  ReorderTodos
>("todos/reorderTodos", async (data, { dispatch, getState }) => {
  const { isSessionStorage, ids, loadDelay } = getState().todos;

  let result;
  try {
    result = await reorderTodosFetch({ ids, isSessionStorage, loadDelay });
  } catch (err) {
    dispatch(
      addAlertThunk({
        id: nanoid(),
        message: "Error is occurred - unable to reorder todos",
        type: AlertTypes.error,
      }),
    );

    throw err;
  }

  dispatch(
    addAlertThunk({
      id: nanoid(),
      message: "Todos are successfully reordered",
      type: AlertTypes.success,
      timeout: ALERT_DEFAULT_TIMEOUT,
    }),
  );

  return result;
});

export const reorderTodosReducer = (
  builder: ActionReducerMapBuilder<EntityState<Todo> & ExtraInitialState>,
) => {
  builder
    .addCase(reorderTodos.pending, (state, action) => {
      state.statuses.isTodosReordering = true;

      state.prevDragIds = state.ids as string[];

      const targetId = state.ids[action.meta.arg.sourceIndex];
      state.ids.splice(action.meta.arg.sourceIndex, 1);
      state.ids.splice(action.meta.arg.destinationIndex, 0, targetId);

      state.ids.forEach((id, index) => {
        state.entities[id]!.index = state.ids.length - 1 - index;
      });
    })
    .addCase(reorderTodos.fulfilled, (state, action) => {
      state.ids = action.payload.ids;

      state.ids.forEach((id, index) => {
        state.entities[id]!.index = state.ids.length - 1 - index;
      });
      state.statuses.isTodosReordering = false;
    })
    .addCase(reorderTodos.rejected, state => {
      state.statuses.isTodosReordering = false;

      // backup after fail
      state.ids = state.prevDragIds;
      state.ids.forEach((id, index) => {
        state.entities[id]!.index = state.ids.length - 1 - index;
      });
    });

  return builder;
};

export default reorderTodos;
