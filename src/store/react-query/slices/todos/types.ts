import { Todo } from "api/client";

import { DelaysType } from "constants/sessionStorage";

export interface Entities {
  [id: string]: Todo;
}

export interface ExtraInitialState {
  search: string;
  isSessionStorage: boolean;
  loadDelay: DelaysType;
}
