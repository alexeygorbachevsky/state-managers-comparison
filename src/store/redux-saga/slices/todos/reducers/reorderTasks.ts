import { PayloadAction } from "@reduxjs/toolkit";

import {DraggableLocation} from "react-beautiful-dnd";

import { Todo } from "api/client";

import { State } from "../types";


interface ReorderTasks {
  source: DraggableLocation;
  destination: DraggableLocation;
}

interface ReorderTodosFulfilled {
  sourceTodo: Todo;
  destinationTodo: Todo;
}

const reorderTasksReducer = () => ({
  reorderTasksPending(state: State, action: PayloadAction<ReorderTasks>) {
    const source = action.payload.source;
    const destination = action.payload.destination;

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
  },
  reorderTasksFulfilled(state: State, action: PayloadAction<ReorderTodosFulfilled & ReorderTasks>) {
    if (
        state.entities[action.payload.sourceTodo.id] &&
        state.entities[action.payload.destinationTodo.id]
    ) {
      state.entities[action.payload.sourceTodo.id]!.tasks =
          action.payload.sourceTodo.tasks;
      state.entities[action.payload.destinationTodo.id]!.tasks =
          action.payload.destinationTodo.tasks;
    }

    const source = action.payload.source;
    const destination = action.payload.destination;

    delete state.statuses.todosUpdate[source.droppableId];
    delete state.statuses.todosUpdate[destination.droppableId];
  },
  reorderTasksRejected(state: State, action: PayloadAction<ReorderTasks>) {
    const source = action.payload.source;
    const destination = action.payload.destination;

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
  },
});

export default reorderTasksReducer;
