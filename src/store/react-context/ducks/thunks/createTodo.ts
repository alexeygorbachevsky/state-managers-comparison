import { nanoid } from "@reduxjs/toolkit";

import type { Todo } from "api/client";

import { createTodo as createTodoFetch } from "api/client";

import { AlertTypes, Store, TodosState } from "../../types";

import { addAlert, ALERT_DEFAULT_TIMEOUT } from "./addAlert";

import actionTypes, { Action } from "../actionTypes";

const { CREATE_TODO_PENDING, CREATE_TODO_SUCCESS, CREATE_TODO_FAILURE } =
  actionTypes;

interface CreateTodoArgs {
  dispatch: Store["dispatch"];
  isSessionStorage: Store["isSessionStorage"];
  loadDelay: Store["loadDelay"];
  alerts: Store["alerts"];
  title: Todo["title"];
}

export const createTodo = async ({
  dispatch,
  title,
  isSessionStorage,
  loadDelay,
  alerts,
}: CreateTodoArgs) => {
  dispatch({ type: CREATE_TODO_PENDING });

  let todo;
  try {
    todo = await createTodoFetch({ title, isSessionStorage, loadDelay });
  } catch (err) {
    addAlert({
      alert: {
        id: nanoid(),
        message: "Error is occurred - unable to create todo.",
        type: AlertTypes.error,
      },
      dispatch,
      alerts,
    });

    dispatch({ type: CREATE_TODO_FAILURE });

    throw err;
  }

  dispatch({ type: CREATE_TODO_SUCCESS, payload: todo });

  addAlert({
    alert: {
      id: nanoid(),
      message: `Todo "${todo.title}" is successfully created`,
      type: AlertTypes.success,
      timeout: ALERT_DEFAULT_TIMEOUT,
    },
    dispatch,
    alerts,
  });

  return todo;
};

export type CreateTodoPendingAction = {
  type: actionTypes.CREATE_TODO_PENDING;
};

const createTodoPending = (state: TodosState): TodosState => ({
  ...state,
  statuses: {
    ...state.statuses,
    isTodoCreating: true,
  },
});

export type CreateTodoSuccessAction = {
  type: actionTypes.CREATE_TODO_SUCCESS;
  payload: Todo;
};

const createTodoSuccess = (state: TodosState, action: Action): TodosState => ({
  ...state,
  ids: [(action as CreateTodoSuccessAction).payload.id, ...state.ids],
  entities: {
    ...state.entities,
    [(action as CreateTodoSuccessAction).payload.id]: (
      action as CreateTodoSuccessAction
    ).payload,
  },
  statuses: {
    ...state.statuses,
    isTodoCreating: false,
  },
});

export type CreateTodoFailureAction = {
  type: actionTypes.CREATE_TODO_FAILURE;
};

const createTodoFailure = (state: TodosState): TodosState => ({
  ...state,
  statuses: {
    ...state.statuses,
    isTodoCreating: false,
  },
});

export const createTodoReducer = {
  [CREATE_TODO_PENDING]: createTodoPending,
  [CREATE_TODO_SUCCESS]: createTodoSuccess,
  [CREATE_TODO_FAILURE]: createTodoFailure,
};

export default createTodo;
