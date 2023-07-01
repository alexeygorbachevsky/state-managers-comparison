import { nanoid } from "@reduxjs/toolkit";
import { call, put, select } from "redux-saga/effects";

import { fetchTodos } from "api/client";

import { todosSlice } from "../todosSlice";
import { addAlertSaga, AlertTypes } from "../../alerts";

const { loadTodosFulfilled, loadTodosRejected } = todosSlice.actions;

function* loadTodos() {
  const { cursor, search, isSessionStorage, loadDelay } = yield select(
    state => state.todos,
  );

  let data: Awaited<ReturnType<typeof fetchTodos>>;

  try {
    data = yield call(fetchTodos, {
      cursor,
      search,
      isSessionStorage,
      loadDelay,
    });
  } catch (err) {
    yield put({ type: loadTodosRejected });
    yield addAlertSaga({
      id: nanoid(),
      message: "Error is occurred - unable to load todos.",
      type: AlertTypes.error,
    });

    return;
  }

  yield put({ type: loadTodosFulfilled, payload: data });

  return data;
}

export default loadTodos;
