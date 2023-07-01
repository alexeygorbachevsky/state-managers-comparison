import { KeyboardEvent, useState } from "react";

import type { UseConnectReturn } from "../types";

import { reactContextHooks } from "hooks";

import { thunks } from "store/react-context/ducks";

import { KEYS } from "constants/eventTarget";

const { useContextSelector } = reactContextHooks;
const { createTodo } = thunks;

const useReduxConnect = (): UseConnectReturn => {
  const [value, setValue] = useState("");

  const dispatch = useContextSelector(state => state.dispatch);
  const isSessionStorage = useContextSelector(state => state.isSessionStorage);
  const loadDelay = useContextSelector(state => state.loadDelay);
  const alerts = useContextSelector(state => state.alerts);

  const onCreateTodo = () => {
    if (!value) {
      return;
    }

    createTodo({
      title: value,
      dispatch,
      isSessionStorage,
      loadDelay,
      alerts,
    }).then(() => {
      setValue("");
    });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === KEYS.enter) {
      onCreateTodo();
    }
  };

  return {
    value,
    setValue,
    onCreateTodo,
    onKeyDown,
  };
};

export default useReduxConnect;
