import type { ReduxThunk } from "../../../types";
import type { Alert } from "./types";

import {
  removeAlert as removeAlertAction,
  addAlert as addAlertAction,
} from "./actions";

const MAX_ALERTS_COUNT = 3;

export const addAlert =
  (alert: Alert): ReduxThunk =>
  (dispatch, getState) => {
    const alerts = getState().alerts;

    if (alerts.length === MAX_ALERTS_COUNT) {
      dispatch(removeAlertAction(alerts[alerts.length - 1].id));
    }

    dispatch(addAlertAction(alert));

    if (alert.timeout) {
      setTimeout(() => {
        dispatch(removeAlertAction(alert.id));
      }, alert.timeout);
    }
  };
