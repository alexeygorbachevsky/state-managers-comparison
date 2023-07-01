import { nanoid } from "@reduxjs/toolkit";

import type { Todo } from "api/client";

import {
  createTodo as createTodoFetch,
  removeTodo as removeTodoFetch,
} from "api/client";

import { alertsThunks, AlertTypes, alertsConstants } from "../../../alerts";
import { PayloadAction, ReduxThunk } from "../../../../types";
import actionTypes from "../actionTypes";
import { InitialState } from "../../types";

const { REMOVE_TODO_PENDING, REMOVE_TODO_SUCCESS, REMOVE_TODO_FAILURE } =
  actionTypes;
const { addAlert } = alertsThunks;
const { ALERT_DEFAULT_TIMEOUT } = alertsConstants;

const removeTodo =
  (id: Todo["id"]): ReduxThunk<ReturnType<typeof createTodoFetch>> =>
  async (dispatch, getState) => {
    dispatch({ type: REMOVE_TODO_PENDING, payload: id });

    const { isSessionStorage, loadDelay } = getState().todos;

    let todo;
    try {
      todo = await removeTodoFetch({ id, isSessionStorage, loadDelay });
    } catch (err) {
      dispatch({ type: REMOVE_TODO_FAILURE, payload: id });

      dispatch(
        addAlert({
          id: nanoid(),
          message: "Error is occurred - unable to remove todo.",
          type: AlertTypes.error,
        }),
      );

      throw err;
    }

    dispatch({ type: REMOVE_TODO_SUCCESS, payload: todo });

    dispatch(
      addAlert({
        id: nanoid(),
        message: `Todo "${todo.title}" is successfully removed`,
        type: AlertTypes.success,
        timeout: ALERT_DEFAULT_TIMEOUT,
      }),
    );

    return todo;
  };

const removeTodoPending = (
  state: InitialState,
  action: PayloadAction<Todo["id"]>,
): InitialState => ({
  ...state,
  statuses: {
    ...state.statuses,
    todosUpdate: {
      ...state.statuses.todosUpdate,
      [action.payload]: {
        isTodoUpdating: true,
      },
    },
  },
});

const removeTodoSuccess = (
  state: InitialState,
  action: PayloadAction<Todo>,
): InitialState => {
  const todosUpdateCopy = { ...state.statuses.todosUpdate };

  delete todosUpdateCopy[action.payload.id];

  const entitiesCopy = { ...state.entities };
  delete entitiesCopy[action.payload.id];

  return {
    ...state,
    ids: state.ids.filter(id => id !== action.payload.id),
    entities: entitiesCopy,
    statuses: {
      ...state.statuses,
      todosUpdate: todosUpdateCopy,
    },
  };
};

const removeTodoFailure = (
  state: InitialState,
  action: PayloadAction<Todo["id"]>,
): InitialState => {
  const todosUpdateCopy = { ...state.statuses.todosUpdate };

  delete todosUpdateCopy[action.payload];

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
