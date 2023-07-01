import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
} from "@reduxjs/toolkit";

import type { Todo } from "api/client";
import type { RootState } from "../../types";
import type { ExtraInitialState } from "./types";

import { DelaysType, SESSION_STORAGE_ITEMS } from "constants/sessionStorage";
import { STATUS } from "constants/status";

import {
  getIsTodosSessionStorage,
  getLoadDelay,
} from "selectors/sessionStorage";

import {
  loadTodosReducer,
  createTodoReducer,
  removeTodoReducer,
  updateTodoTitleReducer,
  createTaskReducer,
  removeTaskReducer,
  updateTaskReducer,
  reorderTodosReducer,
  reorderTasksReducer,
} from "./thunks";

const todosAdapter = createEntityAdapter<Todo>({
  selectId: entity => entity.id,
  sortComparer: (a, b) => b.index - a.index,
});

export const todosSlice = createSlice({
  name: "todos",
  initialState: todosAdapter.getInitialState<ExtraInitialState>({
    prevDragIds: [],
    prevDragTasks: {},
    cursor: "",
    search: "",
    isLastBatch: false,
    isSessionStorage: getIsTodosSessionStorage(),
    loadDelay: getLoadDelay(),
    statuses: {
      todosLoad: STATUS.loading,
      todosUpdate: {},
      isTodoCreating: false,
      isTodosReordering: false,
    },
  }),
  reducers: {
    clearTodos(state) {
      todosAdapter.removeAll(state);
      state.isLastBatch = false;
      state.cursor = "";
    },
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
    },
  },
  extraReducers: builder => {
    loadTodosReducer(builder, todosAdapter);
    createTodoReducer(builder, todosAdapter);
    removeTodoReducer(builder, todosAdapter);
    updateTodoTitleReducer(builder, todosAdapter);
    createTaskReducer(builder, todosAdapter);
    removeTaskReducer(builder, todosAdapter);
    updateTaskReducer(builder, todosAdapter);
    reorderTodosReducer(builder);
    reorderTasksReducer(builder);
  },
});

export const { clearTodos, setSearch, setIsSessionStorage, setLoadDelay } =
  todosSlice.actions;

export const {
  selectAll: selectAllTodos,
  selectById: selectTodoById,
  selectIds: selectTodoIds,
} = todosAdapter.getSelectors<RootState>(state => state.todos);

export default todosSlice.reducer;
