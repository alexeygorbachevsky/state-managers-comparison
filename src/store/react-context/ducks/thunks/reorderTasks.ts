import { nanoid } from "@reduxjs/toolkit";
import { DraggableLocation } from "react-beautiful-dnd";

import type { Todo } from "api/client";

import { reorderTasks as reorderTasksFetch } from "api/client";

import { addAlert, ALERT_DEFAULT_TIMEOUT } from "./addAlert";

import actionTypes, { Action } from "../actionTypes";
import { AlertTypes, Store, TodosState } from "../../types";

const { REORDER_TASKS_PENDING, REORDER_TASKS_SUCCESS, REORDER_TASKS_FAILURE } =
  actionTypes;

interface ReorderTasksArgs {
  source: DraggableLocation;
  destination: DraggableLocation;
  alerts: Store["alerts"];
  dispatch: Store["dispatch"];
  isSessionStorage: Store["isSessionStorage"];
  loadDelay: Store["loadDelay"];
}

const reorderTasks = async ({
  alerts,
  dispatch,
  isSessionStorage,
  loadDelay,
  ...data
}: ReorderTasksArgs): ReturnType<typeof reorderTasksFetch> => {
  dispatch({ type: REORDER_TASKS_PENDING, payload: data });

  let result;
  try {
    result = await reorderTasksFetch({
      ...data,
      isSessionStorage,
      loadDelay,
    });
  } catch (err) {
    dispatch({ type: REORDER_TASKS_FAILURE, payload: data });

    addAlert({
      alert: {
        id: nanoid(),
        message: "Error is occurred - unable to reorder tasks",
        type: AlertTypes.error,
      },
      alerts,
      dispatch,
    });

    throw err;
  }

  dispatch({ type: REORDER_TASKS_SUCCESS, payload: { ...data, ...result } });

  addAlert({
    alert: {
      id: nanoid(),
      message: "Tasks are successfully reordered",
      type: AlertTypes.success,
      timeout: ALERT_DEFAULT_TIMEOUT,
    },
    alerts,
    dispatch,
  });

  return result;
};

interface Payload {
  source: DraggableLocation;
  destination: DraggableLocation;
}

export type ReorderTasksPendingAction = {
  type: actionTypes.REORDER_TASKS_PENDING;
  payload: Payload;
};

const reorderTasksPending = (state: TodosState, action: Action): TodosState => {
  const source = (action as ReorderTasksPendingAction).payload.source;
  const destination = (action as ReorderTasksPendingAction).payload.destination;

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

export type ReorderTasksSuccessAction = {
  type: actionTypes.REORDER_TASKS_SUCCESS;
  payload: Awaited<ReturnType<typeof reorderTasksFetch>> & Payload;
};

const reorderTasksSuccess = (state: TodosState, action: Action): TodosState => {
  const entitiesCopy = { ...state.entities };
  const todosUpdateCopy = { ...state.statuses.todosUpdate };

  entitiesCopy[(action as ReorderTasksSuccessAction).payload.sourceTodo.id] = {
    ...entitiesCopy[
      (action as ReorderTasksSuccessAction).payload.sourceTodo.id
    ],
    tasks: (action as ReorderTasksSuccessAction).payload.sourceTodo.tasks,
  };

  entitiesCopy[
    (action as ReorderTasksSuccessAction).payload.destinationTodo.id
  ] = {
    ...entitiesCopy[
      (action as ReorderTasksSuccessAction).payload.destinationTodo.id
    ],
    tasks: (action as ReorderTasksSuccessAction).payload.destinationTodo.tasks,
  };

  const source = (action as ReorderTasksSuccessAction).payload.source;
  const destination = (action as ReorderTasksSuccessAction).payload.destination;

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

export type ReorderTasksFailureAction = {
  type: actionTypes.REORDER_TASKS_FAILURE;
  payload: Payload;
};

const reorderTasksFailure = (state: TodosState, action: Action): TodosState => {
  const entitiesCopy = { ...state.entities };
  const todosUpdateCopy = { ...state.statuses.todosUpdate };

  const source = (action as ReorderTasksFailureAction).payload.source;
  const destination = (action as ReorderTasksFailureAction).payload.destination;

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
