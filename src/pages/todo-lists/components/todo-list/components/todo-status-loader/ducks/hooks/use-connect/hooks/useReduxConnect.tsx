import type { UseConnectReturn } from "../types";

import type { Todo } from "api/client";

import { reduxHooks } from "hooks";

const { useSelector } = reduxHooks;

const useReduxConnect = (id: Todo["id"]): UseConnectReturn => {
  const search = useSelector(state => state.todos.search);
  const todosUpdateStatuses = useSelector(
    state => state.todos.statuses.todosUpdate,
  );
  const isTodosReordering = useSelector(
    state => state.todos.statuses.isTodosReordering,
  );
  const isTodoCreating = useSelector(
    state => state.todos.statuses.isTodoCreating,
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

export default useReduxConnect;
