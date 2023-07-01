import { EntityAdapter, PayloadAction } from "@reduxjs/toolkit";

import { Todo, Task } from "api/client";

import { State } from "../types";

interface UpdateTask {
  todoId: Todo["id"];
  id: Task["id"];
  title?: Task["title"];
  isChecked?: Task["isChecked"];
}

interface SetIsCheckedStatus {
  setPreviousIsCheckedStatus?: () => void;
}

const updateTaskReducer = (todosAdapter: EntityAdapter<Todo>) => ({
  updateTaskPending(
    state: State,
    action: PayloadAction<UpdateTask & SetIsCheckedStatus>,
  ) {
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
  updateTaskFulfilled(
    state: State,
    action: PayloadAction<{ task: UpdateTask; todo: Todo }>,
  ) {
    const { todoId, id } = action.payload.task;

    if (state.statuses.todosUpdate[todoId]) {
      delete state.statuses.todosUpdate[todoId]![id];
    }

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
  updateTaskRejected(state: State, action: PayloadAction<UpdateTask>) {
    const { todoId, id } = action.payload;

    delete state.statuses.todosUpdate[todoId]![id];

    if (!Object.keys(state.statuses.todosUpdate[todoId]!).length) {
      delete state.statuses.todosUpdate[todoId];
    }
  },
});

export default updateTaskReducer;
