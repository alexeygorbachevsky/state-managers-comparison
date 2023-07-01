import { KeyboardEvent, useEffect, useState } from "react";

import type { UseConnectReturn } from "../types";

import { KEYS } from "constants/eventTarget";

import { reduxSagaHooks } from "hooks";

import { todosSlice } from "store/redux-saga/slices/todos";

const { createTodoPending } = todosSlice.actions;
const { useDispatch, useSelector } = reduxSagaHooks;

const useReduxSagaConnect = (): UseConnectReturn => {
  const [value, setValue] = useState("");
  const isTodoCreating = useSelector(
    state => state.todos.statuses.isTodoCreating,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isTodoCreating) {
      setValue("");
    }
  }, [isTodoCreating]);

  const onCreateTodo = () => {
    if (!value) {
      return;
    }

    dispatch(createTodoPending(value));
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

export default useReduxSagaConnect;
