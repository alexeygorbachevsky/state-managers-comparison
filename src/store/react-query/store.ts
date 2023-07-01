import { configureStore, autoBatchEnhancer } from "@reduxjs/toolkit";

import { todosSliceReducer, alertsSliceReducer } from "./slices";
import { listenerMiddleware } from "./middleware";

const store = configureStore({
  reducer: {
    todos: todosSliceReducer,
    alerts: alertsSliceReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  enhancers: existingEnhancers => existingEnhancers.concat(autoBatchEnhancer()),
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .prepend(listenerMiddleware.middleware)
});

export default store;
