import type { Task } from "api/client";

import { TaskListFilter } from "constants/tasks";

export interface UseConnectReturn {
  filter: TaskListFilter;
  setFilter: (filter: TaskListFilter) => void;
  tasks: Task[];
  isAnyTaskUpdating: boolean;
  isDisabled: boolean;
}
