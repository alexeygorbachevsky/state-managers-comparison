import { makeAutoObservable } from "mobx";

import type { Alert } from "./types";
import type { RootStoreType } from "../../rootStore";

export const ALERT_DEFAULT_TIMEOUT = 5000;

const MAX_ALERTS_COUNT = 3;

class AlertsStore {
  rootStore: RootStoreType;

  alerts: Alert[] = [];

  constructor(rootStore: RootStoreType) {
    this.rootStore = rootStore;
    makeAutoObservable(this, { rootStore: false });
  }

  addAlert(alert: Alert) {
    if (this.alerts.length === MAX_ALERTS_COUNT) {
      this.removeAlert(this.alerts[this.alerts.length - 1].id);
    }

    this.alerts.unshift(alert);

    if (alert.timeout) {
      setTimeout(() => {
        this.removeAlert(alert.id);
      }, alert.timeout);
    }
  }

  removeAlert(id: Alert["id"]) {
    this.alerts = this.alerts.filter(alert => alert.id !== id);
  }
}

export default AlertsStore;
