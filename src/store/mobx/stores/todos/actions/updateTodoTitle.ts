import { flow } from "mobx";
import { nanoid } from "@reduxjs/toolkit";

import type { Todo } from "api/client";
import type TodosStore from "../todosStore";

import {
  createTodo as createTodoFetch,
  updateTodoTitle as updateTodoTitleFetch,
} from "api/client";

import { ALERT_DEFAULT_TIMEOUT, AlertTypes } from "../../alerts";

interface UpdateTodoTitle {
  id: Todo["id"];
  title: Todo["title"];
}

type UpdateTodoTitleReturn = Awaited<ReturnType<typeof createTodoFetch>>;

const updateTodoTitle = flow<UpdateTodoTitleReturn, [UpdateTodoTitle]>(
  function* createTask(this: TodosStore, { id, title }) {
    const { isSessionStorage, loadDelay, statuses, entities, rootStore } = this;

    statuses.todosUpdate[id] = {
      ...statuses.todosUpdate[id],
      isTodoUpdating: true,
    };

    let todo: UpdateTodoTitleReturn;
    try {
      todo = yield updateTodoTitleFetch({
        id,
        title,
        isSessionStorage,
        loadDelay,
      });
    } catch (err) {
      delete statuses.todosUpdate[id];

      rootStore.alerts.addAlert({
        id: nanoid(),
        message: "Error is occurred - unable to update todo title.",
        type: AlertTypes.error,
      });

      throw err;
    }

    delete statuses.todosUpdate[id];
    entities[id].title = todo.title;

    rootStore.alerts.addAlert({
      id: nanoid(),
      message: `Todo title is successfully updated to "${todo.title}"`,
      type: AlertTypes.success,
      timeout: ALERT_DEFAULT_TIMEOUT,
    });

    return todo;
  },
);

export default updateTodoTitle;
