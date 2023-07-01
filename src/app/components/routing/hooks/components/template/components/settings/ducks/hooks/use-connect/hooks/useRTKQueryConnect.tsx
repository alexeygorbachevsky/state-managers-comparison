import { ChangeEvent } from "react";
import { SelectChangeEvent } from "@mui/material";

import type { UseConnectReturn } from "../types";

import { rtkQueryHooks } from "hooks/store-hooks";

import {
  setIsSessionStorage,
  setLoadDelay,
} from "store/redux-toolkit-query/slices/todos";

import { DELAYS } from "constants/sessionStorage";

const { useDispatch, useSelector } = rtkQueryHooks;

const useRTKQueryConnect = (): UseConnectReturn => {
  const isSessionStorage = useSelector(state => state.todos.isSessionStorage);
  const loadDelay = useSelector(state => state.todos.loadDelay);

  const dispatch = useDispatch();

  const onSwitchChange = (
    event: ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    dispatch(setIsSessionStorage(checked));
  };

  const onDelayChange = (event: SelectChangeEvent) => {
    dispatch(setLoadDelay(DELAYS[Number(event.target.value)]));
  };

  return {
    isSessionStorage,
    loadDelay,
    onSwitchChange,
    onDelayChange,
  };
};

export default useRTKQueryConnect;
