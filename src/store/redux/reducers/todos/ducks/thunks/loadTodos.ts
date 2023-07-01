import { nanoid } from "@reduxjs/toolkit";

import { fetchTodos } from "api/client";

import { STATUS } from "constants/status";

import { alertsThunks, AlertTypes } from "../../../alerts";
import { PayloadAction, ReduxThunk } from "../../../../types";
import actionTypes from "../actionTypes";
import { Entities, InitialState } from "../../types";

const { LOAD_TODOS_PENDING, LOAD_TODOS_SUCCESS, LOAD_TODOS_FAILURE } =
  actionTypes;
const { addAlert } = alertsThunks;

const loadTodos =
  (): ReduxThunk<ReturnType<typeof fetchTodos>> =>
  async (dispatch, getState) => {
    dispatch({ type: LOAD_TODOS_PENDING });

    const { cursor, search, isSessionStorage, loadDelay } = getState().todos;

    let data;

    try {
      data = await fetchTodos({
        cursor,
        search,
        isSessionStorage,
        loadDelay,
      });
    } catch (err) {
      dispatch({ type: LOAD_TODOS_FAILURE });

      dispatch(
        addAlert({
          id: nanoid(),
          message: "Error is occurred - unable to load todos.",
          type: AlertTypes.error,
        }),
      );

      throw err;
    }

    dispatch({ type: LOAD_TODOS_SUCCESS, payload: data });

    return data;
  };

const loadTodosPending = (state: InitialState): InitialState => ({
  ...state,
  statuses: {
    ...state.statuses,
    todosLoad: STATUS.loading,
  },
});

const loadTodosSuccess = (
  state: InitialState,
  action: PayloadAction<Awaited<ReturnType<typeof fetchTodos>>>,
): InitialState => {
  const newTodos = action.payload.todos.sort((a, b) => b.index - a.index);

  const newEntities = newTodos.reduce((memo: Entities, todo) => {
    memo[todo.id] = todo;

    return memo;
  }, {});

  return {
    ...state,
    ids: state.ids.concat(newTodos.map(todo => todo.id)),
    entities: {
      ...state.entities,
      ...newEntities,
    },
    cursor: newTodos.length ? newTodos[newTodos.length - 1].id : state.cursor,
    isLastBatch: action.payload.isLastBatch,
    statuses: {
      ...state.statuses,
      todosLoad: STATUS.succeeded,
    },
  };
};

const loadTodosFailure = (state: InitialState): InitialState => ({
  ...state,
  statuses: {
    ...state.statuses,
    todosLoad: STATUS.failed,
  },
});

export const loadTodosReducer = {
  [LOAD_TODOS_PENDING]: loadTodosPending,
  [LOAD_TODOS_SUCCESS]: loadTodosSuccess,
  [LOAD_TODOS_FAILURE]: loadTodosFailure,
};

export default loadTodos;
