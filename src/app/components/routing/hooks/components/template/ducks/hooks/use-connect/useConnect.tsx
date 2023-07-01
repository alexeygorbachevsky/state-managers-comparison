import {
  STATE_AND_QUERY_MANAGERS_TYPE,
  STATE_MANAGERS,
  QUERY_MANAGERS,
  CONTEXT,
} from "constants/state-managers";

import {
  useRTKConnect,
  useReduxConnect,
  useMobXConnect,
  useReactContextConnect,
  useRTKQueryConnect,
  useReduxSagaConnect,
  useReactQueryConnect
} from "./hooks";

const useConnect = (stateManager: STATE_AND_QUERY_MANAGERS_TYPE) => {
  switch (stateManager) {
    case STATE_MANAGERS.reduxToolkit: {
      return useRTKConnect();
    }
    case STATE_MANAGERS.redux: {
      return useReduxConnect();
    }

    case STATE_MANAGERS.mobX: {
      return useMobXConnect();
    }

    case STATE_MANAGERS.reduxSaga: {
      return useReduxSagaConnect();
    }

    case CONTEXT.reactContext: {
      return useReactContextConnect();
    }

    case QUERY_MANAGERS.reduxToolkitQuery: {
      return useRTKQueryConnect();
    }

    case QUERY_MANAGERS.reactQuery: {
      return useReactQueryConnect();
    }

    default: {
      return {
        isDisabled: false,
        isTodosReordering: false,
        isCreatingTodo: false,
        onSearchChange: () => {},
      };
    }
  }
};

export default useConnect;
