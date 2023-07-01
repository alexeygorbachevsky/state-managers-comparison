import type { UseConnectReturn } from "../types";

import { reactContextHooks } from "hooks";

import { thunks } from "store/react-context/ducks";

const { useContextSelector } = reactContextHooks;

const { removeAlert } = thunks;

const useReduxConnect = (): UseConnectReturn => {
  const alerts = useContextSelector(state => state.alerts);
  const dispatch = useContextSelector(state => state.dispatch);

  const onCloseAlert = (id: string) => {
    removeAlert({ dispatch, id });
  };

  return {
    alerts,
    onCloseAlert,
  };
};

export default useReduxConnect;
