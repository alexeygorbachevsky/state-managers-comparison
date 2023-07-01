import { nanoid } from "@reduxjs/toolkit";
import { call, put, select } from "redux-saga/effects";

import { removeTodo as removeTodoFetch } from "api/client";

import { todosSlice } from "../todosSlice";
import { addAlertSaga, ALERT_DEFAULT_TIMEOUT, AlertTypes } from "../../alerts";

const { removeTodoPending, removeTodoRejected, removeTodoFulfilled } =
  todosSlice.actions;

function* removeTodo({ payload }: ReturnType<typeof removeTodoPending>) {
  const { isSessionStorage, loadDelay } = yield select(state => state.todos);

  let todo: Awaited<ReturnType<typeof removeTodoFetch>>;

  try {
    todo = yield call(removeTodoFetch, {
      id: payload,
      isSessionStorage,
      loadDelay,
    });
  } catch (err) {
    yield put({ type: removeTodoRejected, payload });
    yield addAlertSaga({
      id: nanoid(),
      message: "Error is occurred - unable to remove todo.",
      type: AlertTypes.error,
    });

    return;
  }

  yield put({ type: removeTodoFulfilled, payload: todo });
  yield addAlertSaga({
    id: nanoid(),
    message: `Todo "${todo.title}" is successfully removed`,
    type: AlertTypes.success,
    timeout: ALERT_DEFAULT_TIMEOUT,
  });

  return todo;
}

export default removeTodo;
