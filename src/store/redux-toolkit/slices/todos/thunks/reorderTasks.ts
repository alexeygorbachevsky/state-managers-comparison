import { ActionReducerMapBuilder, EntityState, nanoid } from "@reduxjs/toolkit";
import { DraggableLocation } from "react-beautiful-dnd";

import type { Todo } from "api/client";
import type { ExtraInitialState } from "../types";

import { reorderTasks as reorderTasksFetch } from "api/client";

import { addAlertThunk, ALERT_DEFAULT_TIMEOUT, AlertTypes } from "../../alerts";
import {createAppAsyncThunk} from "../../../types";

interface ReorderTasks {
  source: DraggableLocation;
  destination: DraggableLocation;
}

const reorderTasks = createAppAsyncThunk<
  Awaited<ReturnType<typeof reorderTasksFetch>>,
  ReorderTasks
>("todos/reorderTasks", async (data, { dispatch, getState }) => {
  const { isSessionStorage, loadDelay } = getState().todos;

  let result;
  try {
    result = await reorderTasksFetch({ ...data, isSessionStorage, loadDelay });
  } catch (err) {
    dispatch(
      addAlertThunk({
        id: nanoid(),
        message: "Error is occurred - unable to reorder tasks",
        type: AlertTypes.error,
      }),
    );

    throw err;
  }

  dispatch(
    addAlertThunk({
      id: nanoid(),
      message: "Tasks are successfully reordered",
      type: AlertTypes.success,
      timeout: ALERT_DEFAULT_TIMEOUT,
    }),
  );

  return result;
});

export const reorderTasksReducer = (
  builder: ActionReducerMapBuilder<EntityState<Todo> & ExtraInitialState>,
) => {
  builder
    .addCase(reorderTasks.pending, (state, action) => {
      const source = action.meta.arg.source;
      const destination = action.meta.arg.destination;

      state.statuses.todosUpdate[source.droppableId] = {
          isTodoUpdating: true,
      };
      state.statuses.todosUpdate[destination.droppableId] = {
          isTodoUpdating: true,
      };

      const sourceTodo = state.entities[source.droppableId] as Todo;
      const destinationTodo = state.entities[destination.droppableId] as Todo;

      state.prevDragTasks[source.droppableId] = sourceTodo.tasks.slice();
      state.prevDragTasks[destination.droppableId] =
        destinationTodo.tasks.slice();

      const targetTask = sourceTodo.tasks[source.index];

      sourceTodo.tasks.splice(source.index, 1);
      destinationTodo.tasks.splice(destination.index, 0, targetTask);
    })
    .addCase(reorderTasks.fulfilled, (state, action) => {
      if (
        state.entities[action.payload.sourceTodo.id] &&
        state.entities[action.payload.destinationTodo.id]
      ) {
        state.entities[action.payload.sourceTodo.id]!.tasks =
          action.payload.sourceTodo.tasks;
        state.entities[action.payload.destinationTodo.id]!.tasks =
          action.payload.destinationTodo.tasks;
      }

      const source = action.meta.arg.source;
      const destination = action.meta.arg.destination;

      delete state.statuses.todosUpdate[source.droppableId];
      delete state.statuses.todosUpdate[destination.droppableId];
    })
    .addCase(reorderTasks.rejected, (state, action) => {
      const source = action.meta.arg.source;
      const destination = action.meta.arg.destination;

      delete state.statuses.todosUpdate[source.droppableId];
      delete state.statuses.todosUpdate[destination.droppableId];

      // backup after fail
      if (
        state.entities[source.droppableId] &&
        state.entities[destination.droppableId]
      ) {
        state.entities[source.droppableId]!.tasks =
          state.prevDragTasks[source.droppableId];
        state.entities[destination.droppableId]!.tasks =
          state.prevDragTasks[destination.droppableId];
      }
    });

  return builder;
};

export default reorderTasks;
