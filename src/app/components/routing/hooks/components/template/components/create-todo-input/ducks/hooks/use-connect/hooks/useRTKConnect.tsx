import { KeyboardEvent, useState } from "react";

import type { UseConnectReturn } from "../types";

import { KEYS } from "constants/eventTarget";

import { rtkHooks } from "hooks";

import { createTodo } from "../../../../../../../../../../../../store/redux-toolkit/slices/todos";

const { useDispatch } = rtkHooks;

const useRTKConnect = (): UseConnectReturn => {
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

export default useRTKConnect;
