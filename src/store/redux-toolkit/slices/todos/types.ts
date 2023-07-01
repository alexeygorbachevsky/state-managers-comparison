import { Task, Todo } from "api/client";

import { DelaysType } from "constants/sessionStorage";
import { STATUS } from "constants/status";

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

export interface ExtraInitialState {
  prevDragIds: Todo["id"][];
  prevDragTasks: PrevDragTasks;
  cursor: Todo["id"] | null;
  search: string;
  isSessionStorage: boolean;
  loadDelay: DelaysType;
  isLastBatch: boolean;
  statuses: TodosStatuses;
}
