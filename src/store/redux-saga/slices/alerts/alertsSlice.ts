import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { put, select } from "redux-saga/effects";

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

const delay = (timeout: number) =>
  new Promise(res => {
    setTimeout(() => res(null), timeout);
  });

export function* addAlertSaga(alert: Alert) {
  const alerts: Alert[] = yield select(state => state.alerts);

  if (alerts.length === MAX_ALERTS_COUNT) {
    yield put(removeAlert(alerts[alerts.length - 1].id));
  }

  yield put(addAlert(alert));

  if (alert.timeout) {
    yield delay(alert.timeout);
    yield put(removeAlert(alert.id));
  }
}

export default alertsSlice.reducer;
