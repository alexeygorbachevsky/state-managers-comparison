import { nanoid } from "@reduxjs/toolkit";
import { call, put, select } from "redux-saga/effects";

import { reorderTodos as reorderTodosFetch } from "api/client";

import { todosSlice } from "../todosSlice";
import { addAlertSaga, ALERT_DEFAULT_TIMEOUT, AlertTypes } from "../../alerts";

const { reorderTodosRejected, reorderTodosFulfilled } = todosSlice.actions;

function* reorderTodos() {
  const { isSessionStorage, loadDelay, ids } = yield select(
    state => state.todos,
  );

  let result: Awaited<ReturnType<typeof reorderTodosFetch>>;

  try {
    result = yield call(reorderTodosFetch, {
      ids,
      isSessionStorage,
      loadDelay,
    });
  } catch (err) {
    yield put({ type: reorderTodosRejected });
    yield addAlertSaga({
      id: nanoid(),
      message: "Error is occurred - unable to reorder todos",
      type: AlertTypes.error,
    });

    return;
  }

  yield put({ type: reorderTodosFulfilled, payload: result.ids });
  yield addAlertSaga({
    id: nanoid(),
    message: "Todos are successfully reordered",
    type: AlertTypes.success,
    timeout: ALERT_DEFAULT_TIMEOUT,
  });

  return result;
}

export default reorderTodos;
