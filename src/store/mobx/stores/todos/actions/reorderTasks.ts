import { flow } from "mobx";
import { nanoid } from "@reduxjs/toolkit";
import { DraggableLocation } from "react-beautiful-dnd";

import type TodosStore from "../todosStore";

import { reorderTasks as reorderTasksFetch, Todo } from "api/client";

import { ALERT_DEFAULT_TIMEOUT, AlertTypes } from "../../alerts";

interface ReorderTasks {
  source: DraggableLocation;
  destination: DraggableLocation;
}

type ReorderTasksReturn = Awaited<ReturnType<typeof reorderTasksFetch>>;

const reorderTasks = flow<ReorderTasksReturn, [ReorderTasks]>(
  function* createTask(this: TodosStore, args) {
    const { isSessionStorage, loadDelay } = this;

    reorderTasksPending.call(this, args);

    let result: ReorderTasksReturn;
    try {
      result = yield reorderTasksFetch({
        ...args,
        isSessionStorage,
        loadDelay,
      });
    } catch (err) {
      reorderTasksFailure.call(this, args);

      this.rootStore.alerts.addAlert({
        id: nanoid(),
        message: "Error is occurred - unable to reorder tasks",
        type: AlertTypes.error,
      });

      throw err;
    }

    reorderTasksSuccess.call(this, { ...args, ...result });

    this.rootStore.alerts.addAlert({
      id: nanoid(),
      message: "Tasks are successfully reordered",
      type: AlertTypes.success,
      timeout: ALERT_DEFAULT_TIMEOUT,
    });

    return result;
  },
);

function reorderTasksPending(
  this: TodosStore,
  { source, destination }: ReorderTasks,
) {
  const { statuses, entities, prevDragTasks } = this;

  statuses.todosUpdate[source.droppableId] = {
    isTodoUpdating: true,
  };
  statuses.todosUpdate[destination.droppableId] = {
    isTodoUpdating: true,
  };

  const sourceTodo = entities[source.droppableId] as Todo;
  const destinationTodo = entities[destination.droppableId] as Todo;

  prevDragTasks[source.droppableId] = sourceTodo.tasks.slice();
  prevDragTasks[destination.droppableId] = destinationTodo.tasks.slice();

  const targetTask = sourceTodo.tasks[source.index];

  sourceTodo.tasks.splice(source.index, 1);
  destinationTodo.tasks.splice(destination.index, 0, targetTask);
}

function reorderTasksSuccess(
  this: TodosStore,
  {
    source,
    destination,
    sourceTodo,
    destinationTodo,
  }: ReorderTasks & Awaited<ReturnType<typeof reorderTasksFetch>>,
) {
  const { statuses, entities } = this;

  entities[sourceTodo.id].tasks = sourceTodo.tasks;
  entities[destinationTodo.id].tasks = destinationTodo.tasks;

  delete statuses.todosUpdate[source.droppableId];
  delete statuses.todosUpdate[destination.droppableId];
}

function reorderTasksFailure(
  this: TodosStore,
  { source, destination }: ReorderTasks,
) {
  const { statuses, entities, prevDragTasks } = this;

  delete statuses.todosUpdate[source.droppableId];
  delete statuses.todosUpdate[destination.droppableId];

  // backup after fail
  entities[source.droppableId].tasks = prevDragTasks[source.droppableId];
  entities[destination.droppableId].tasks =
    prevDragTasks[destination.droppableId];
}

export default reorderTasks;
