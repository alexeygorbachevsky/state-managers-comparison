import { nanoid } from "@reduxjs/toolkit";

import type { Todo } from "api/client";

import { Task, updateTask as updateTaskFetch } from "api/client";

import { alertsThunks, AlertTypes, alertsConstants } from "../../../alerts";
import { PayloadAction, ReduxThunk } from "../../../../types";
import actionTypes from "../actionTypes";
import { InitialState } from "../../types";

const { UPDATE_TASK_PENDING, UPDATE_TASK_SUCCESS, UPDATE_TASK_FAILURE } =
  actionTypes;
const { addAlert } = alertsThunks;
const { ALERT_DEFAULT_TIMEOUT } = alertsConstants;

interface UpdateTask {
  todoId: Todo["id"];
  id: Task["id"];
  title?: Task["title"];
  isChecked?: Task["isChecked"];
}

const updateTask =
  (data: UpdateTask): ReduxThunk<ReturnType<typeof updateTaskFetch>> =>
  async (dispatch, getState) => {
    dispatch({ type: UPDATE_TASK_PENDING, payload: data });

    const { isSessionStorage, loadDelay } = getState().todos;

    let todo;
    try {
      todo = await updateTaskFetch({ ...data, isSessionStorage, loadDelay });
    } catch (err) {
      dispatch({ type: UPDATE_TASK_FAILURE, payload: data });

      dispatch(
        addAlert({
          id: nanoid(),
          message: "Error is occurred - unable to update task.",
          type: AlertTypes.error,
        }),
      );

      throw err;
    }

    dispatch({ type: UPDATE_TASK_SUCCESS, payload: { ...data, todo } });

    dispatch(
      addAlert({
        id: nanoid(),
        message: `Task is successfully updated from "${todo.title}" todo`,
        type: AlertTypes.success,
        timeout: ALERT_DEFAULT_TIMEOUT,
      }),
    );

    return todo;
  };

const updateTaskPending = (
  state: InitialState,
  action: PayloadAction<UpdateTask>,
): InitialState => {
  const { todoId, id } = action.payload;

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

const updateTaskSuccess = (
  state: InitialState,
  action: PayloadAction<{ todo: Todo } & UpdateTask>,
): InitialState => {
  const { todoId, id } = action.payload;

  const todosUpdateCopy = { ...state.statuses.todosUpdate };

  delete todosUpdateCopy[todoId]![id];

  if (!Object.keys(todosUpdateCopy[todoId]!).length) {
    delete todosUpdateCopy[todoId];
  }

  return {
    ...state,
    entities: {
      ...state.entities,
      [action.payload.todoId]: {
        ...state.entities[action.payload.todoId],
        tasks: action.payload.todo.tasks,
      },
    },
    statuses: {
      ...state.statuses,
      todosUpdate: todosUpdateCopy,
    },
  };
};

const updateTaskFailure = (
  state: InitialState,
  action: PayloadAction<UpdateTask>,
): InitialState => {
  const { todoId, id } = action.payload;

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
