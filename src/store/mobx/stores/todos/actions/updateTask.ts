import { flow } from "mobx";
import { nanoid } from "@reduxjs/toolkit";

import type { Task, Todo } from "api/client";
import type TodosStore from "../todosStore";

import { updateTask as updateTaskFetch } from "api/client";

import { ALERT_DEFAULT_TIMEOUT, AlertTypes } from "../../alerts";

interface UpdateTask {
  todoId: Todo["id"];
  id: Task["id"];
  title?: Task["title"];
  isChecked?: Task["isChecked"];
}

type UpdateTaskReturn = Awaited<ReturnType<typeof updateTaskFetch>>;

const updateTask = flow<UpdateTaskReturn, [UpdateTask]>(function* createTask(
  this: TodosStore,
  args,
) {
  const { isSessionStorage, loadDelay, statuses, entities, rootStore } = this;

  statuses.todosUpdate[args.todoId] = {
    ...statuses.todosUpdate[args.todoId],
    [args.id]: true,
  };

  let todo: UpdateTaskReturn;
  try {
    todo = yield updateTaskFetch({ ...args, isSessionStorage, loadDelay });
  } catch (err) {
    delete statuses.todosUpdate[args.todoId]![args.id];

    if (!Object.keys(statuses.todosUpdate[args.todoId]!).length) {
      delete statuses.todosUpdate[args.todoId];
    }

    rootStore.alerts.addAlert({
      id: nanoid(),
      message: "Error is occurred - unable to update task.",
      type: AlertTypes.error,
    });

    throw err;
  }

  delete statuses.todosUpdate[args.todoId]![args.id];

  if (!Object.keys(statuses.todosUpdate[args.todoId]!).length) {
    delete statuses.todosUpdate[args.todoId];
  }

  entities[args.todoId].tasks = todo.tasks;

  rootStore.alerts.addAlert({
    id: nanoid(),
    message: `Task is successfully updated from "${todo.title}" todo`,
    type: AlertTypes.success,
    timeout: ALERT_DEFAULT_TIMEOUT,
  });

  return todo;
});

export default updateTask;
