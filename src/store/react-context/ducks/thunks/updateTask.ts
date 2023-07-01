import { nanoid } from "@reduxjs/toolkit";

import type { Todo } from "api/client";

import { Task, updateTask as updateTaskFetch } from "api/client";

import { addAlert, ALERT_DEFAULT_TIMEOUT } from "./addAlert";

import actionTypes, { Action } from "../actionTypes";
import { AlertTypes, Store, TodosState } from "../../types";

const { UPDATE_TASK_PENDING, UPDATE_TASK_SUCCESS, UPDATE_TASK_FAILURE } =
  actionTypes;

interface UpdateTaskArgs {
  todoId: Todo["id"];
  id: Task["id"];
  title?: Task["title"];
  isChecked?: Task["isChecked"];
  dispatch: Store["dispatch"];
  isSessionStorage: Store["isSessionStorage"];
  loadDelay: Store["loadDelay"];
  alerts: Store["alerts"];
}

const updateTask = async ({
  dispatch,
  isSessionStorage,
  loadDelay,
  alerts,
  ...data
}: UpdateTaskArgs): ReturnType<typeof updateTaskFetch> => {
  dispatch({ type: UPDATE_TASK_PENDING, payload: data });

  let todo;
  try {
    todo = await updateTaskFetch({ ...data, isSessionStorage, loadDelay });
  } catch (err) {
    dispatch({ type: UPDATE_TASK_FAILURE, payload: data });

    addAlert({
      alert: {
        id: nanoid(),
        message: "Error is occurred - unable to update task.",
        type: AlertTypes.error,
      },
      alerts,
      dispatch,
    });

    throw err;
  }

  dispatch({ type: UPDATE_TASK_SUCCESS, payload: { ...data, todo } });

  addAlert({
    alert: {
      id: nanoid(),
      message: `Task is successfully updated from "${todo.title}" todo`,
      type: AlertTypes.success,
      timeout: ALERT_DEFAULT_TIMEOUT,
    },
    alerts,
    dispatch,
  });

  return todo;
};

interface Payload {
  todoId: Todo["id"];
  id: Task["id"];
  title?: Task["title"];
  isChecked?: Task["isChecked"];
}

export type UpdateTaskPendingAction = {
  type: actionTypes.UPDATE_TASK_PENDING;
  payload: Payload;
};

const updateTaskPending = (state: TodosState, action: Action): TodosState => {
  const { todoId, id } = (action as UpdateTaskPendingAction).payload;

  return {
    ...state,
    statuses: {
      ...state.statuses,
      todosUpdate: {
        ...state.statuses.todosUpdate,
        [todoId]: {
          ...state.statuses.todosUpdate[todoId],
          [id]: true,
        },
      },
    },
  };
};

export type UpdateTaskSuccessAction = {
  type: actionTypes.UPDATE_TASK_SUCCESS;
  payload: { todo: Todo } & Payload;
};

const updateTaskSuccess = (state: TodosState, action: Action): TodosState => {
  const { todoId, id } = (action as UpdateTaskSuccessAction).payload;

  const todosUpdateCopy = { ...state.statuses.todosUpdate };

  delete todosUpdateCopy[todoId]![id];

  if (!Object.keys(todosUpdateCopy[todoId]!).length) {
    delete todosUpdateCopy[todoId];
  }

  return {
    ...state,
    entities: {
      ...state.entities,
      [(action as UpdateTaskSuccessAction).payload.todoId]: {
        ...state.entities[(action as UpdateTaskSuccessAction).payload.todoId],
        tasks: (action as UpdateTaskSuccessAction).payload.todo.tasks,
      },
    },
    statuses: {
      ...state.statuses,
      todosUpdate: todosUpdateCopy,
    },
  };
};

export type UpdateTaskFailureAction = {
  type: actionTypes.UPDATE_TASK_FAILURE;
  payload: Payload;
};

const updateTaskFailure = (state: TodosState, action: Action): TodosState => {
  const { todoId, id } = (action as UpdateTaskFailureAction).payload;

  const todosUpdateCopy = { ...state.statuses.todosUpdate };

  delete todosUpdateCopy[todoId]![id];

  if (!Object.keys(todosUpdateCopy[todoId]!).length) {
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

export const updateTaskReducer = {
  [UPDATE_TASK_PENDING]: updateTaskPending,
  [UPDATE_TASK_SUCCESS]: updateTaskSuccess,
  [UPDATE_TASK_FAILURE]: updateTaskFailure,
};

export default updateTask;
