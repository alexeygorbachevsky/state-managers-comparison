import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {createAppAsyncThunk} from "../../types";

const MAX_ALERTS_COUNT = 3;

export const ALERT_DEFAULT_TIMEOUT = 5000;

export enum AlertTypes {
  success = "success",
  error = "error",
}

interface Alert {
  id: string;
  type: AlertTypes;
  message: string;
  timeout?: number;
}

const initialState: Alert[] = [];

export const alertsSlice = createSlice({
  name: "alerts",
  initialState,
  reducers: {
    addAlert(state, action: PayloadAction<Alert>) {
      state.unshift(action.payload);
    },
    removeAlert(state, action: PayloadAction<Alert["id"]>) {
      return state.filter(({ id }) => id !== action.payload);
    },
  },
});

export const { addAlert, removeAlert } = alertsSlice.actions;

export const addAlertThunk = createAppAsyncThunk<void, Alert>(
  "alerts/addAlertThunk",
  (alert, { dispatch, getState }) => {
    const alerts = getState().alerts;

    if (alerts.length === MAX_ALERTS_COUNT) {
      dispatch(removeAlert(alerts[alerts.length - 1].id));
    }

    dispatch(addAlert(alert));

    if (alert.timeout) {
      setTimeout(() => {
        dispatch(removeAlert(alert.id));
      }, alert.timeout);
    }
  },
);

export default alertsSlice.reducer;
