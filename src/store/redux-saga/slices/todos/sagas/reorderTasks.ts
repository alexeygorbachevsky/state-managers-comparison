import { nanoid } from "@reduxjs/toolkit";
import { call, put, select } from "redux-saga/effects";

import { reorderTasks as reorderTasksFetch } from "api/client";

import { todosSlice } from "../todosSlice";
import { addAlertSaga, ALERT_DEFAULT_TIMEOUT, AlertTypes } from "../../alerts";

const { reorderTasksPending, reorderTasksRejected, reorderTasksFulfilled } =
  todosSlice.actions;

function* reorderTasks({ payload }: ReturnType<typeof reorderTasksPending>) {
  const { isSessionStorage, loadDelay } = yield select(state => state.todos);

  let result: Awaited<ReturnType<typeof reorderTasksFetch>> | void;

  try {
    result = yield call(reorderTasksFetch, {
      ...payload,
      isSessionStorage,
      loadDelay,
    });
  } catch (err) {
    yield put({ type: reorderTasksRejected, payload });
    yield addAlertSaga({
      id: nanoid(),
      message: "Error is occurred - unable to reorder tasks",
      type: AlertTypes.error,
    });

    return;
  }

  yield put({
    type: reorderTasksFulfilled,
    payload: { ...payload, ...result },
  });

  yield addAlertSaga({
    id: nanoid(),
    message: "Tasks are successfully reordered",
    type: AlertTypes.success,
    timeout: ALERT_DEFAULT_TIMEOUT,
  });

  return result;
}

export default reorderTasks;
