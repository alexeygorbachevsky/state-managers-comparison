import { configureStore, autoBatchEnhancer } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";

import { todosSliceReducer, alertsSliceReducer } from "./slices";
import { listenerMiddleware } from "./middleware";

import { watchTodos } from "./slices/todos";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: { todos: todosSliceReducer, alerts: alertsSliceReducer },
  devTools: process.env.NODE_ENV !== "production",
  enhancers: existingEnhancers => existingEnhancers.concat(autoBatchEnhancer()),
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      thunk: false,
      // TODO: updateTaskPending action func arg
      serializableCheck: false,
    })
      .prepend(listenerMiddleware.middleware)
      .concat(sagaMiddleware),
});

function* rootSaga() {
  yield all([watchTodos()]);
}

sagaMiddleware.run(rootSaga);

export default store;
