import { FC, PropsWithChildren, useState } from "react";
import { Provider as ReactReduxProvider } from "react-redux";
import { DoNotDisturbAlt as DoNotDisturbAltIcon } from "@mui/icons-material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import {
  mobxStore,
  MobxStoreContext,
  reduxSagaStore,
  reduxStore,
  rtkQueryStore,
  rtkStore,
  reactQueryStore,
} from "store";

import TodoListsPage from "pages/todo-lists";

import {
  CONTEXT,
  QUERY_MANAGERS,
  STATE_AND_QUERY_MANAGERS_TYPE,
  STATE_MANAGERS,
} from "constants/state-managers";

import { useProviderSelectors } from "./ducks";
import { ReactContextProvider, Template } from "./components";

import styles from "./useProvider.module.scss";

const { getDefaultStateManager } = useProviderSelectors;

const { notImplementedWrapper, text } = styles;

const reduxStores = {
  [STATE_MANAGERS.reduxToolkit]: rtkStore,
  [STATE_MANAGERS.redux]: reduxStore.getStore(),
  [STATE_MANAGERS.reduxSaga]: reduxSagaStore,
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const useProvider = () => {
  const [stateManager, setStateManager] =
    useState<STATE_AND_QUERY_MANAGERS_TYPE>(getDefaultStateManager);

  let StoreProvider: FC<PropsWithChildren>;
  let todoListsPage: JSX.Element = <TodoListsPage />;
  let isStateManagerSupported = true;
  // let todoListsPage2: JSX.Element | null = null;

  switch (stateManager) {
    case STATE_MANAGERS.reduxToolkit:
    case STATE_MANAGERS.redux:
    case STATE_MANAGERS.reduxSaga: {
      StoreProvider = function StoreProvider({ children }) {
        return (
          <ReactReduxProvider store={reduxStores[stateManager]}>
            {children}
          </ReactReduxProvider>
        );
      };
      break;
    }

    case QUERY_MANAGERS.reduxToolkitQuery: {
      StoreProvider = function StoreProvider({ children }) {
        return (
          <ReactReduxProvider store={rtkQueryStore}>
            {children}
          </ReactReduxProvider>
        );
      };
      // todoListsPage2 = <RTKQueryTodoListsPage2 />;
      break;
    }

    case QUERY_MANAGERS.reactQuery: {
      StoreProvider = function StoreProvider({ children }) {
        return (
          <ReactReduxProvider store={reactQueryStore}>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </ReactReduxProvider>
        );
      };
      // todoListsPage2 = <RTKQueryTodoListsPage2 />;
      break;
    }

    case STATE_MANAGERS.mobX: {
      StoreProvider = function StoreProvider({ children }) {
        return (
          <MobxStoreContext.Provider value={mobxStore}>
            {children}
          </MobxStoreContext.Provider>
        );
      };
      break;
    }

    case CONTEXT.reactContext: {
      StoreProvider = ReactContextProvider;
      break;
    }

    default: {
      isStateManagerSupported = false;
      StoreProvider = function StoreProvider({ children }) {
        return <div>{children}</div>;
      };
      todoListsPage = (
        <div className={notImplementedWrapper}>
          <DoNotDisturbAltIcon sx={{ height: "64px", width: "64px" }} />
          <div className={text}>{stateManager} is not implemented yet</div>
        </div>
      );
    }
  }

  return {
    stateManager,
    StoreProvider,
    todoListsPage,
    // todoListsPage2,
    template: (
      <Template
        isStateManagerSupported={isStateManagerSupported}
        stateManager={stateManager}
        onChangeStateManager={setStateManager}
      />
    ),
  };
};

export default useProvider;
