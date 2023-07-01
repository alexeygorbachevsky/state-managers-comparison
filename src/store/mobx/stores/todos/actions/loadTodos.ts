import { flow } from "mobx";
import { nanoid } from "@reduxjs/toolkit";

import type TodosStore from "../todosStore";

import { fetchTodos } from "api/client";

import { STATUS } from "constants/status";

import { AlertTypes } from "../../alerts";
import { Entities } from "../types";

type LoadTodosReturn = Awaited<ReturnType<typeof fetchTodos>>;

const loadTodos = flow<LoadTodosReturn, void[]>(function* createTask(
  this: TodosStore,
) {
  const { isSessionStorage, loadDelay, statuses, cursor, search, rootStore } =
    this;

  statuses.todosLoad = STATUS.loading;

  let data: LoadTodosReturn;

  try {
    data = yield fetchTodos({
      cursor,
      search,
      isSessionStorage,
      loadDelay,
    });
  } catch (err) {
    statuses.todosLoad = STATUS.failed;

    rootStore.alerts.addAlert({
      id: nanoid(),
      message: "Error is occurred - unable to load todos.",
      type: AlertTypes.error,
    });

    throw err;
  }

  const newTodos = data.todos.sort((a, b) => b.index - a.index);
  const newEntities = newTodos.reduce((memo: Entities, todo) => {
    memo[todo.id] = todo;

    return memo;
  }, {});

  this.ids = this.ids.concat(newTodos.map(todo => todo.id));
  this.entities = {
    ...this.entities,
    ...newEntities,
  };
  this.cursor = newTodos.length
    ? newTodos[newTodos.length - 1].id
    : this.cursor;
  this.isLastBatch = data.isLastBatch;
  statuses.todosLoad = STATUS.succeeded;

  return data;
});

export default loadTodos;
