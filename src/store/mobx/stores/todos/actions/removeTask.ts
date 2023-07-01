import { flow } from "mobx";
import { nanoid } from "@reduxjs/toolkit";

import type { Task, Todo } from "api/client";
import type TodosStore from "../todosStore";

import { removeTask as removeTaskFetch } from "api/client";

import { ALERT_DEFAULT_TIMEOUT, AlertTypes } from "../../alerts";

interface RemoveTaskArgs {
  todoId: Todo["id"];
  id: Task["id"];
}

type RemoveTaskReturn = Awaited<ReturnType<typeof removeTaskFetch>>;

const removeTask = flow<RemoveTaskReturn, [RemoveTaskArgs]>(
  function* createTask(this: TodosStore, { todoId, id }) {
    const { isSessionStorage, loadDelay, statuses, entities, rootStore } = this;

    statuses.todosUpdate[todoId] = {
      ...statuses.todosUpdate[todoId],
      [id]: true,
    };

    let todo: RemoveTaskReturn;
    try {
      todo = yield removeTaskFetch({ todoId, id, isSessionStorage, loadDelay });
    } catch (err) {
      delete statuses.todosUpdate[todoId]![id];

      if (!Object.keys(statuses.todosUpdate[todoId]!).length) {
        delete statuses.todosUpdate[todoId];
      }

      this.rootStore.alerts.addAlert({
        id: nanoid(),
        message: "Error is occurred - unable to remove task.",
        type: AlertTypes.error,
      });

      throw err;
    }

    delete statuses.todosUpdate[todoId]![id];

    if (!Object.keys(statuses.todosUpdate[todoId]!).length) {
      delete statuses.todosUpdate[todoId];
    }

    entities[todoId].tasks = entities[todoId].tasks.filter(
      task => task.id !== id,
    );

    rootStore.alerts.addAlert({
      id: nanoid(),
      message: `Task is successfully removed from "${todo.title}" todo`,
      type: AlertTypes.success,
      timeout: ALERT_DEFAULT_TIMEOUT,
    });

    return todo;
  },
);

export default removeTask;
