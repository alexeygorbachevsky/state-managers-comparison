import type { TodosState } from "store/react-context";

import actionTypes, {
  Action,
  AddAlertAction,
  RemoveAlertAction,
  SetIsSessionStorageAction,
  SetLoadDelayAction,
  SetSearchAction,
} from "./actionTypes";
import {
  createTaskReducer,
  createTodoReducer,
  loadTodosReducer,
  removeTaskReducer,
  removeTodoReducer,
  reorderTasksReducer,
  reorderTodosReducer,
  updateTaskReducer,
  updateTodoTitleReducer,
} from "./thunks";

const handlers: Record<
  actionTypes,
  (state: TodosState, action: Action) => TodosState
> = {
  [actionTypes.SET_LOAD_DELAY]: (state, action) => ({
    ...state,
    loadDelay: (action as SetLoadDelayAction).payload,
  }),
  [actionTypes.SET_IS_SESSION_STORAGE]: (state, action) => ({
    ...state,
    isSessionStorage: (action as SetIsSessionStorageAction).payload,
  }),
  [actionTypes.SET_SEARCH]: (state, action) => ({
    ...state,
    search: (action as SetSearchAction).payload,
  }),
  [actionTypes.CLEAR_TODOS]: state => ({
    ...state,
    ids: [],
    entities: {},
    isLastBatch: false,
    cursor: "",
  }),

  // thunks handlers
  ...createTaskReducer,
  ...createTodoReducer,
  ...loadTodosReducer,
  ...removeTaskReducer,
  ...removeTodoReducer,
  ...reorderTasksReducer,
  ...reorderTodosReducer,
  ...updateTaskReducer,
  ...updateTodoTitleReducer,

  // alerts
  [actionTypes.ADD_ALERT]: (state, action) => ({
    ...state,
    alerts: [(action as AddAlertAction).payload, ...state.alerts],
  }),
  [actionTypes.REMOVE_ALERT]: (state, action) => ({
    ...state,
    alerts: state.alerts.filter(
      ({ id }) => id !== (action as RemoveAlertAction).payload,
    ),
  }),
};

const reducer = (state: TodosState, action: Action) => {
  if (Object.prototype.hasOwnProperty.call(handlers, action.type)) {
    return handlers[action.type](state, action);
  }

  return state;
};

export default reducer;
