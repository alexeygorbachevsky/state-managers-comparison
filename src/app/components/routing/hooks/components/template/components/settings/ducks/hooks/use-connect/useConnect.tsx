import type { UseConnectReturn } from "./types";

import {
  STATE_MANAGERS,
  QUERY_MANAGERS,
  STATE_AND_QUERY_MANAGERS_TYPE,
  CONTEXT,
} from "constants/state-managers";

import { useStateManagersContext } from "hooks";

import {
  useRTKConnect,
  useReduxConnect,
  useMobXConnect,
  useReactContextConnect,
  useRTKQueryConnect,
  useReduxSagaConnect,
  useReactQueryConnect
} from "./hooks";

const STATE_MANAGERS_MAP: Record<
  STATE_AND_QUERY_MANAGERS_TYPE,
  () => UseConnectReturn
> = {
  [STATE_MANAGERS.reduxToolkit]: useRTKConnect,
  [STATE_MANAGERS.redux]: useReduxConnect,
  [STATE_MANAGERS.reduxSaga]: useReduxSagaConnect,
  [STATE_MANAGERS.mobX]: useMobXConnect,
  [CONTEXT.reactContext]: useReactContextConnect,
  [QUERY_MANAGERS.reduxToolkitQuery]: useRTKQueryConnect,
  [QUERY_MANAGERS.reactQuery]: useReactQueryConnect,
};

const useConnect = () => STATE_MANAGERS_MAP[useStateManagersContext()]!();

export default useConnect;
