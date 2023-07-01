import {
  getIsTodosSessionStorage,
  getLoadDelay,
} from "selectors/sessionStorage";

import { STATUS } from "constants/status";

import { Store } from "./types";
import { createContext } from "./helpers";

export const initialStore: Store = {
  ids: [],
  entities: {},
  prevDragIds: [],
  prevDragTasks: {},
  cursor: "",
  search: "",
  isLastBatch: false,
  isSessionStorage: getIsTodosSessionStorage(),
  loadDelay: getLoadDelay(),
  statuses: {
    todosLoad: STATUS.loading,
    todosUpdate: {},
    isTodoCreating: false,
    isTodosReordering: false,
  },
  alerts: [],

  dispatch: () => {},
};

export const ReactContext = createContext<Store>(initialStore);
