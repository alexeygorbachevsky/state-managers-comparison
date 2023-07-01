import { Dispatch } from "react";

import { Task, Todo } from "api/client";

import { DelaysType } from "constants/sessionStorage";
import { STATUS } from "constants/status";

import { Action } from "./ducks/actionTypes";

export interface UpdateTasksStatuses {
  [key: Task["id"]]: boolean | undefined;
}

export interface TodoUpdateStatus {
  isTodoUpdating?: boolean;
}

interface UpdateTodoStatuses {
  [key: Todo["id"]]: (UpdateTasksStatuses & TodoUpdateStatus) | undefined;
}

interface TodosStatuses {
  todosLoad: STATUS;
  isTodoCreating: boolean;
  todosUpdate: UpdateTodoStatuses;
  isTodosReordering: boolean;
}

interface PrevDragTasks {
  [key: Todo["id"]]: Task[];
}

export interface Entities {
  [id: string]: Todo;
}

export enum AlertTypes {
  success = "success",
  error = "error",
}

export interface Alert {
  id: string;
  type: AlertTypes;
  message: string;
  timeout?: number;
}

export interface TodosState {
  ids: Todo["id"][];
  entities: Entities;
  prevDragIds: Todo["id"][];
  prevDragTasks: PrevDragTasks;
  cursor: Todo["id"] | null;
  search: string;
  isSessionStorage: boolean;
  loadDelay: DelaysType;
  isLastBatch: boolean;
  statuses: TodosStatuses;
  alerts: Alert[];
}

export type Store = TodosState & { dispatch: Dispatch<Action> };

export interface ReactContextApi {
  dispatch: Dispatch<Action>;
  state: TodosState;
}
