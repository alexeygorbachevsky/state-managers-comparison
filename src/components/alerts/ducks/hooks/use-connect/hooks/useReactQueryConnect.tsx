import { rtkQueryHooks } from "hooks/store-hooks";

import { removeAlert } from "store/react-query/slices/alerts";

import { UseConnectReturn } from "../types";

const { useDispatch, useSelector } = rtkQueryHooks;

const useReactQueryConnect = (): UseConnectReturn => {
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

export default useReactQueryConnect;
