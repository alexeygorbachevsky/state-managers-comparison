import type { Todo } from "api/client";

export interface UseConnectReturn {
  title: Todo["title"];
  isEditableTitleOpened: boolean;
  setIsEditableTitleOpened: (arg: boolean) => void;
  isDisabled: boolean;
  onRemoveTodo: () => void;
  onUpdateTodoTitle: (value: string) => void;
}
