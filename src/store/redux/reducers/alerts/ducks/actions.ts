import type { Alert } from "./types";

import actionTypes from "./actionTypes";

export const addAlert = (alert: Alert) => ({
  type: actionTypes.ADD_ALERT,
  payload: alert,
});

export const removeAlert = (id: Alert["id"]) => ({
  type: actionTypes.REMOVE_ALERT,
  payload: id,
});
