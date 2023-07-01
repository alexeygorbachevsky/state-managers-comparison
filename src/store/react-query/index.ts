import type { RootState, AppDispatch } from "./types";

import { default as store } from "./store";

import { todosSliceReducer } from "./slices";

export { store, todosSliceReducer, RootState, AppDispatch };
export { createAppAsyncThunk } from "./types";
