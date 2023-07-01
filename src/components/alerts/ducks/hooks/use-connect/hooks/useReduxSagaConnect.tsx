import type { UseConnectReturn } from "../types";

import { rtkHooks } from "hooks";

import { removeAlert } from "store/redux-toolkit/slices/alerts";

const { useDispatch, useSelector } = rtkHooks;

const useReduxSagaConnect = (): UseConnectReturn => {
  const alerts = useSelector(state => state.alerts);
  const dispatch = useDispatch();

  const onCloseAlert = (id: string) => {
    dispatch(removeAlert(id));
  };

  return {
    alerts,
    onCloseAlert,
  };
};

export default useReduxSagaConnect;
