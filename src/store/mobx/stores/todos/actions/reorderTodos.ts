import { flow } from "mobx";
import { nanoid } from "@reduxjs/toolkit";

import type TodosStore from "../todosStore";

import { reorderTodos as reorderTodosFetch, Todo } from "api/client";

import { ALERT_DEFAULT_TIMEOUT, AlertTypes } from "../../alerts";

interface ReorderTodos {
  sourceIndex: number;
  destinationIndex: number;
}

type ReorderTodosReturn = Awaited<ReturnType<typeof reorderTodosFetch>>;

const reorderTodos = flow<ReorderTodosReturn, [ReorderTodos]>(
  function* createTask(this: TodosStore, args) {
    const { isSessionStorage, loadDelay, ids, rootStore } = this;

    reorderTodosPending.call(this, args);

    let result;
    try {
      result = yield reorderTodosFetch({ ids, isSessionStorage, loadDelay });
    } catch (err) {
      reorderTodosFailure.call(this);

      rootStore.alerts.addAlert({
        id: nanoid(),
        message: "Error is occurred - unable to reorder todos",
        type: AlertTypes.error,
      });

      throw err;
    }

    reorderTodosSuccess.call(this, result);

    rootStore.alerts.addAlert({
      id: nanoid(),
      message: "Todos are successfully reordered",
      type: AlertTypes.success,
      timeout: ALERT_DEFAULT_TIMEOUT,
    });

    return result;
  },
);

function reorderTodosPending(
  this: TodosStore,
  { destinationIndex, sourceIndex }: ReorderTodos,
) {
  const { ids, entities, statuses } = this;

  const targetId = ids[sourceIndex];
  ids.splice(sourceIndex, 1);
  ids.splice(destinationIndex, 0, targetId);

  ids.forEach((id, index) => {
    entities[id].index = ids.length - 1 - index;
  });

  this.prevDragIds = ids;
  statuses.isTodosReordering = true;
}

function reorderTodosSuccess(this: TodosStore, result: { ids: Todo["id"][] }) {
  const { statuses, entities } = this;

  this.ids = result.ids;

  result.ids.forEach((id, index) => {
    entities[id].index = result.ids.length - 1 - index;
  });

  statuses.isTodosReordering = false;
}

function reorderTodosFailure(this: TodosStore) {
  const { entities, statuses, prevDragIds } = this;

  // backup after fail
  prevDragIds.forEach((id, index) => {
    entities[id].index = prevDragIds.length - 1 - index;
  });

  this.ids = prevDragIds;
  statuses.isTodosReordering = false;
}

export default reorderTodos;
