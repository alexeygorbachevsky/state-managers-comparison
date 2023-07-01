import { createAsyncThunk } from "@reduxjs/toolkit";

import { default as store } from "./store";

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: string;
  meta: unknown;
}>();
