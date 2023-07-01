import { nanoid } from "@reduxjs/toolkit";
import { call, put, select } from "redux-saga/effects";

import { createTask as createTaskFetch } from "api/client";

import { todosSlice } from "../todosSlice";
import {
  addAlertSaga,
  ALERT_DEFAULT_TIMEOUT,
  AlertTypes,
} from "../../alerts";

const { createTaskPending, createTaskRejected, createTaskFulfilled } =
  todosSlice.actions;

function* createTask({ payload }: ReturnType<typeof createTaskPending>) {
  const { isSessionStorage, loadDelay } = yield select(state => state.todos);

  let todo: Awaited<ReturnType<typeof createTaskFetch>>;

  try {
    todo = yield call(createTaskFetch, {
      ...payload,
      isSessionStorage,
      loadDelay,
    });
  } catch (err) {
    yield put({ type: createTaskRejected });
    yield addAlertSaga({
      id: nanoid(),
      message: "Error is occurred - unable to create task.",
      type: AlertTypes.error,
    });

    return;
  }

  yield put({ type: createTaskFulfilled, payload: todo });

  yield addAlertSaga({
    id: nanoid(),
    message: `Task "${payload.title}" is successfully created for "${todo.title}" todo`,
    type: AlertTypes.success,
    timeout: ALERT_DEFAULT_TIMEOUT,
  });

  return todo;
}

export default createTask;
