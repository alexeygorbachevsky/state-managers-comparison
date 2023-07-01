import { ChangeEvent } from "react";
import { SelectChangeEvent } from "@mui/material";

import type { UseConnectReturn } from "../types";

import { reactContextHooks } from "hooks";

import { thunks } from "store/react-context/ducks";

import { DELAYS } from "constants/sessionStorage";

const { useContextSelector } = reactContextHooks;
const { setIsSessionStorage, setLoadDelay } = thunks;

const useReactContextConnect = (): UseConnectReturn => {
  const isSessionStorage = useContextSelector(state => state.isSessionStorage);
  const loadDelay = useContextSelector(state => state.loadDelay);
  const dispatch = useContextSelector(state => state.dispatch);

  const onSwitchChange = (
    event: ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    setIsSessionStorage({ dispatch, isSessionStorage: checked });
  };

  const onDelayChange = (event: SelectChangeEvent) => {
    setLoadDelay({ dispatch, loadDelay: DELAYS[Number(event.target.value)] });
  };

  return {
    isSessionStorage,
    loadDelay,
    onSwitchChange,
    onDelayChange,
  };
};

export default useReactContextConnect;
