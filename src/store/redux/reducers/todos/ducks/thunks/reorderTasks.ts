import { nanoid } from "@reduxjs/toolkit";
import { DraggableLocation } from "react-beautiful-dnd";

import type { Todo } from "api/client";

import { reorderTasks as reorderTasksFetch } from "api/client";

import { alertsThunks, AlertTypes, alertsConstants } from "../../../alerts";
import { PayloadAction, ReduxThunk } from "../../../../types";
import actionTypes from "../actionTypes";
import { InitialState } from "../../types";

const { REORDER_TASKS_PENDING, REORDER_TASKS_SUCCESS, REORDER_TASKS_FAILURE } =
  actionTypes;
const { addAlert } = alertsThunks;
const { ALERT_DEFAULT_TIMEOUT } = alertsConstants;

interface ReorderTasks {
  source: DraggableLocation;
  destination: DraggableLocation;
}

const reorderTasks =
  (data: ReorderTasks): ReduxThunk<ReturnType<typeof reorderTasksFetch>> =>
  async (dispatch, getState) => {
    dispatch({ type: REORDER_TASKS_PENDING, payload: data });

    const { isSessionStorage, loadDelay } = getState().todos;

    let result;
    try {
      result = await reorderTasksFetch({
        ...data,
        isSessionStorage,
        loadDelay,
      });
    } catch (err) {
      dispatch({ type: REORDER_TASKS_FAILURE, payload: data });

      dispatch(
        addAlert({
          id: nanoid(),
          message: "Error is occurred - unable to reorder tasks",
          type: AlertTypes.error,
        }),
      );

      throw err;
    }

    dispatch({ type: REORDER_TASKS_SUCCESS, payload: { ...data, ...result } });

    dispatch(
      addAlert({
        id: nanoid(),
        message: "Tasks are successfully reordered",
        type: AlertTypes.success,
        timeout: ALERT_DEFAULT_TIMEOUT,
      }),
    );

    return result;
  };

const reorderTasksPending = (
  state: InitialState,
  action: PayloadAction<ReorderTasks>,
): InitialState => {
  const source = action.payload.source;
  const destination = action.payload.destination;

  const todosUpdateCopy = { ...state.statuses.todosUpdate };

  todosUpdateCopy[source.droppableId] = {
    isTodoUpdating: true,
  };
  todosUpdateCopy[destination.droppableId] = {
    isTodoUpdating: true,
  };

  const entitiesCopy = { ...state.entities };

  const sourceTodo = entitiesCopy[source.droppableId] as Todo;
  const destinationTodo = entitiesCopy[destination.droppableId] as Todo;

  const prevDragTasksCopy = { ...state.prevDragTasks };

  prevDragTasksCopy[source.droppableId] = sourceTodo.tasks.slice();
  prevDragTasksCopy[destination.droppableId] = destinationTodo.tasks.slice();

  const targetTask = sourceTodo.tasks[source.index];

  sourceTodo.tasks.splice(source.index, 1);
  destinationTodo.tasks.splice(destination.index, 0, targetTask);

  return {
    ...state,
    entities: entitiesCopy,
    prevDragTasks: prevDragTasksCopy,
    statuses: {
      ...state.statuses,
      todosUpdate: todosUpdateCopy,
    },
  };
};

const reorderTasksSuccess = (
  state: InitialState,
  action: PayloadAction<
    Awaited<ReturnType<typeof reorderTasksFetch>> & ReorderTasks
  >,
): InitialState => {
  const entitiesCopy = { ...state.entities };
  const todosUpdateCopy = { ...state.statuses.todosUpdate };

  entitiesCopy[action.payload.sourceTodo.id] = {
    ...entitiesCopy[action.payload.sourceTodo.id],
    tasks: action.payload.sourceTodo.tasks,
  };

  entitiesCopy[action.payload.destinationTodo.id] = {
    ...entitiesCopy[action.payload.destinationTodo.id],
    tasks: action.payload.destinationTodo.tasks,
  };

  const source = action.payload.source;
  const destination = action.payload.destination;

  delete todosUpdateCopy[source.droppableId];
  delete todosUpdateCopy[destination.droppableId];

  return {
    ...state,
    entities: entitiesCopy,
    statuses: {
      ...state.statuses,
      todosUpdate: todosUpdateCopy,
    },
  };
};

const reorderTasksFailure = (
  state: InitialState,
  action: PayloadAction<ReorderTasks>,
): InitialState => {
  const entitiesCopy = { ...state.entities };
  const todosUpdateCopy = { ...state.statuses.todosUpdate };

  const source = action.payload.source;
  const destination = action.payload.destination;

  delete todosUpdateCopy[source.droppableId];
  delete todosUpdateCopy[destination.droppableId];

  // backup after fail
  entitiesCopy[source.droppableId] = {
    ...entitiesCopy[source.droppableId],
    tasks: state.prevDragTasks[source.droppableId],
  };

  entitiesCopy[destination.droppableId] = {
    ...entitiesCopy[destination.droppableId],
    tasks: state.prevDragTasks[destination.droppableId],
  };

  return {
    ...state,
    entities: entitiesCopy,
    statuses: {
      ...state.statuses,
      todosUpdate: todosUpdateCopy,
    },
  };
};

export const reorderTasksReducer = {
  [REORDER_TASKS_PENDING]: reorderTasksPending,
  [REORDER_TASKS_SUCCESS]: reorderTasksSuccess,
  [REORDER_TASKS_FAILURE]: reorderTasksFailure,
};

export default reorderTasks;
