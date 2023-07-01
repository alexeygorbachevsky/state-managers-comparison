import { nanoid } from "@reduxjs/toolkit";
import { call, put, select } from "redux-saga/effects";

import { updateTodoTitle as updateTodoTitleFetch } from "api/client";

import { todosSlice } from "../todosSlice";
import { addAlertSaga, ALERT_DEFAULT_TIMEOUT, AlertTypes } from "../../alerts";

const {
  updateTodoTitlePending,
  updateTodoTitleRejected,
  updateTodoTitleFulfilled,
} = todosSlice.actions;

function* updateTodoTitle({
  payload,
}: ReturnType<typeof updateTodoTitlePending>) {
  const { isSessionStorage, loadDelay } = yield select(state => state.todos);

  let todo: Awaited<ReturnType<typeof updateTodoTitleFetch>>;

  try {
    todo = yield call(updateTodoTitleFetch, {
      ...payload,
      isSessionStorage,
      loadDelay,
    });
  } catch (err) {
    yield put({ type: updateTodoTitleRejected, payload });
    yield addAlertSaga({
      id: nanoid(),
      message: "Error is occurred - unable to update todo title.",
      type: AlertTypes.error,
    });

    return;
  }

  yield put({ type: updateTodoTitleFulfilled, payload: todo });
  yield addAlertSaga({
    id: nanoid(),
    message: `Todo title is successfully updated to "${todo.title}"`,
    type: AlertTypes.success,
    timeout: ALERT_DEFAULT_TIMEOUT,
  });

  return todo;
}

export default updateTodoTitle;
