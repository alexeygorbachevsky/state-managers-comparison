import { nanoid } from "@reduxjs/toolkit";

import type { Task, Todo } from "api/client";

import { createTask as createTaskFetch } from "api/client";

import { alertsThunks, AlertTypes, alertsConstants } from "../../../alerts";

import { PayloadAction, ReduxThunk } from "../../../../types";

import actionTypes from "../actionTypes";
import { InitialState } from "../../types";

const { CREATE_TASK_FAILURE, CREATE_TASK_PENDING, CREATE_TASK_SUCCESS } =
  actionTypes;
const { addAlert } = alertsThunks;
const { ALERT_DEFAULT_TIMEOUT } = alertsConstants;

interface CreateTaskArgs {
  todoId: Todo["id"];
  title: Task["title"];
}

const createTask =
  (args: CreateTaskArgs): ReduxThunk<ReturnType<typeof createTaskFetch>> =>
  async (dispatch, getState) => {
    dispatch({ type: CREATE_TASK_PENDING, payload: args });

    const { isSessionStorage, loadDelay } = getState().todos;
    let todo;

    try {
      todo = await createTaskFetch({ ...args, isSessionStorage, loadDelay });
    } catch (err) {
      dispatch({ type: CREATE_TASK_FAILURE, payload: args });

      dispatch(
        addAlert({
          id: nanoid(),
          message: "Error is occurred - unable to create task.",
          type: AlertTypes.error,
        }),
      );

      throw err;
    }

    dispatch({ type: CREATE_TASK_SUCCESS, payload: todo });

    dispatch(
      addAlert({
        id: nanoid(),
        message: `Task "${args.title}" is successfully created for "${todo.title}" todo`,
        type: AlertTypes.success,
        timeout: ALERT_DEFAULT_TIMEOUT,
      }),
    );

    return todo;
  };

const createTaskPending = (
  state: InitialState,
  action: PayloadAction<CreateTaskArgs>,
): InitialState => ({
  ...state,
  statuses: {
    ...state.statuses,
    todosUpdate: {
      ...state.statuses.todosUpdate,
      [action.payload.todoId]: { isTodoUpdating: true },
    },
  },
});

const createTaskSuccess = (
  state: InitialState,
  action: PayloadAction<Todo>,
): InitialState => {
  const todosUpdateCopy = { ...state.statuses.todosUpdate };

  delete todosUpdateCopy[action.payload.id];

  return {
    ...state,
    entities: {
      ...state.entities,
      [action.payload.id]: {
        ...state.entities[action.payload.id],
        tasks: action.payload.tasks,
      },
    },
    statuses: {
      ...state.statuses,
      todosUpdate: todosUpdateCopy,
    },
  };
};

const createTaskFailure = (
  state: InitialState,
  action: PayloadAction<CreateTaskArgs>,
): InitialState => {
  const todosUpdateCopy = { ...state.statuses.todosUpdate };

  delete todosUpdateCopy[action.payload.todoId];

  return {
    ...state,
    statuses: {
      ...state.statuses,
      todosUpdate: todosUpdateCopy,
    },
  };
};

export const createTaskReducer = {
  [CREATE_TASK_PENDING]: createTaskPending,
  [CREATE_TASK_SUCCESS]: createTaskSuccess,
  [CREATE_TASK_FAILURE]: createTaskFailure,
};

export default createTask;
