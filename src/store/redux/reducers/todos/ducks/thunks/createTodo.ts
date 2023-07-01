import { nanoid } from "@reduxjs/toolkit";

import type { Todo } from "api/client";

import { createTodo as createTodoFetch } from "api/client";

import { alertsThunks, AlertTypes, alertsConstants } from "../../../alerts";
import { PayloadAction, ReduxThunk } from "../../../../types";
import actionTypes from "../actionTypes";
import { InitialState } from "../../types";

const { CREATE_TODO_PENDING, CREATE_TODO_SUCCESS, CREATE_TODO_FAILURE } =
  actionTypes;
const { addAlert } = alertsThunks;
const { ALERT_DEFAULT_TIMEOUT } = alertsConstants;

export const createTodo =
  (title: Todo["title"]): ReduxThunk<ReturnType<typeof createTodoFetch>> =>
  async (dispatch, getState) => {
    dispatch({ type: CREATE_TODO_PENDING });
    const { isSessionStorage, loadDelay } = getState().todos;

    let todo;
    try {
      todo = await createTodoFetch({ title, isSessionStorage, loadDelay });
    } catch (err) {
      dispatch(
        addAlert({
          id: nanoid(),
          message: "Error is occurred - unable to create todo.",
          type: AlertTypes.error,
        }),
      );

      dispatch({ type: CREATE_TODO_FAILURE });

      throw err;
    }

    dispatch({ type: CREATE_TODO_SUCCESS, payload: todo });

    dispatch(
      addAlert({
        id: nanoid(),
        message: `Todo "${todo.title}" is successfully created`,
        type: AlertTypes.success,
        timeout: ALERT_DEFAULT_TIMEOUT,
      }),
    );

    return todo;
  };

const createTodoPending = (state: InitialState): InitialState => ({
  ...state,
  statuses: {
    ...state.statuses,
    isTodoCreating: true,
  },
});

const createTodoSuccess = (
  state: InitialState,
  action: PayloadAction<Todo>,
): InitialState => ({
  ...state,
  ids: [action.payload.id, ...state.ids],
  entities: {
    ...state.entities,
    [action.payload.id]: action.payload,
  },
  statuses: {
    ...state.statuses,
    isTodoCreating: false,
  },
});

const createTodoFailure = (state: InitialState): InitialState => ({
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
