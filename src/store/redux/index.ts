import type { RootState, AppDispatch } from "./types";

import { default as store } from "./store";

import { todosReducer } from "./reducers";

export { store, todosReducer, RootState, AppDispatch };
