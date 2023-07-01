import { createAsyncThunk } from "@reduxjs/toolkit";

import { Todo } from "api/client";

import { default as store } from "./store";

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: string;
  meta: unknown;
}>();

export type QueryPage = { todos: Todo[]; isLastBatch: boolean };

export interface QueryData {
  pages: QueryPage[];
  pageParam: string[];
}
