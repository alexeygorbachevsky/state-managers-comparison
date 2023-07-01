import { nanoid } from "@reduxjs/toolkit";

import { reorderTodos as reorderTodosFetch } from "api/client";

import { alertsThunks, AlertTypes, alertsConstants } from "../../../alerts";
import { PayloadAction, ReduxThunk } from "../../../../types";
import actionTypes from "../actionTypes";
import { InitialState } from "../../types";

const { REORDER_TODOS_PENDING, REORDER_TODOS_SUCCESS, REORDER_TODOS_FAILURE } =
  actionTypes;
const { addAlert } = alertsThunks;
const { ALERT_DEFAULT_TIMEOUT } = alertsConstants;

interface ReorderTodos {
  sourceIndex: number;
  destinationIndex: number;
}

const reorderTodos =
  (data: ReorderTodos): ReduxThunk<ReturnType<typeof reorderTodosFetch>> =>
  async (dispatch, getState) => {
    dispatch({ type: REORDER_TODOS_PENDING, payload: data });

    const { isSessionStorage, ids, loadDelay } = getState().todos;

    let result;
    try {
      result = await reorderTodosFetch({ ids, isSessionStorage, loadDelay });
    } catch (err) {
      dispatch({ type: REORDER_TODOS_FAILURE, payload: data });

      dispatch(
        addAlert({
          id: nanoid(),
          message: "Error is occurred - unable to reorder todos",
          type: AlertTypes.error,
        }),
      );

      throw err;
    }

    dispatch({ type: REORDER_TODOS_SUCCESS, payload: { ...result, ...data } });

    dispatch(
      addAlert({
        id: nanoid(),
        message: "Todos are successfully reordered",
        type: AlertTypes.success,
        timeout: ALERT_DEFAULT_TIMEOUT,
      }),
    );

    return result;
  };

const reorderTodosPending = (
  state: InitialState,
  action: PayloadAction<ReorderTodos>,
): InitialState => {
  const idsCopy = [...state.ids];
  const entitiesCopy = { ...state.entities };

  const targetId = idsCopy[action.payload.sourceIndex];
  idsCopy.splice(action.payload.sourceIndex, 1);
  idsCopy.splice(action.payload.destinationIndex, 0, targetId);

  idsCopy.forEach((id, index) => {
    entitiesCopy[id] = {
      ...entitiesCopy[id],
      index: idsCopy.length - 1 - index,
    };
  });

  return {
    ...state,
    prevDragIds: state.ids,
    ids: idsCopy,
    entities: entitiesCopy,
    statuses: {
      ...state.statuses,
      isTodosReordering: true,
    },
  };
};

const reorderTodosSuccess = (
  state: InitialState,
  action: PayloadAction<
    Awaited<ReturnType<typeof reorderTodosFetch>> & ReorderTodos
  >,
): InitialState => {
  const entitiesCopy = { ...state.entities };

  const idsCopy = action.payload.ids;

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

const reorderTodosFailure = (state: InitialState): InitialState => {
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
