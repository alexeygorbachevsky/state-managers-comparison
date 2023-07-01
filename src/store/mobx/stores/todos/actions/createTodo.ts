import { flow } from "mobx";
import { nanoid } from "@reduxjs/toolkit";

import type { Todo } from "api/client";
import type TodosStore from "../todosStore";

import { createTodo as createTodoFetch } from "api/client";

import { ALERT_DEFAULT_TIMEOUT, AlertTypes } from "../../alerts";

type CreateTodoReturn = Awaited<ReturnType<typeof createTodoFetch>>;

const createTodo = flow<CreateTodoReturn, [Todo["title"]]>(function* createTask(
  this: TodosStore,
  title,
) {
  const { isSessionStorage, loadDelay, statuses, ids, entities, rootStore } =
    this;

  statuses.isTodoCreating = true;

  let todo: CreateTodoReturn;
  try {
    todo = yield createTodoFetch({ title, isSessionStorage, loadDelay });
  } catch (err) {
    rootStore.alerts.addAlert({
      id: nanoid(),
      message: "Error is occurred - unable to create todo.",
      type: AlertTypes.error,
    });

    statuses.isTodoCreating = false;

    throw err;
  }

  ids.unshift(todo.id);
  entities[todo.id] = todo;
  statuses.isTodoCreating = false;

  rootStore.alerts.addAlert({
    id: nanoid(),
    message: `Todo "${todo.title}" is successfully created`,
    type: AlertTypes.success,
    timeout: ALERT_DEFAULT_TIMEOUT,
  });

  return todo;
});

export default createTodo;
