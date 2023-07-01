import { nanoid } from "@reduxjs/toolkit";

import type { Todo } from "api/client";

import {
  createTodo as createTodoFetch,
  removeTask as removeTaskFetch,
  Task,
} from "api/client";

import { alertsThunks, AlertTypes, alertsConstants } from "../../../alerts";
import { PayloadAction, ReduxThunk } from "../../../../types";
import actionTypes from "../actionTypes";
import { InitialState } from "../../types";

const { REMOVE_TASK_PENDING, REMOVE_TASK_SUCCESS, REMOVE_TASK_FAILURE } =
  actionTypes;
const { addAlert } = alertsThunks;
const { ALERT_DEFAULT_TIMEOUT } = alertsConstants;

interface RemoveTaskArgs {
  todoId: Todo["id"];
  id: Task["id"];
}

const removeTask =
  (args: RemoveTaskArgs): ReduxThunk<ReturnType<typeof createTodoFetch>> =>
  async (dispatch, getState) => {
    dispatch({ type: REMOVE_TASK_PENDING, payload: args });
    const { isSessionStorage, loadDelay } = getState().todos;

    let todo;
    try {
      todo = await removeTaskFetch({ ...args, isSessionStorage, loadDelay });
    } catch (err) {
      dispatch({ type: REMOVE_TASK_FAILURE, payload: args });

      dispatch(
        addAlert({
          id: nanoid(),
          message: "Error is occurred - unable to remove task.",
          type: AlertTypes.error,
        }),
      );

      throw err;
    }

    dispatch({ type: REMOVE_TASK_SUCCESS, payload: { todo, ...args } });

    dispatch(
      addAlert({
        id: nanoid(),
        message: `Task is successfully removed from "${todo.title}" todo`,
        type: AlertTypes.success,
        timeout: ALERT_DEFAULT_TIMEOUT,
      }),
    );

    return todo;
  };

const removeTaskPending = (
  state: InitialState,
  action: PayloadAction<RemoveTaskArgs>,
): InitialState => ({
  ...state,
  statuses: {
    ...state.statuses,
    todosUpdate: {
      ...state.statuses.todosUpdate,
      [action.payload.todoId]: {
        ...state.statuses.todosUpdate[action.payload.todoId],
        [action.payload.id]: true,
      },
    },
  },
});

const removeTaskSuccess = (
  state: InitialState,
  action: PayloadAction<Todo & RemoveTaskArgs>,
): InitialState => {
  const { todoId, id } = action.payload;

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

const removeTaskFailure = (
  state: InitialState,
  action: PayloadAction<RemoveTaskArgs>,
): InitialState => {
  const { todoId, id } = action.payload;

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
