import { ChangeEvent, MouseEvent } from "react";

import type { Task } from "api/client";

export interface UseConnectReturn {
  isCheckedStatus: boolean;
  isEditableTitleOpened: boolean;
  tasks: Task[];
  isAnyTaskUpdating: boolean;
  onTaskClick: (e: MouseEvent<HTMLElement>) => void;
  onRemoveTask: () => void;
  onChangeEditableTitle: (value: string) => void;
  onChangeTaskStatus: (
    _: ChangeEvent<HTMLInputElement>,
    isChecked: Task["isChecked"],
  ) => void;
  isDisabled: boolean;
  setIsEditableTitleOpened: (arg: boolean) => void;
}
