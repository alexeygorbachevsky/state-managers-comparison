import {
  ActionReducerMapBuilder,
  EntityAdapter,
  EntityState,
  nanoid,
} from "@reduxjs/toolkit";

import type { Todo, Task } from "api/client";
import type { ExtraInitialState } from "../types";

import { updateTask as updateTaskFetch } from "api/client";

import { addAlertThunk, ALERT_DEFAULT_TIMEOUT, AlertTypes } from "../../alerts";
import { createAppAsyncThunk } from "../../../types";

interface UpdateTask {
  todoId: Todo["id"];
  id: Task["id"];
  title?: Task["title"];
  isChecked?: Task["isChecked"];
}

const updateTask = createAppAsyncThunk<
  Awaited<ReturnType<typeof updateTaskFetch>>,
  UpdateTask
>("todos/updateTask", async (data, { dispatch, getState }) => {
  const { isSessionStorage, loadDelay } = getState().todos;

  let todo;
  try {
    todo = await updateTaskFetch({ ...data, isSessionStorage, loadDelay });
  } catch (err) {
    dispatch(
      addAlertThunk({
        id: nanoid(),
        message: "Error is occurred - unable to update task.",
        type: AlertTypes.error,
      }),
    );

    throw err;
  }

  dispatch(
    addAlertThunk({
      id: nanoid(),
      message: `Task is successfully updated from "${todo.title}" todo`,
      type: AlertTypes.success,
      timeout: ALERT_DEFAULT_TIMEOUT,
    }),
  );

  return todo;
});

export const updateTaskReducer = (
  builder: ActionReducerMapBuilder<EntityState<Todo> & ExtraInitialState>,
  todosAdapter: EntityAdapter<Todo>,
) => {
  builder
    .addCase(updateTask.pending, (state, action) => {
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
    .addCase(updateTask.fulfilled, (state, action) => {
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
    .addCase(updateTask.rejected, (state, action) => {
      const { todoId, id } = action.meta.arg;

      delete state.statuses.todosUpdate[todoId]![id];

      if (!Object.keys(state.statuses.todosUpdate[todoId]!).length) {
        delete state.statuses.todosUpdate[todoId];
      }
    });

  return builder;
};

export default updateTask;
