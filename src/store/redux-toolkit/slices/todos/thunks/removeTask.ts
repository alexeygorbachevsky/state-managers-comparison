import {
  ActionReducerMapBuilder,
  EntityAdapter,
  EntityState,
  nanoid,
} from "@reduxjs/toolkit";

import type { Task, Todo } from "api/client";
import type { ExtraInitialState } from "../types";

import { removeTask as removeTaskFetch } from "api/client";

import { addAlertThunk, AlertTypes, ALERT_DEFAULT_TIMEOUT } from "../../alerts";
import {createAppAsyncThunk} from "../../../types";

interface RemoveTaskArgs {
  todoId: Todo["id"];
  id: Task["id"];
}

const removeTask = createAppAsyncThunk<
  Awaited<ReturnType<typeof removeTaskFetch>>,
  RemoveTaskArgs
>("todos/removeTask", async (args, { dispatch, getState }) => {
  const { isSessionStorage, loadDelay } = getState().todos;

  let todo;
  try {
    todo = await removeTaskFetch({ ...args, isSessionStorage, loadDelay });
  } catch (err) {
    dispatch(
      addAlertThunk({
        id: nanoid(),
        message: "Error is occurred - unable to remove task.",
        type: AlertTypes.error,
      }),
    );

    throw err;
  }

  dispatch(
    addAlertThunk({
      id: nanoid(),
      message: `Task is successfully removed from "${todo.title}" todo`,
      type: AlertTypes.success,
      timeout: ALERT_DEFAULT_TIMEOUT,
    }),
  );

  return todo;
});

export const removeTaskReducer = (
  builder: ActionReducerMapBuilder<EntityState<Todo> & ExtraInitialState>,
  todosAdapter: EntityAdapter<Todo>,
) => {
  builder
    .addCase(removeTask.pending, (state, action) => {
      const { todoId, id } = action.meta.arg;

      if (state.statuses.todosUpdate[todoId]) {
        state.statuses.todosUpdate[todoId]![id] = true;
      } else {
        state.statuses.todosUpdate = {
          ...state.statuses.todosUpdate,
          [todoId]: {
            [id]: true,
          },
        };
      }
    })
    .addCase(removeTask.fulfilled, (state, action) => {
      const { todoId, id } = action.meta.arg;

      delete state.statuses.todosUpdate[todoId]![id];

      if (!Object.keys(state.statuses.todosUpdate[todoId]!).length) {
        delete state.statuses.todosUpdate[todoId];
      }

      todosAdapter.updateOne(state, {
        ...action.payload,
        changes: {
          tasks: action.payload.tasks,
        },
      });
    })
    .addCase(removeTask.rejected, (state, action) => {
      const { todoId, id } = action.meta.arg;

      delete state.statuses.todosUpdate[todoId]![id];

      if (!Object.keys(state.statuses.todosUpdate[todoId]!).length) {
        delete state.statuses.todosUpdate[todoId];
      }
    });

  return builder;
};

export default removeTask;
