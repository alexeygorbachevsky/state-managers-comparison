import { nanoid } from "@reduxjs/toolkit";

import type { Task, Todo } from "api/client";

import type { Store, TodosState } from "../../types";

import { createTask as createTaskFetch } from "api/client";

import { addAlert, ALERT_DEFAULT_TIMEOUT } from "./addAlert";

import actionTypes, { Action } from "../actionTypes";
import { AlertTypes } from "../../types";

const { CREATE_TASK_FAILURE, CREATE_TASK_PENDING, CREATE_TASK_SUCCESS } =
  actionTypes;

interface CreateTaskArgs {
  todoId: Todo["id"];
  title: Task["title"];
  dispatch: Store["dispatch"];
  isSessionStorage: Store["isSessionStorage"];
  loadDelay: Store["loadDelay"];
  alerts: Store["alerts"];
}

const createTask = async (args: CreateTaskArgs) => {
  const { dispatch, isSessionStorage, loadDelay, alerts } = args;

  dispatch({ type: CREATE_TASK_PENDING, payload: args });

  let todo;

  try {
    todo = await createTaskFetch({ ...args, isSessionStorage, loadDelay });
  } catch (err) {
    dispatch({ type: CREATE_TASK_FAILURE, payload: args });

    addAlert({
      alert: {
        id: nanoid(),
        message: "Error is occurred - unable to create task.",
        type: AlertTypes.error,
      },
      dispatch,
      alerts,
    });

    throw err;
  }

  dispatch({ type: CREATE_TASK_SUCCESS, payload: todo });

  addAlert({
    alert: {
      id: nanoid(),
      message: `Task "${args.title}" is successfully created for "${todo.title}" todo`,
      type: AlertTypes.success,
      timeout: ALERT_DEFAULT_TIMEOUT,
    },
    alerts,
    dispatch,
  });

  return todo;
};

export type CreateTaskPendingAction = {
  type: actionTypes.CREATE_TASK_PENDING;
  payload: CreateTaskArgs;
};

const createTaskPending = (state: TodosState, action: Action): TodosState => ({
  ...state,
  statuses: {
    ...state.statuses,
    todosUpdate: {
      ...state.statuses.todosUpdate,
      [(action as CreateTaskPendingAction).payload.todoId]: {
        isTodoUpdating: true,
      },
    },
  },
});

export type CreateTaskSuccessAction = {
  type: actionTypes.CREATE_TASK_SUCCESS;
  payload: Todo;
};

const createTaskSuccess = (state: TodosState, action: Action): TodosState => {
  const todosUpdateCopy = { ...state.statuses.todosUpdate };

  delete todosUpdateCopy[(action as CreateTaskSuccessAction).payload.id];

  return {
    ...state,
    entities: {
      ...state.entities,
      [(action as CreateTaskSuccessAction).payload.id]: {
        ...state.entities[(action as CreateTaskSuccessAction).payload.id],
        tasks: (action as CreateTaskSuccessAction).payload.tasks,
      },
    },
    statuses: {
      ...state.statuses,
      todosUpdate: todosUpdateCopy,
    },
  };
};

export type CreateTaskFailureAction = {
  type: actionTypes.CREATE_TASK_FAILURE;
  payload: CreateTaskArgs;
};

const createTaskFailure = (state: TodosState, action: Action): TodosState => {
  const todosUpdateCopy = { ...state.statuses.todosUpdate };

  delete todosUpdateCopy[(action as CreateTaskFailureAction).payload.todoId];

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
