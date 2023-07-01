import type { Alert } from "store/react-context/types";

import { DelaysType } from "constants/sessionStorage";

import {
  CreateTaskFailureAction,
  CreateTaskPendingAction,
  CreateTaskSuccessAction,
} from "./thunks/createTask";
import {
  CreateTodoFailureAction,
  CreateTodoPendingAction,
  CreateTodoSuccessAction,
} from "./thunks/createTodo";
import {
  LoadTodosFailureAction,
  LoadTodosPendingAction,
  LoadTodosSuccessAction,
} from "./thunks/loadTodos";
import {
  RemoveTaskFailureAction,
  RemoveTaskPendingAction,
  RemoveTaskSuccessAction,
} from "./thunks/removeTask";
import {
  RemoveTodoFailureAction,
  RemoveTodoPendingAction,
  RemoveTodoSuccessAction,
} from "./thunks/removeTodo";
import {
  ReorderTasksFailureAction,
  ReorderTasksPendingAction,
  ReorderTasksSuccessAction,
} from "./thunks/reorderTasks";
import {
  ReorderTodosFailureAction,
  ReorderTodosPendingAction,
  ReorderTodosSuccessAction,
} from "./thunks/reorderTodos";
import {
  UpdateTaskFailureAction,
  UpdateTaskPendingAction,
  UpdateTaskSuccessAction,
} from "./thunks/updateTask";
import {
  UpdateTodoTitlePendingAction,
  UpdateTodoTitleFailureAction,
  UpdateTodoTitleSuccessAction,
} from "./thunks/updateTodoTitle";

enum actionTypes {
  CLEAR_TODOS = "todos/CLEAR_TODOS",

  SET_SEARCH = "todos/SET_SEARCH",

  SET_IS_SESSION_STORAGE = "todos/SET_IS_SESSION_STORAGE",

  SET_LOAD_DELAY = "todos/SET_LOAD_DELAY",

  CREATE_TASK_PENDING = "todos/CREATE_TASK_PENDING",
  CREATE_TASK_SUCCESS = "todos/CREATE_TASK_SUCCESS",
  CREATE_TASK_FAILURE = "todos/CREATE_TASK_FAILURE",

  CREATE_TODO_PENDING = "todos/CREATE_TODO_PENDING",
  CREATE_TODO_SUCCESS = "todos/CREATE_TODO_SUCCESS",
  CREATE_TODO_FAILURE = "todos/CREATE_TODO_FAILURE",

  LOAD_TODOS_PENDING = "todos/LOAD_TODOS_PENDING",
  LOAD_TODOS_SUCCESS = "todos/LOAD_TODOS_SUCCESS",
  LOAD_TODOS_FAILURE = "todos/LOAD_TODOS_FAILURE",

  REMOVE_TASK_PENDING = "todos/REMOVE_TASK_PENDING",
  REMOVE_TASK_SUCCESS = "todos/REMOVE_TASK_SUCCESS",
  REMOVE_TASK_FAILURE = "todos/REMOVE_TASK_FAILURE",

  REMOVE_TODO_PENDING = "todos/REMOVE_TODO_PENDING",
  REMOVE_TODO_SUCCESS = "todos/REMOVE_TODO_SUCCESS",
  REMOVE_TODO_FAILURE = "todos/REMOVE_TODO_FAILURE",

  REORDER_TASKS_PENDING = "todos/REORDER_TASKS_PENDING",
  REORDER_TASKS_SUCCESS = "todos/REORDER_TASKS_SUCCESS",
  REORDER_TASKS_FAILURE = "todos/REORDER_TASKS_FAILURE",

  REORDER_TODOS_PENDING = "todos/REORDER_TODOS_PENDING",
  REORDER_TODOS_SUCCESS = "todos/REORDER_TODOS_SUCCESS",
  REORDER_TODOS_FAILURE = "todos/REORDER_TODOS_FAILURE",

  UPDATE_TASK_PENDING = "todos/UPDATE_TASK_PENDING",
  UPDATE_TASK_SUCCESS = "todos/UPDATE_TASK_SUCCESS",
  UPDATE_TASK_FAILURE = "todos/UPDATE_TASK_FAILURE",

  UPDATE_TODO_TITLE_PENDING = "todos/UPDATE_TODO_TITLE_PENDING",
  UPDATE_TODO_TITLE_SUCCESS = "todos/UPDATE_TODO_TITLE_SUCCESS",
  UPDATE_TODO_TITLE_FAILURE = "todos/UPDATE_TODO_TITLE_FAILURE",

  ADD_ALERT = "alerts/ADD_ALERT",
  REMOVE_ALERT = "alerts/REMOVE_ALERT",
}

export type SetLoadDelayAction = {
  type: actionTypes.SET_LOAD_DELAY;
  payload: DelaysType;
};

export type SetIsSessionStorageAction = {
  type: actionTypes.SET_IS_SESSION_STORAGE;
  payload: boolean;
};

export type SetSearchAction = {
  type: actionTypes.SET_SEARCH;
  payload: string;
};

export type ClearTodosAction = {
  type: actionTypes.CLEAR_TODOS;
};

export type AddAlertAction = {
  type: actionTypes.ADD_ALERT;
  payload: Alert;
};

export type RemoveAlertAction = {
  type: actionTypes.REMOVE_ALERT;
  payload: Alert["id"];
};

export type Action =
  | SetLoadDelayAction
  | SetIsSessionStorageAction
  | SetSearchAction
  | ClearTodosAction
  | CreateTaskPendingAction
  | CreateTaskSuccessAction
  | CreateTaskFailureAction
  | AddAlertAction
  | RemoveAlertAction
  | CreateTodoPendingAction
  | CreateTodoSuccessAction
  | CreateTodoFailureAction
  | LoadTodosPendingAction
  | LoadTodosSuccessAction
  | LoadTodosFailureAction
  | RemoveTaskPendingAction
  | RemoveTaskSuccessAction
  | RemoveTaskFailureAction
  | RemoveTodoPendingAction
  | RemoveTodoSuccessAction
  | RemoveTodoFailureAction
  | ReorderTasksPendingAction
  | ReorderTasksSuccessAction
  | ReorderTasksFailureAction
  | ReorderTodosPendingAction
  | ReorderTodosSuccessAction
  | ReorderTodosFailureAction
  | UpdateTaskPendingAction
  | UpdateTaskSuccessAction
  | UpdateTaskFailureAction
  | UpdateTodoTitlePendingAction
  | UpdateTodoTitleSuccessAction
  | UpdateTodoTitleFailureAction;

export default actionTypes;
