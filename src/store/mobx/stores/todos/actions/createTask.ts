import { flow } from "mobx";
import { nanoid } from "@reduxjs/toolkit";

import type { Task, Todo } from "api/client";
import type TodosStore from "../todosStore";

import { createTask as createTaskFetch } from "api/client";

import { ALERT_DEFAULT_TIMEOUT, AlertTypes } from "../../alerts";

interface CreateTaskArgs {
  todoId: Todo["id"];
  title: Task["title"];
}

type CreateTaskReturn = Awaited<ReturnType<typeof createTaskFetch>>;

const createTask = flow<CreateTaskReturn, [CreateTaskArgs]>(
  function* createTask(this: TodosStore, args) {
    const { isSessionStorage, loadDelay, statuses, entities, rootStore } = this;

    statuses.todosUpdate[args.todoId] = { isTodoUpdating: true };

    let todo: CreateTaskReturn;

    try {
      todo = yield createTaskFetch({ ...args, isSessionStorage, loadDelay });
    } catch (err) {
      delete statuses.todosUpdate[args.todoId];

      rootStore.alerts.addAlert({
        id: nanoid(),
        message: "Error is occurred - unable to create task.",
        type: AlertTypes.error,
      });

      throw err;
    }

    delete statuses.todosUpdate[todo.id];
    entities[todo.id].tasks = todo.tasks;

    rootStore.alerts.addAlert({
      id: nanoid(),
      message: `Task "${args.title}" is successfully created for "${todo.title}" todo`,
      type: AlertTypes.success,
      timeout: ALERT_DEFAULT_TIMEOUT,
    });

    return todo;
  },
);

export default createTask;
