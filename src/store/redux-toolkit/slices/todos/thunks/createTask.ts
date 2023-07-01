import {
  ActionReducerMapBuilder,
  EntityAdapter,
  EntityState,
  nanoid,
} from "@reduxjs/toolkit";

import type { Task, Todo } from "api/client";
import type { ExtraInitialState } from "../types";

import { createTask as createTaskFetch } from "api/client";

import { addAlertThunk, AlertTypes, ALERT_DEFAULT_TIMEOUT } from "../../alerts";
import {createAppAsyncThunk} from "../../../types";

interface CreateTaskArgs {
  todoId: Todo["id"];
  title: Task["title"];
}

const createTask = createAppAsyncThunk<
  Awaited<ReturnType<typeof createTaskFetch>>,
  CreateTaskArgs
>("todos/createTask", async (args, { dispatch, getState }) => {
  const { isSessionStorage, loadDelay } = getState().todos;

  let todo;
  try {
    todo = await createTaskFetch({ ...args, isSessionStorage, loadDelay });
  } catch (err) {
    dispatch(
      addAlertThunk({
        id: nanoid(),
        message: "Error is occurred - unable to create task.",
        type: AlertTypes.error,
      }),
    );

    throw err;
  }

  dispatch(
    addAlertThunk({
      id: nanoid(),
      message: `Task "${args.title}" is successfully created for "${todo.title}" todo`,
      type: AlertTypes.success,
      timeout: ALERT_DEFAULT_TIMEOUT,
    }),
  );

  return todo;
});

export const createTaskReducer = (
  builder: ActionReducerMapBuilder<EntityState<Todo> & ExtraInitialState>,
  todosAdapter: EntityAdapter<Todo>,
) => {
  builder
    .addCase(createTask.pending, (state, action) => {
      state.statuses.todosUpdate[action.meta.arg.todoId] = {
        isTodoUpdating: true,
      };
    })
    .addCase(createTask.fulfilled, (state, action) => {
      delete state.statuses.todosUpdate[action.payload.id];

      todosAdapter.updateOne(state, {
        ...action.payload,
        changes: {
          tasks: action.payload.tasks,
        },
      });
    })
    .addCase(createTask.rejected, (state, action) => {
      delete state.statuses.todosUpdate[action.meta.arg.todoId];
    });

  return builder;
};

export default createTask;
