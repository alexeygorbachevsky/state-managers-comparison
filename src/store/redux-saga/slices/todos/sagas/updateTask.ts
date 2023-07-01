import { nanoid } from "@reduxjs/toolkit";
import { call, put, select } from "redux-saga/effects";

import { updateTask as updateTaskFetch } from "api/client";

import { todosSlice } from "../todosSlice";
import { addAlertSaga, ALERT_DEFAULT_TIMEOUT, AlertTypes } from "../../alerts";

const { updateTaskPending, updateTaskRejected, updateTaskFulfilled } =
  todosSlice.actions;

function* updateTask({ payload }: ReturnType<typeof updateTaskPending>) {
  const { setPreviousIsCheckedStatus, ...args } = payload;
  const { isSessionStorage, loadDelay } = yield select(state => state.todos);

  let todo: Awaited<ReturnType<typeof updateTaskFetch>>;

  try {
    todo = yield call(updateTaskFetch, {
      ...args,
      isSessionStorage,
      loadDelay,
    });
  } catch (err) {
    if (setPreviousIsCheckedStatus) {
      setPreviousIsCheckedStatus();
    }

    yield put({ type: updateTaskRejected, payload: args });
    yield addAlertSaga({
      id: nanoid(),
      message: "Error is occurred - unable to update task.",
      type: AlertTypes.error,
    });

    return;
  }

  yield put({ type: updateTaskFulfilled, payload: { todo, task: args } });
  yield addAlertSaga({
    id: nanoid(),
    message: `Task is successfully updated from "${todo.title}" todo`,
    type: AlertTypes.success,
    timeout: ALERT_DEFAULT_TIMEOUT,
  });

  return todo;
}

export default updateTask;
