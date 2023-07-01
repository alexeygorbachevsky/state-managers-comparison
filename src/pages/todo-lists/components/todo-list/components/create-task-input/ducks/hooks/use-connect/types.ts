import { KeyboardEvent } from "react";

import type { Task } from "api/client";

export interface UseConnectReturn {
  taskTitle: Task["title"];
  setTaskTitle: (title: Task["title"]) => void;
  isDisabled: boolean;
  onCreateTask: () => void;
  onCreateTaskKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
}
