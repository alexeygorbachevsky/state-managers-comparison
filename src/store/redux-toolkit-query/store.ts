import { configureStore, autoBatchEnhancer } from "@reduxjs/toolkit";

import { todosSliceReducer, alertsSliceReducer } from "./slices";
import { listenerMiddleware } from "./middleware";
import { todosApi } from "./api";

const store = configureStore({
  reducer: {
    todos: todosSliceReducer,
    alerts: alertsSliceReducer,
    [todosApi.reducerPath]: todosApi.reducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  enhancers: existingEnhancers => existingEnhancers.concat(autoBatchEnhancer()),
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .prepend(listenerMiddleware.middleware)
      .concat(todosApi.middleware),
});

export default store;
