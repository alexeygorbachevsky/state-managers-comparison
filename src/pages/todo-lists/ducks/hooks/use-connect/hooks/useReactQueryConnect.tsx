import { useMemo } from "react";
import { useInfiniteQuery, useIsMutating } from "@tanstack/react-query";

import type { UseConnectReturn } from "../types";

import { reactQueryHooks } from "hooks";

import { fetchTodos } from "api/client/todos/endpoints";
import { Todo } from "api/client";

const { useSelector } = reactQueryHooks;

const useReactQueryConnect = (): UseConnectReturn => {
  const { search, isSessionStorage, loadDelay } = useSelector(
    state => state.todos,
  );

  const { data, error, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["todos", { search }],
    queryFn: ({ pageParam }) =>
      fetchTodos(pageParam || { search, isSessionStorage, loadDelay }),
  });

  const isTodoCreating = useIsMutating({ mutationKey: ["createTodo"] }) > 0;

  const { todos, sortedTodoIds } = useMemo(() => {
    const todos: Todo[] =
      data?.pages.reduce((acc: Todo[], curr) => {
        curr.todos.forEach(todo => {
          acc.push(todo);
        });

        return acc;
      }, []) || [];

    return { todos, sortedTodoIds: todos.map(({ id }) => id) };
  }, [data?.pages]);

  return {
    isFailed: Boolean(error),
    todoIds: sortedTodoIds,
    isLoading: isFetching,
    onLoadTodos: () =>
      fetchNextPage({
        pageParam: {
          search,
          cursor: todos?.[todos.length - 1].id,
          isSessionStorage,
          loadDelay,
        },
      }),
    onTaskDragEnd: () => {},
    onShouldCancelStartDnD: () => true,
    onSortEnd: () => {},
    isTodoCreating,
    isLastBatch: Boolean(data?.pages[data.pages.length - 1].isLastBatch),
  };
};

export default useReactQueryConnect;
