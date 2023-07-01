import thunkMiddleware from "redux-thunk";

import {
  createStore,
  combineReducers,
  applyMiddleware,
  compose,
  ReducersMapObject,
  Store,
  StoreEnhancer,
  StateFromReducersMapObject,
  AnyAction,
  Dispatch,
} from "redux";

import { todosReducer, alertsReducer } from "./reducers";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: (
      a: unknown,
    ) => ReturnType<typeof compose>;
  }
}

const initialReducersBundle = {
  todos: todosReducer,
  alerts: alertsReducer,
};

type ReducersBundleType = typeof initialReducersBundle;

type StoreType = Store<StateFromReducersMapObject<ReducersBundleType>>;

const store = new (class {
  reducers: ReducersMapObject = {};

  reduxStore: StoreType = {} as StoreType;

  get isStoreInitiated() {
    return Boolean(Object.keys(this.reduxStore).length)
  }

  getStore = () => {
    if (!this.isStoreInitiated) {
      this.addReducers({});
    }

    return this.reduxStore;
  };

  getState = () => this.getStore()!.getState();

  dispatch: Dispatch = (action: AnyAction) => this.getStore().dispatch(action);

  watch = (
    selector: (a: unknown) => unknown,
    handler: (
      nextState: unknown,
      prevState: unknown,
      reduxStore: unknown,
      unsubscribe: unknown,
    ) => unknown,
    {
      isInstantCall = false,
      isEqual = (a: unknown, b: unknown) => a === b,
      isCallOnce = false,
    } = {},
  ) => {
    console.assert(
      !(isInstantCall && isCallOnce),
      "By setting both parameters isInstantCall = true and isCallOnce = true the call will be equivalent to a simple function call.",
    );

    let state = selector(this.reduxStore.getState());
    let unsubscribe = () => {};
    const changeStoreHandler = (isCompare = true) => {
      const nextState = selector(this.reduxStore.getState());
      if (!isCompare || !isEqual(state, nextState)) {
        const prevState = state;

        state = nextState;

        if (isCallOnce) {
          unsubscribe();
        }

        handler(nextState, prevState, this.reduxStore, unsubscribe);
      }
    };

    unsubscribe = this.reduxStore.subscribe(changeStoreHandler);

    if (isInstantCall) {
      changeStoreHandler(false);
    }

    return unsubscribe;
  };

  addReducers = (
    // eslint-disable-next-line
    reducerBundle: ReducersMapObject<any, any>,
    watchers: (() => void)[] = [],
  ) => {
    if (!this.isStoreInitiated) {
      const composeEnhancers =
        (process.env.NODE_ENV !== "production" &&
          typeof window !== "undefined" &&
          window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
          window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            name: `sdex-redux`,
          })) ||
        compose;

      this.reduxStore = createStore(
        combineReducers(reducerBundle),
        {},
        composeEnhancers(applyMiddleware(thunkMiddleware)) as StoreEnhancer,
      );

      this.reducers = { ...reducerBundle };
    } else {
      Object.keys(reducerBundle).forEach(name => {
        if (!this.reducers[name]) {
          this.reducers[name] = reducerBundle[name];
        }
      });

      this.reduxStore.replaceReducer(combineReducers(this.reducers));
    }

    watchers.forEach(watcher => watcher());
  };
})();

store.addReducers(initialReducersBundle);

export default store;
