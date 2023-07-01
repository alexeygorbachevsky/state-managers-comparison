import { EntityAdapter, PayloadAction } from "@reduxjs/toolkit";

import { Todo, Task } from "api/client";

import { State } from "../types";

interface RemoveTask {
  todoId: Task["todoId"];
  id: Task["id"];
}

const removeTaskReducer = (todosAdapter: EntityAdapter<Todo>) => ({
  removeTaskPending(state: State, action: PayloadAction<RemoveTask>) {
    const { todoId, id } = action.payload;

    if (state.statuses.todosUpdate[todoId]) {
      state.statuses.todosUpdate[todoId]![id] = true;
    } else {
      state.statuses.todosUpdate = {
        ...state.statuses.todosUpdate,
        [todoId]: {
          [id]: true,
        },
      };
    }
  },
  removeTaskFulfilled(
    state: State,
    action: PayloadAction<{ task: RemoveTask; todo: Todo }>,
  ) {
    const { todoId, id } = action.payload.task;

    delete state.statuses.todosUpdate[todoId]![id];

    if (!Object.keys(state.statuses.todosUpdate[todoId]!).length) {
      delete state.statuses.todosUpdate[todoId];
    }

    todosAdapter.updateOne(state, {
      ...action.payload.todo,
      changes: {
        tasks: action.payload.todo.tasks,
      },
    });
  },

  removeTaskRejected(state: State, action: PayloadAction<RemoveTask>) {
    const { todoId, id } = action.payload;

    delete state.statuses.todosUpdate[todoId]![id];

    if (!Object.keys(state.statuses.todosUpdate[todoId]!).length) {
      delete state.statuses.todosUpdate[todoId];
    }
  },
});

export default removeTaskReducer;
