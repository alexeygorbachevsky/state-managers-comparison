import { KeyboardEvent } from "react";

export interface UseConnectReturn {
  value: string;
  setValue: (value: string) => void;
  onCreateTodo: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
}
