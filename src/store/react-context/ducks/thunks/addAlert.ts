import type { Alert, Store } from "store/react-context/types";

import actionTypes from "../actionTypes";

export const ALERT_DEFAULT_TIMEOUT = 5000;

const MAX_ALERTS_COUNT = 3;

interface AddAlertAction {
  dispatch: Store["dispatch"];
  alert: Alert;
}

export const addAlertAction = ({ dispatch, alert }: AddAlertAction) => {
  dispatch({
    type: actionTypes.ADD_ALERT,
    payload: alert,
  });
};

interface RemoveAlertAction {
  dispatch: Store["dispatch"];
  id: Alert["id"];
}

export const removeAlertAction = ({ dispatch, id }: RemoveAlertAction) => {
  dispatch({
    type: actionTypes.REMOVE_ALERT,
    payload: id,
  });
};

interface AddAlert {
  alerts: Store["alerts"];
  dispatch: Store["dispatch"];
  alert: Alert;
}

export const addAlert = ({ alerts, dispatch, alert }: AddAlert) => {
  if (alerts.length === MAX_ALERTS_COUNT) {
    removeAlertAction({ dispatch, id: alerts[alerts.length - 1].id });
  }

  addAlertAction({ dispatch, alert });

  if (alert.timeout) {
    setTimeout(() => {
      removeAlertAction({ dispatch, id: alert.id });
    }, alert.timeout);
  }
};
