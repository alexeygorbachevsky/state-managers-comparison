import { nanoid } from "@reduxjs/toolkit";
import { useMutation } from "@tanstack/react-query";
import { KeyboardEvent, useState } from "react";

import type { QueryData } from "store/react-query/types";
import type { UseConnectReturn } from "../types";

import { KEYS } from "constants/eventTarget";

import { createTodo } from "api/client/todos/endpoints";

import { store } from "store/react-query";
import {
  addAlertThunk,
  ALERT_DEFAULT_TIMEOUT,
  AlertTypes,
} from "store/redux-toolkit-query/slices/alerts";

import { useDispatch, useSelector } from "hooks/store-hooks/react-query";

import { queryClient } from "../../../../../../../../useProvider";

const useReactQueryConnect = (): UseConnectReturn => {
  const [value, setValue] = useState("");
  const search = useSelector(state => state.todos.search);
  const dispatch = useDispatch();

  const { mutate } = useMutation({
    mutationKey: ["createTodo"],
    mutationFn: createTodo,
    onSuccess: data => {
      queryClient.setQueryData(["todos", { search }], prevData => {
        if (!prevData) {
          return;
        }
        const typedPrevData = prevData as QueryData;

        const { todos, isLastBatch } = typedPrevData.pages[0];

        const updatedFirstPage = {
          todos: [data, ...todos],
          isLastBatch,
        };

        setValue("");
        // queryClient.invalidateQueries({ queryKey: ['todos'] })

        dispatch(
          addAlertThunk({
            id: nanoid(),
            message: `Todo "${data.title}" is successfully created`,
            type: AlertTypes.success,
            timeout: ALERT_DEFAULT_TIMEOUT,
          }),
        );

        return {
          ...typedPrevData,
          pages: [updatedFirstPage, ...typedPrevData.pages.slice(1)],
        };
      });
    },
    onError: () => {
      dispatch(
        addAlertThunk({
          id: nanoid(),
          message: "Error is occurred - unable to create todo.",
          type: AlertTypes.error,
        }),
      );
    },
  });

  const onCreateTodo = () => {
    if (!value) {
      return;
    }

    // not useSelector, because we want to avoid unnecessary renders
    const { isSessionStorage, loadDelay } = store.getState().todos;

    mutate({ title: value, isSessionStorage, loadDelay });
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

export default useReactQueryConnect;
