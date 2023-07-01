import type { UseConnectReturn } from "../types";

import { reduxHooks } from "hooks";

import { alertsActions } from "store/redux/reducers/alerts/ducks";

const { useDispatch, useSelector } = reduxHooks;

const { removeAlert } = alertsActions;

const useReduxConnect = (): UseConnectReturn => {
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

export default useReduxConnect;
