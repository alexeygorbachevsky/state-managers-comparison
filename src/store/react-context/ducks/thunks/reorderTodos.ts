import { nanoid } from "@reduxjs/toolkit";

import { reorderTodos as reorderTodosFetch } from "api/client";

import { addAlert, ALERT_DEFAULT_TIMEOUT } from "./addAlert";

import actionTypes, { Action } from "../actionTypes";
import { AlertTypes, Store, TodosState } from "../../types";

const { REORDER_TODOS_PENDING, REORDER_TODOS_SUCCESS, REORDER_TODOS_FAILURE } =
  actionTypes;

interface ReorderTodosArgs {
  sourceIndex: number;
  destinationIndex: number;
  dispatch: Store["dispatch"];
  isSessionStorage: Store["isSessionStorage"];
  ids: Store["ids"];
  entities: Store["entities"];
  alerts: Store["alerts"];
  loadDelay: Store["loadDelay"];
}

const reorderTodos = async ({
  dispatch,
  isSessionStorage,
  ids,
  entities,
  loadDelay,
  alerts,
  ...data
}: ReorderTodosArgs): ReturnType<typeof reorderTodosFetch> => {
  const { ids: newIds, entities: newEntities } = getNewIds({
    ids,
    entities,
    ...data,
  });

  dispatch({
    type: REORDER_TODOS_PENDING,
    payload: { ids: newIds, entities: newEntities },
  });

  let result;
  try {
    result = await reorderTodosFetch({
      ids: newIds,
      isSessionStorage,
      loadDelay,
    });
  } catch (err) {
    dispatch({ type: REORDER_TODOS_FAILURE });

    addAlert({
      alert: {
        id: nanoid(),
        message: "Error is occurred - unable to reorder todos",
        type: AlertTypes.error,
      },
      alerts,
      dispatch,
    });

    throw err;
  }

  dispatch({ type: REORDER_TODOS_SUCCESS });

  addAlert({
    alert: {
      id: nanoid(),
      message: "Todos are successfully reordered",
      type: AlertTypes.success,
      timeout: ALERT_DEFAULT_TIMEOUT,
    },
    alerts,
    dispatch,
  });

  return result;
};

interface Payload {
  ids: Store["ids"];
  entities: Store["entities"];
}

export type ReorderTodosPendingAction = {
  type: actionTypes.REORDER_TODOS_PENDING;
  payload: Payload;
};

interface GetNewIds {
  sourceIndex: number;
  destinationIndex: number;
  ids: Store["ids"];
  entities: Store["entities"];
}

const getNewIds = ({
  ids,
  entities,
  sourceIndex,
  destinationIndex,
}: GetNewIds) => {
  const idsCopy = [...ids];
  const entitiesCopy = { ...entities };

  const targetId = idsCopy[sourceIndex];
  idsCopy.splice(sourceIndex, 1);
  idsCopy.splice(destinationIndex, 0, targetId);

  idsCopy.forEach((id, index) => {
    entitiesCopy[id] = {
      ...entitiesCopy[id],
      index: idsCopy.length - 1 - index,
    };
  });

  return { ids: idsCopy, entities: entitiesCopy };
};

const reorderTodosPending = (
  state: TodosState,
  action: Action,
): TodosState => ({
  ...state,
  prevDragIds: state.ids,
  ids: (action as ReorderTodosPendingAction).payload.ids,
  entities: (action as ReorderTodosPendingAction).payload.entities,
  statuses: {
    ...state.statuses,
    isTodosReordering: true,
  },
});

export type ReorderTodosSuccessAction = {
  type: actionTypes.REORDER_TODOS_SUCCESS;
};

const reorderTodosSuccess = (state: TodosState): TodosState => ({
  ...state,
  statuses: {
    ...state.statuses,
    isTodosReordering: false,
  },
});

export type ReorderTodosFailureAction = {
  type: actionTypes.REORDER_TODOS_FAILURE;
};

const reorderTodosFailure = (state: TodosState): TodosState => {
  const entitiesCopy = { ...state.entities };

  // backup after fail
  const idsCopy = state.prevDragIds;
  idsCopy.forEach((id, index) => {
    entitiesCopy[id] = {
      ...entitiesCopy[id],
      index: idsCopy.length - 1 - index,
    };
  });

  return {
    ...state,
    ids: idsCopy,
    entities: entitiesCopy,
    statuses: {
      ...state.statuses,
      isTodosReordering: false,
    },
  };
};

export const reorderTodosReducer = {
  [REORDER_TODOS_PENDING]: reorderTodosPending,
  [REORDER_TODOS_SUCCESS]: reorderTodosSuccess,
  [REORDER_TODOS_FAILURE]: reorderTodosFailure,
};

export default reorderTodos;
