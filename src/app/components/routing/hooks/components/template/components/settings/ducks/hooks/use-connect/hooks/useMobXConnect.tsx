import { ChangeEvent } from "react";
import { SelectChangeEvent } from "@mui/material";

import type { UseConnectReturn } from "../types";

import { DELAYS } from "constants/sessionStorage";

import { mobXHooks } from "hooks";

const { useMobXContext } = mobXHooks;

const useMobxConnect = (): UseConnectReturn => {
  const { todos } = useMobXContext();

  const { isSessionStorage, loadDelay } = todos;

  const onSwitchChange = (
    event: ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    todos.setIsSessionStorage(checked);
  };

  const onDelayChange = (event: SelectChangeEvent) => {
    todos.setLoadDelay(DELAYS[Number(event.target.value)]);
  };

  return {
    isSessionStorage,
    loadDelay,
    onSwitchChange,
    onDelayChange,
  };
};

export default useMobxConnect;
