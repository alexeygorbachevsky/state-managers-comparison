import type { UseConnectReturn } from "../types";

import { rtkQueryHooks } from "hooks";

import { createTodoApi, loadTodosApi } from "store/redux-toolkit-query/api";

const { useSelector } = rtkQueryHooks;
const { useLoadTodosQuery } = loadTodosApi;

const useRTKConnect = (): UseConnectReturn => {
  const search = useSelector(state => state.todos.search);
  const { currentData, isFetching, error } = useLoadTodosQuery(search);
  const [, { isLoading: isTodoCreating }] = createTodoApi.useCreateTodoMutation(
    {
      fixedCacheKey: "createTodo",
    },
  );

  return {
    isFailed: Boolean(error),
    todoIds: currentData?.ids || [],
    isLoading: isFetching,
    onLoadTodos: () => {},
    onTaskDragEnd: () => {},
    onShouldCancelStartDnD: () => true,
    onSortEnd: () => {},
    isTodoCreating,
    isLastBatch: true,
  };
};

export default useRTKConnect;
