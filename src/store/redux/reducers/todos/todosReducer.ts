import type { InitialState } from "./types";

import { STATUS } from "constants/status";

import {
  getIsTodosSessionStorage,
  getLoadDelay,
} from "selectors/sessionStorage";

import { createReducer } from "../../ducks";
import { todosActionTypes, todosReducers, todosThunks } from "./ducks";

const { CLEAR_TODOS, SET_SEARCH, SET_IS_SESSION_STORAGE, SET_LOAD_DELAY } =
  todosActionTypes;
const { clearTodos, setSearch, setIsSessionStorage, setLoadDelay } =
  todosReducers;

const {
  createTaskReducer,
  createTodoReducer,
  loadTodosReducer,
  removeTaskReducer,
  removeTodoReducer,
  reorderTasksReducer,
  reorderTodosReducer,
  updateTaskReducer,
  updateTodoTitleReducer,
} = todosThunks;

const initialState: InitialState = {
  ids: [],
  entities: {},
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
};

const todosReducer = createReducer<InitialState>(initialState, {
  [CLEAR_TODOS]: clearTodos,
  [SET_SEARCH]: setSearch,
  [SET_IS_SESSION_STORAGE]: setIsSessionStorage,
  [SET_LOAD_DELAY]: setLoadDelay,
  ...createTaskReducer,
  ...createTodoReducer,
  ...loadTodosReducer,
  ...removeTaskReducer,
  ...removeTodoReducer,
  ...reorderTasksReducer,
  ...reorderTodosReducer,
  ...updateTaskReducer,
  ...updateTodoTitleReducer,
});

export default todosReducer;
