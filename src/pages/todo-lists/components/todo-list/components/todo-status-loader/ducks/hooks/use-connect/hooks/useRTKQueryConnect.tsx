import type { UseConnectReturn } from "../types";

import type { Todo } from "api/client";

import { createTodoApi } from "store/redux-toolkit-query/api";

const useRTKQueryConnect = (id: Todo["id"]): UseConnectReturn => {
  const [, { isLoading: isRemovingTodo }] = createTodoApi.useCreateTodoMutation(
    {
      fixedCacheKey: `removeTodo=${id}`,
    },
  );

  return {
    isDisabled: isRemovingTodo,
    todoUpdateStatus: isRemovingTodo,
  };
};

export default useRTKQueryConnect;
