import { rtkQueryHooks } from "hooks/store-hooks";

import { removeAlert } from "store/redux-toolkit-query/slices/alerts";

import { UseConnectReturn } from "../types";

const { useDispatch, useSelector } = rtkQueryHooks;

const useRTKQueryConnect = (): UseConnectReturn => {
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

export default useRTKQueryConnect;
