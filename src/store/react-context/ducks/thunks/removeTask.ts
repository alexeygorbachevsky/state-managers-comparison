import { nanoid } from "@reduxjs/toolkit";

import type { Todo } from "api/client";

import { removeTask as removeTaskFetch, Task } from "api/client";

import { AlertTypes, Store, TodosState } from "../../types";

import { addAlert, ALERT_DEFAULT_TIMEOUT } from "./addAlert";

import actionTypes, { Action } from "../actionTypes";

const { REMOVE_TASK_PENDING, REMOVE_TASK_SUCCESS, REMOVE_TASK_FAILURE } =
  actionTypes;

interface RemoveTaskArgs {
  todoId: Todo["id"];
  id: Task["id"];
  dispatch: Store["dispatch"];
  isSessionStorage: Store["isSessionStorage"];
  loadDelay: Store["loadDelay"];
  alerts: Store["alerts"];
}

interface Payload {
  todoId: Todo["id"];
  id: Task["id"];
}

const removeTask = async ({
  dispatch,
  isSessionStorage,
  loadDelay,
  alerts,
  ...args
}: RemoveTaskArgs): ReturnType<typeof removeTaskFetch> => {
  dispatch({ type: REMOVE_TASK_PENDING, payload: args });

  let todo;
  try {
    todo = await removeTaskFetch({ ...args, isSessionStorage, loadDelay });
  } catch (err) {
    dispatch({ type: REMOVE_TASK_FAILURE, payload: args });

    addAlert({
      alert: {
        id: nanoid(),
        message: "Error is occurred - unable to remove task.",
        type: AlertTypes.error,
      },
      alerts,
      dispatch,
    });

    throw err;
  }

  dispatch({ type: REMOVE_TASK_SUCCESS, payload: { todo, ...args } });

  addAlert({
    alert: {
      id: nanoid(),
      message: `Task is successfully removed from "${todo.title}" todo`,
      type: AlertTypes.success,
      timeout: ALERT_DEFAULT_TIMEOUT,
    },
    alerts,
    dispatch,
  });

  return todo;
};

export type RemoveTaskPendingAction = {
  type: actionTypes.REMOVE_TASK_PENDING;
  payload: Payload;
};

const removeTaskPending = (state: TodosState, action: Action): TodosState => ({
  ...state,
  statuses: {
    ...state.statuses,
    todosUpdate: {
      ...state.statuses.todosUpdate,
      [(action as RemoveTaskPendingAction).payload.todoId]: {
        ...state.statuses.todosUpdate[
          (action as RemoveTaskPendingAction).payload.todoId
        ],
        [(action as RemoveTaskPendingAction).payload.id]: true,
      },
    },
  },
});

export type RemoveTaskSuccessAction = {
  type: actionTypes.REMOVE_TASK_SUCCESS;
  payload: { todo: Todo } & Payload;
};

const removeTaskSuccess = (state: TodosState, action: Action): TodosState => {
  const { todoId, id } = (action as RemoveTaskSuccessAction).payload;

  const todosUpdateCopy = {
    ...state.statuses.todosUpdate,
  };

  delete todosUpdateCopy[todoId]![id];

  if (!Object.keys(state.statuses.todosUpdate[todoId]!).length) {
    delete todosUpdateCopy[todoId];
  }

  return {
    ...state,
    entities: {
      ...state.entities,
      [todoId]: {
        ...state.entities[todoId],
        tasks: state.entities[todoId].tasks.filter(task => task.id !== id),
      },
    },
    statuses: {
      ...state.statuses,
      todosUpdate: todosUpdateCopy,
    },
  };
};

export type RemoveTaskFailureAction = {
  type: actionTypes.REMOVE_TASK_FAILURE;
  payload: Payload;
};

const removeTaskFailure = (state: TodosState, action: Action): TodosState => {
  const { todoId, id } = (action as RemoveTaskFailureAction).payload;

  const todosUpdateCopy = {
    ...state.statuses.todosUpdate,
  };

  delete todosUpdateCopy[todoId]![id];

  if (!Object.keys(state.statuses.todosUpdate[todoId]!).length) {
    delete todosUpdateCopy[todoId];
  }

  return {
    ...state,
    statuses: {
      ...state.statuses,
      todosUpdate: todosUpdateCopy,
    },
  };
};

export const removeTaskReducer = {
  [REMOVE_TASK_PENDING]: removeTaskPending,
  [REMOVE_TASK_SUCCESS]: removeTaskSuccess,
  [REMOVE_TASK_FAILURE]: removeTaskFailure,
};

export default removeTask;
