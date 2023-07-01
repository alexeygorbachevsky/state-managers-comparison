import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
} from "@reduxjs/toolkit";

import type { Todo } from "api/client";

import type { ExtraInitialState } from "./types";

import { DelaysType, SESSION_STORAGE_ITEMS } from "constants/sessionStorage";

import {
  getIsTodosSessionStorage,
  getLoadDelay,
} from "selectors/sessionStorage";

export const todosAdapter = createEntityAdapter<Todo>({
  selectId: entity => entity.id,
  sortComparer: (a, b) => b.index - a.index,
});

const initialState: ExtraInitialState = {
  search: "",
  isSessionStorage: getIsTodosSessionStorage(),
  loadDelay: getLoadDelay(),
};
export const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setIsSessionStorage(state, action: PayloadAction<boolean>) {
      state.isSessionStorage = action.payload;
      sessionStorage.setItem(
        SESSION_STORAGE_ITEMS.isTodosSessionStorage,
        JSON.stringify(action.payload),
      );
      window.location.reload();
    },
    setLoadDelay(state, action: PayloadAction<DelaysType>) {
      state.loadDelay = action.payload;
      sessionStorage.setItem(
        SESSION_STORAGE_ITEMS.loadDelay,
        JSON.stringify(action.payload),
      );
    }
  },
});

export const {
  setSearch,
  setIsSessionStorage,
  setLoadDelay,
} = todosSlice.actions;

export default todosSlice.reducer;
