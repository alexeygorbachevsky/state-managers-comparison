import { nanoid } from "@reduxjs/toolkit";

import type { Todo } from "api/client";
import type { Store, TodosState } from "../../types";

import { removeTodo as removeTodoFetch } from "api/client";

import { addAlert, ALERT_DEFAULT_TIMEOUT } from "./addAlert";

import actionTypes, { Action } from "../actionTypes";
import { AlertTypes } from "../../types";

const { REMOVE_TODO_PENDING, REMOVE_TODO_FAILURE, REMOVE_TODO_SUCCESS } =
  actionTypes;

interface RemoveTodoArgs {
  id: Todo["id"];
  dispatch: Store["dispatch"];
  isSessionStorage: Store["isSessionStorage"];
  loadDelay: Store["loadDelay"];
  alerts: Store["alerts"];
}

const removeTodo = async ({
  id,
  dispatch,
  isSessionStorage,
  loadDelay,
  alerts,
}: RemoveTodoArgs): ReturnType<typeof removeTodoFetch> => {
  dispatch({ type: REMOVE_TODO_PENDING, payload: id });

  let todo;
  try {
    todo = await removeTodoFetch({ id, isSessionStorage, loadDelay });
  } catch (err) {
    dispatch({ type: REMOVE_TODO_FAILURE, payload: id });

    addAlert({
      alert: {
        id: nanoid(),
        message: "Error is occurred - unable to remove todo.",
        type: AlertTypes.error,
      },
      alerts,
      dispatch,
    });

    throw err;
  }

  dispatch({ type: REMOVE_TODO_SUCCESS, payload: todo });

  addAlert({
    alert: {
      id: nanoid(),
      message: `Todo "${todo.title}" is successfully removed`,
      type: AlertTypes.success,
      timeout: ALERT_DEFAULT_TIMEOUT,
    },
    alerts,
    dispatch,
  });

  return todo;
};

export type RemoveTodoPendingAction = {
  type: actionTypes.REMOVE_TODO_PENDING;
  payload: Todo["id"];
};

const removeTodoPending = (state: TodosState, action: Action): TodosState => ({
  ...state,
  statuses: {
    ...state.statuses,
    todosUpdate: {
      ...state.statuses.todosUpdate,
      [(action as RemoveTodoPendingAction).payload]: {
        isTodoUpdating: true,
      },
    },
  },
});

export type RemoveTodoSuccessAction = {
  type: actionTypes.REMOVE_TODO_SUCCESS;
  payload: Todo;
};

const removeTodoSuccess = (state: TodosState, action: Action): TodosState => {
  const todosUpdateCopy = { ...state.statuses.todosUpdate };

  delete todosUpdateCopy[(action as RemoveTodoSuccessAction).payload.id];

  const entitiesCopy = { ...state.entities };
  delete entitiesCopy[(action as RemoveTodoSuccessAction).payload.id];

  return {
    ...state,
    ids: state.ids.filter(
      id => id !== (action as RemoveTodoSuccessAction).payload.id,
    ),
    entities: entitiesCopy,
    statuses: {
      ...state.statuses,
      todosUpdate: todosUpdateCopy,
    },
  };
};

export type RemoveTodoFailureAction = {
  type: actionTypes.REMOVE_TODO_FAILURE;
  payload: Todo["id"];
};

const removeTodoFailure = (state: TodosState, action: Action): TodosState => {
  const todosUpdateCopy = { ...state.statuses.todosUpdate };

  delete todosUpdateCopy[(action as RemoveTodoFailureAction).payload];

  return {
    ...state,
    statuses: {
      ...state.statuses,
      todosUpdate: todosUpdateCopy,
    },
  };
};

export const removeTodoReducer = {
  [REMOVE_TODO_PENDING]: removeTodoPending,
  [REMOVE_TODO_SUCCESS]: removeTodoSuccess,
  [REMOVE_TODO_FAILURE]: removeTodoFailure,
};

export default removeTodo;
