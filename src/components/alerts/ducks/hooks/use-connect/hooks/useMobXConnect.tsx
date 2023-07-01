import type { UseConnectReturn } from "../types";

import { mobXHooks } from "hooks";

const { useMobXContext } = mobXHooks;

const useMobxConnect = (): UseConnectReturn => {
  const { alerts: alertStore } = useMobXContext();

  const onCloseAlert = (id: string) => {
    alertStore.removeAlert(id);
  };

  return {
    alerts: alertStore.alerts,
    onCloseAlert,
  };
};

export default useMobxConnect;
