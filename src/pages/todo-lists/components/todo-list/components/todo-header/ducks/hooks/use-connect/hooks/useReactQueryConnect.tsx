import { useMemo } from "react";
import { useIsMutating, useMutation } from "@tanstack/react-query";
import { nanoid } from "@reduxjs/toolkit";

import type { QueryData, QueryPage } from "store/react-query/types";
import type { Entities } from "store/react-query/slices/todos/types";
import type { UseConnectReturn } from "../types";
import type { Todo } from "api/client";

import { store } from "store/react-query";
import {
  addAlertThunk,
  ALERT_DEFAULT_TIMEOUT,
  AlertTypes,
} from "store/redux-toolkit-query/slices/alerts";

import { removeTodo } from "api/client";

import { queryClient } from "app/components/routing/hooks/useProvider";

import { useDispatch, useSelector } from "hooks/store-hooks/react-query";

const useReactQueryConnect = (id: Todo["id"]): UseConnectReturn => {
  const search = useSelector(state => state.todos.search);
  const data: QueryData | undefined = queryClient.getQueryData([
    "todos",
    { search },
  ]);

  const dispatch = useDispatch();

  const entities = useMemo(
    () =>
      data?.pages.reduce((acc, curr) => {
        curr.todos.forEach(todo => {
          acc[todo.id] = todo;
        });

        return acc;
      }, {} as Entities) || {},
    [data?.pages],
  );

  const { mutate } = useMutation({
    mutationKey: ["removeTodo", id],
    mutationFn: removeTodo,
    onSuccess: data => {
      queryClient.setQueryData(["todos", { search }], prevData => {
        const typedPrevData = prevData as QueryData;

        const updatedPages: QueryPage[] = [];

        typedPrevData.pages.forEach(({ todos, isLastBatch }) => {
          const pagesItem = { todos: [], isLastBatch } as QueryPage;

          todos.forEach(todo => {
            if (data.id === todo.id) {
              return;
            }

            pagesItem.todos.push(todo);
          });

          updatedPages.push(pagesItem);
        });

        // queryClient.invalidateQueries({ queryKey: ['todos'] })

        dispatch(
          addAlertThunk({
            id: nanoid(),
            message: `Todo "${data.title}" is successfully removed`,
            type: AlertTypes.success,
            timeout: ALERT_DEFAULT_TIMEOUT,
          }),
        );

        return {
          ...typedPrevData,
          pages: updatedPages,
        };
      });
    },
    onError: () => {
      dispatch(
        addAlertThunk({
          id: nanoid(),
          message: "Error is occurred - unable to remove todo.",
          type: AlertTypes.error,
        }),
      );
    },
  });

  const isCreatingTodo = useIsMutating({ mutationKey: ["createTodo"] }) > 0;

  const isRemovingTodo = useIsMutating({ mutationKey: ["removeTodo", id] }) > 0;

  const title = entities[id].title;

  const onRemoveTodo = () => {
    // not useSelector, because we want to avoid unnecessary renders
    const { isSessionStorage, loadDelay } = store.getState().todos;

    mutate({ id, isSessionStorage, loadDelay });
  };

  return {
    title,
    isEditableTitleOpened: false,
    setIsEditableTitleOpened: () => {},
    isDisabled: Boolean(isRemovingTodo || isCreatingTodo),
    onRemoveTodo,
    onUpdateTodoTitle: () => {},
  };
};

export default useReactQueryConnect;
