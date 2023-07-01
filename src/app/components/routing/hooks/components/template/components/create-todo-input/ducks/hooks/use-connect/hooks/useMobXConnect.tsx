import { KeyboardEvent, useState } from "react";

import type { UseConnectReturn } from "../types";

import { KEYS } from "constants/eventTarget";

import { mobXHooks } from "hooks";

const { useMobXContext } = mobXHooks;

const useMobXConnect = (): UseConnectReturn => {
  const { todos } = useMobXContext();

  const [value, setValue] = useState("");

  const onCreateTodo = () => {
    if (!value) {
      return;
    }

    todos.createTodo(value).then(() => {
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

export default useMobXConnect;
