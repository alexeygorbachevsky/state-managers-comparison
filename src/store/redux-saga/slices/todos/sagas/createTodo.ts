import { nanoid } from "@reduxjs/toolkit";
import { call, put, select } from "redux-saga/effects";

import { createTodo as createTodoFetch } from "api/client";

import { todosSlice } from "../todosSlice";
import { addAlertSaga, ALERT_DEFAULT_TIMEOUT, AlertTypes } from "../../alerts";

const { createTodoPending, createTodoRejected, createTodoFulfilled } =
  todosSlice.actions;

function* createTodo({ payload }: ReturnType<typeof createTodoPending>) {
  const { isSessionStorage, loadDelay } = yield select(state => state.todos);

  let todo: Awaited<ReturnType<typeof createTodoFetch>>;

  try {
    todo = yield call(createTodoFetch, {
      title: payload,
      isSessionStorage,
      loadDelay,
    });
  } catch (err) {
    yield put({ type: createTodoRejected });
    yield addAlertSaga({
      id: nanoid(),
      message: "Error is occurred - unable to create todo.",
      type: AlertTypes.error,
    });

    return;
  }

  yield put({ type: createTodoFulfilled, payload: todo });
  yield addAlertSaga({
    id: nanoid(),
    message: `Todo "${todo.title}" is successfully created`,
    type: AlertTypes.success,
    timeout: ALERT_DEFAULT_TIMEOUT,
  });

  return todo;
}

export default createTodo;
