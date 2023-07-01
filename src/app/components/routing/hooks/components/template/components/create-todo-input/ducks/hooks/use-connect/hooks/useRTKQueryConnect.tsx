import { KeyboardEvent, useState } from "react";

import type { UseConnectReturn } from "../types";

import { KEYS } from "constants/eventTarget";

import { createTodoApi } from "store/redux-toolkit-query/api";

const useConnect = (): UseConnectReturn => {
  const [value, setValue] = useState("");

  const [createTodo] = createTodoApi.useCreateTodoMutation({
    fixedCacheKey: "createTodo",
  });

  const onCreateTodo = () => {
    if (!value) {
      return;
    }

    createTodo(value).then(() => {
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

export default useConnect;
