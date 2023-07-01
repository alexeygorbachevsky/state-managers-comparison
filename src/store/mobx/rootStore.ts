import { createContext } from "react";
import { configure } from "mobx";

import { TodosStore, AlertsStore } from "./stores";

class RootStore {
  alerts: AlertsStore;
  todos: TodosStore;

  constructor() {
    this.alerts = new AlertsStore(this);
    this.todos = new TodosStore(this);
  }

  static configure() {
    if (process.env.NODE_ENV !== "production") {
      configure({
        enforceActions: "always",
        computedRequiresReaction: true,
        reactionRequiresObservable: true,
        // observableRequiresReaction: true,
        disableErrorBoundaries: true,
      });
    }
  }
}

// RootStore.configure();

const rootStore = new RootStore();

export type RootStoreType = RootStore;

export const RootStoreContext = createContext(rootStore);

export default rootStore;
