import { makeAutoObservable } from "mobx";

import type { TodosState } from "./types";
import type { RootStoreType } from "../../rootStore";

import {
  getIsTodosSessionStorage,
  getLoadDelay,
} from "selectors/sessionStorage";

import { STATUS } from "constants/status";

import {
  setLoadDelay,
  setIsSessionStorage,
  setSearch,
  clearTodos,
  createTask,
  createTodo,
  loadTodos,
  removeTask,
  reorderTasks,
  reorderTodos,
  updateTask,
  updateTodoTitle,
  removeTodo,
} from "./actions";

import { selectTodoById, selectTasksByFilter } from "./derivations";

class TodosStore {
  rootStore: RootStoreType;

  // State
  ids: TodosState["ids"] = [];
  entities: TodosState["entities"] = {};
  prevDragIds: TodosState["prevDragIds"] = [];
  prevDragTasks: TodosState["prevDragTasks"] = {};
  cursor: TodosState["cursor"] = "";
  search: TodosState["search"] = "";
  isLastBatch: TodosState["isLastBatch"] = false;
  isSessionStorage: TodosState["isSessionStorage"] = getIsTodosSessionStorage();
  loadDelay: TodosState["loadDelay"] = getLoadDelay();
  statuses: TodosState["statuses"] = {
    todosLoad: STATUS.loading,
    todosUpdate: {},
    isTodoCreating: false,
    isTodosReordering: false,
  };

  constructor(rootStore: RootStoreType) {
    this.rootStore = rootStore;
    makeAutoObservable(this, { rootStore: false });
  }

  // Actions
  setLoadDelay = setLoadDelay;
  setIsSessionStorage = setIsSessionStorage;
  setSearch = setSearch;
  clearTodos = clearTodos;

  // Async actions
  createTask = createTask;
  createTodo = createTodo;
  loadTodos = loadTodos;
  removeTask = removeTask;
  removeTodo = removeTodo;
  reorderTasks = reorderTasks;
  reorderTodos = reorderTodos;
  updateTask = updateTask;
  updateTodoTitle = updateTodoTitle;

  // Derivations
  selectTodoById = selectTodoById;
  selectTasksByFilter = selectTasksByFilter;
}

export default TodosStore;
