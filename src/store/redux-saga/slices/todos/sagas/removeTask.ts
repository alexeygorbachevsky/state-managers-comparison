import { nanoid } from "@reduxjs/toolkit";
import { call, put, select } from "redux-saga/effects";

import { removeTask as removeTaskFetch } from "api/client";

import { todosSlice } from "../todosSlice";
import { addAlertSaga, ALERT_DEFAULT_TIMEOUT, AlertTypes } from "../../alerts";

const { removeTaskPending, removeTaskRejected, removeTaskFulfilled } =
  todosSlice.actions;

function* removeTask({ payload }: ReturnType<typeof removeTaskPending>) {
  const { isSessionStorage, loadDelay } = yield select(state => state.todos);

  let todo: Awaited<ReturnType<typeof removeTaskFetch>>;

  try {
    todo = yield call(removeTaskFetch, {
      ...payload,
      isSessionStorage,
      loadDelay,
    });
  } catch (err) {
    yield put({ type: removeTaskRejected, payload });
    yield addAlertSaga({
      id: nanoid(),
      message: "Error is occurred - unable to remove task.",
      type: AlertTypes.error,
    });

    return;
  }

  yield put({ type: removeTaskFulfilled, payload: { todo, task: payload } });
  yield addAlertSaga({
    id: nanoid(),
    message: `Task is successfully removed from "${todo.title}" todo`,
    type: AlertTypes.success,
    timeout: ALERT_DEFAULT_TIMEOUT,
  });

  return todo;
}

export default removeTask;
