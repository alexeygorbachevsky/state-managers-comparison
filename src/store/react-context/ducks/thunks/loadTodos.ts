import { nanoid } from "@reduxjs/toolkit";

import { fetchTodos } from "api/client";

import { STATUS } from "constants/status";

import actionTypes, { Action } from "../actionTypes";
import { addAlert } from "./addAlert";
import { Entities, Store, TodosState, AlertTypes } from "../../types";

const { LOAD_TODOS_PENDING, LOAD_TODOS_SUCCESS, LOAD_TODOS_FAILURE } =
  actionTypes;

interface LoadTodos {
  dispatch: Store["dispatch"];
  cursor: Store["cursor"];
  search: Store["search"];
  isSessionStorage: Store["isSessionStorage"];
  loadDelay: Store["loadDelay"];
  alerts: Store["alerts"];
}

const loadTodos = async ({
  dispatch,
  cursor,
  search,
  isSessionStorage,
  loadDelay,
  alerts,
}: LoadTodos) => {
  dispatch({ type: LOAD_TODOS_PENDING });

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

    addAlert({
      alert: {
        id: nanoid(),
        message: "Error is occurred - unable to load todos.",
        type: AlertTypes.error,
      },
      alerts,
      dispatch,
    });

    throw err;
  }

  dispatch({ type: LOAD_TODOS_SUCCESS, payload: data });

  return data;
};

export type LoadTodosPendingAction = {
  type: actionTypes.LOAD_TODOS_PENDING;
};

const loadTodosPending = (state: TodosState): TodosState => ({
  ...state,
  statuses: {
    ...state.statuses,
    todosLoad: STATUS.loading,
  },
});

export type LoadTodosSuccessAction = {
  type: actionTypes.LOAD_TODOS_SUCCESS;
  payload: Awaited<ReturnType<typeof fetchTodos>>;
};

const loadTodosSuccess = (state: TodosState, action: Action): TodosState => {
  const newTodos = (action as LoadTodosSuccessAction).payload.todos.sort(
    (a, b) => b.index - a.index,
  );

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
    isLastBatch: (action as LoadTodosSuccessAction).payload.isLastBatch,
    statuses: {
      ...state.statuses,
      todosLoad: STATUS.succeeded,
    },
  };
};

export type LoadTodosFailureAction = {
  type: actionTypes.LOAD_TODOS_FAILURE;
};

const loadTodosFailure = (state: TodosState): TodosState => ({
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
