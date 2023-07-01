import { DelaysType } from "constants/sessionStorage";

import { InitialState } from "../types";
import { PayloadAction } from "../../../types";

export const clearTodos = (state: InitialState): InitialState => ({
  ...state,
  ids: [],
  entities: {},
  isLastBatch: false,
  cursor: "",
});

export const setSearch = (
  state: InitialState,
  action: PayloadAction<string>,
): InitialState => ({
  ...state,
  search: action.payload,
});

export const setIsSessionStorage = (
  state: InitialState,
  action: PayloadAction<boolean>,
): InitialState => ({
  ...state,
  isSessionStorage: action.payload,
});

export const setLoadDelay = (
  state: InitialState,
  action: PayloadAction<DelaysType>,
): InitialState => ({
  ...state,
  loadDelay: action.payload,
});
