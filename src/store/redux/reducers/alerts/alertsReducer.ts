import type { PayloadAction } from "../../types";
import type { Alert } from "./ducks";

import { createReducer } from "../../ducks";
import { alertsActionTypes } from "./ducks";

const { ADD_ALERT, REMOVE_ALERT } = alertsActionTypes;

const initialState: Alert[] = [];

const alertsReducer = createReducer<Alert[]>(initialState, {
  [ADD_ALERT]: (state, action: PayloadAction<Alert>) => [
    action.payload,
    ...state,
  ],
  [REMOVE_ALERT]: (state, action: PayloadAction<Alert["id"]>) =>
    state.filter(({ id }) => id !== action.payload),
});

export default alertsReducer;
