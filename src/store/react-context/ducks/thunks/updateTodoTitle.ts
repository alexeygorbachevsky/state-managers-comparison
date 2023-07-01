import { nanoid } from "@reduxjs/toolkit";

import type { Todo } from "api/client";

import { updateTodoTitle as updateTodoTitleFetch } from "api/client";

import { addAlert, ALERT_DEFAULT_TIMEOUT } from "./addAlert";

import actionTypes, { Action } from "../actionTypes";
import { AlertTypes, Store, TodosState } from "../../types";

const {
  UPDATE_TODO_TITLE_PENDING,
  UPDATE_TODO_TITLE_SUCCESS,
  UPDATE_TODO_TITLE_FAILURE,
} = actionTypes;

interface UpdateTodoTitleArgs {
  id: Todo["id"];
  title: Todo["title"];
  dispatch: Store["dispatch"];
  isSessionStorage: Store["isSessionStorage"];
  loadDelay: Store["loadDelay"];
  alerts: Store["alerts"];
}

export const updateTodoTitle = async ({
  dispatch,
  isSessionStorage,
  loadDelay,
  alerts,
  ...data
}: UpdateTodoTitleArgs): ReturnType<typeof updateTodoTitleFetch> => {
  dispatch({ type: UPDATE_TODO_TITLE_PENDING, payload: data });

  let todo;
  try {
    todo = await updateTodoTitleFetch({
      ...data,
      isSessionStorage,
      loadDelay,
    });
  } catch (err) {
    dispatch({ type: UPDATE_TODO_TITLE_FAILURE, payload: data });

    addAlert({
      alert: {
        id: nanoid(),
        message: "Error is occurred - unable to update todo title.",
        type: AlertTypes.error,
      },
      dispatch,
      alerts,
    });

    throw err;
  }

  dispatch({ type: UPDATE_TODO_TITLE_SUCCESS, payload: todo });

  addAlert({
    alert: {
      id: nanoid(),
      message: `Todo title is successfully updated to "${todo.title}"`,
      type: AlertTypes.success,
      timeout: ALERT_DEFAULT_TIMEOUT,
    },
    dispatch,
    alerts,
  });

  return todo;
};

interface Payload {
  id: Todo["id"];
  title: Todo["title"];
}

export type UpdateTodoTitlePendingAction = {
  type: actionTypes.UPDATE_TODO_TITLE_PENDING;
  payload: Payload;
};

const updateTodoTitlePending = (
  state: TodosState,
  action: Action,
): TodosState => ({
  ...state,
  statuses: {
    ...state.statuses,
    todosUpdate: {
      ...state.statuses.todosUpdate,
      [(action as UpdateTodoTitlePendingAction).payload.id]: {
        ...state.statuses.todosUpdate[
          (action as UpdateTodoTitlePendingAction).payload.id
        ],
        isTodoUpdating: true,
      },
    },
  },
});

export type UpdateTodoTitleSuccessAction = {
  type: actionTypes.UPDATE_TODO_TITLE_SUCCESS;
  payload: Todo;
};

const updateTodoTitleSuccess = (
  state: TodosState,
  action: Action,
): TodosState => {
  const todosUpdateCopy = { ...state.statuses.todosUpdate };

  delete todosUpdateCopy[(action as UpdateTodoTitleSuccessAction).payload.id];

  return {
    ...state,
    entities: {
      ...state.entities,
      [(action as UpdateTodoTitleSuccessAction).payload.id]: {
        ...state.entities[(action as UpdateTodoTitleSuccessAction).payload.id],
        title: (action as UpdateTodoTitleSuccessAction).payload.title,
      },
    },
    statuses: {
      ...state.statuses,
      todosUpdate: todosUpdateCopy,
    },
  };
};

export type UpdateTodoTitleFailureAction = {
  type: actionTypes.UPDATE_TODO_TITLE_FAILURE;
  payload: Payload;
};

const updateTodoTitleFailure = (
  state: TodosState,
  action: Action,
): TodosState => {
  const todosUpdateCopy = { ...state.statuses.todosUpdate };

  delete todosUpdateCopy[(action as UpdateTodoTitleFailureAction).payload.id];

  return {
    ...state,
    statuses: {
      ...state.statuses,
      todosUpdate: todosUpdateCopy,
    },
  };
};

export const updateTodoTitleReducer = {
  [UPDATE_TODO_TITLE_PENDING]: updateTodoTitlePending,
  [UPDATE_TODO_TITLE_SUCCESS]: updateTodoTitleSuccess,
  [UPDATE_TODO_TITLE_FAILURE]: updateTodoTitleFailure,
};

export default updateTodoTitle;
