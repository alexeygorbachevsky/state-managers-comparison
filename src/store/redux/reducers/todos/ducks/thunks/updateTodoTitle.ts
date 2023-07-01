import { nanoid } from "@reduxjs/toolkit";

import type { Todo } from "api/client";

import { updateTodoTitle as updateTodoTitleFetch } from "api/client";

import { alertsThunks, AlertTypes, alertsConstants } from "../../../alerts";
import { PayloadAction, ReduxThunk } from "../../../../types";
import actionTypes from "../actionTypes";
import { InitialState } from "../../types";

const {
  UPDATE_TODO_TITLE_PENDING,
  UPDATE_TODO_TITLE_SUCCESS,
  UPDATE_TODO_TITLE_FAILURE,
} = actionTypes;
const { addAlert } = alertsThunks;
const { ALERT_DEFAULT_TIMEOUT } = alertsConstants;

interface UpdateTodoTitle {
  id: Todo["id"];
  title: Todo["title"];
}

export const updateTodoTitle =
  (
    data: UpdateTodoTitle,
  ): ReduxThunk<ReturnType<typeof updateTodoTitleFetch>> =>
  async (dispatch, getState) => {
    dispatch({ type: UPDATE_TODO_TITLE_PENDING, payload: data });

    const { isSessionStorage, loadDelay } = getState().todos;

    let todo;
    try {
      todo = await updateTodoTitleFetch({
        ...data,
        isSessionStorage,
        loadDelay,
      });
    } catch (err) {
      dispatch({ type: UPDATE_TODO_TITLE_FAILURE, payload: data });

      dispatch(
        addAlert({
          id: nanoid(),
          message: "Error is occurred - unable to update todo title.",
          type: AlertTypes.error,
        }),
      );

      throw err;
    }

    dispatch({ type: UPDATE_TODO_TITLE_SUCCESS, payload: todo });

    dispatch(
      addAlert({
        id: nanoid(),
        message: `Todo title is successfully updated to "${todo.title}"`,
        type: AlertTypes.success,
        timeout: ALERT_DEFAULT_TIMEOUT,
      }),
    );

    return todo;
  };

const updateTodoTitlePending = (
  state: InitialState,
  action: PayloadAction<UpdateTodoTitle>,
): InitialState => ({
  ...state,
  statuses: {
    ...state.statuses,
    todosUpdate: {
      ...state.statuses.todosUpdate,
      [action.payload.id]: {
        ...state.statuses.todosUpdate[action.payload.id],
        isTodoUpdating: true,
      },
    },
  },
});

const updateTodoTitleSuccess = (
  state: InitialState,
  action: PayloadAction<Todo>,
): InitialState => {
  const todosUpdateCopy = { ...state.statuses.todosUpdate };

  delete todosUpdateCopy[action.payload.id];

  return {
    ...state,
    entities: {
      ...state.entities,
      [action.payload.id]: {
        ...state.entities[action.payload.id],
        title: action.payload.title,
      },
    },
    statuses: {
      ...state.statuses,
      todosUpdate: todosUpdateCopy,
    },
  };
};

const updateTodoTitleFailure = (
  state: InitialState,
  action: PayloadAction<UpdateTodoTitle>,
): InitialState => {
  const todosUpdateCopy = { ...state.statuses.todosUpdate };

  delete todosUpdateCopy[action.payload.id];

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
