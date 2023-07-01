import { KeyboardEvent, useState } from "react";

import type { UseConnectReturn } from "../types";

import { reduxHooks } from "hooks";

import { createTodo } from "store/redux/reducers/todos";

import { KEYS } from "constants/eventTarget";

const { useDispatch } = reduxHooks;

const useReduxConnect = (): UseConnectReturn => {
  const [value, setValue] = useState("");

  const dispatch = useDispatch();

  const onCreateTodo = () => {
    if (!value) {
      return;
    }

    dispatch(createTodo(value)).then(() => {
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
