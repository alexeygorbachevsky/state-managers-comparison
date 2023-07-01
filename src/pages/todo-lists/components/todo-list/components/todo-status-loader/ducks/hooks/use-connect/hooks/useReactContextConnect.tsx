import type { UseConnectReturn } from "../types";

import type { Todo } from "api/client";

import { reactContextHooks } from "hooks";

const { useContextSelector } = reactContextHooks;

const useReactContextConnect = (id: Todo["id"]): UseConnectReturn => {
  const search = useContextSelector(state => state.search);
  const todosUpdateStatuses = useContextSelector(
    state => state.statuses.todosUpdate,
  );
  const isTodosReordering = useContextSelector(
    state => state.statuses.isTodosReordering,
  );
  const isTodoCreating = useContextSelector(
    state => state.statuses.isTodoCreating,
  );

  const todoUpdateStatus = Boolean(todosUpdateStatuses[id]);
  const isAnyTodoUpdating = Boolean(Object.keys(todosUpdateStatuses).length);

  const isDisabled =
    Boolean(search) || isAnyTodoUpdating || isTodosReordering || isTodoCreating;

  return {
    isDisabled,
    todoUpdateStatus,
  };
};

export default useReactContextConnect;
