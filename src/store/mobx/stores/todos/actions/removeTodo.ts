import { flow } from "mobx";
import { nanoid } from "@reduxjs/toolkit";

import type { Todo } from "api/client";
import type TodosStore from "../todosStore";

import { removeTodo as removeTodoFetch } from "api/client";

import { ALERT_DEFAULT_TIMEOUT, AlertTypes } from "../../alerts";

type RemoveTodoReturn = Awaited<ReturnType<typeof removeTodoFetch>>;

const removeTodo = flow<RemoveTodoReturn, [Todo["id"]]>(function* createTask(
  this: TodosStore,
  id,
) {
  const { isSessionStorage, loadDelay, statuses, entities } = this;

  statuses.todosUpdate[id] = {
    isTodoUpdating: true,
  };

  let todo: RemoveTodoReturn;
  try {
    todo = yield removeTodoFetch({ id, isSessionStorage, loadDelay });
  } catch (err) {
    delete statuses.todosUpdate[id];

    this.rootStore.alerts.addAlert({
      id: nanoid(),
      message: "Error is occurred - unable to remove todo.",
      type: AlertTypes.error,
    });

    throw err;
  }

  delete statuses.todosUpdate[todo.id];
  delete entities[todo.id];
  this.ids = this.ids.filter(id => id !== todo.id);

  this.rootStore.alerts.addAlert({
    id: nanoid(),
    message: `Todo "${todo.title}" is successfully removed`,
    type: AlertTypes.success,
    timeout: ALERT_DEFAULT_TIMEOUT,
  });

  return todo;
});

export default removeTodo;
