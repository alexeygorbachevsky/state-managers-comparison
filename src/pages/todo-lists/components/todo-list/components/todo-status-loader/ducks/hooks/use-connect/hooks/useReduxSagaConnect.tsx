import type { UseConnectReturn } from "../types";

import type { Todo } from "api/client";

import { reduxSagaHooks } from "hooks";

const { useSelector } = reduxSagaHooks;

const useReduxSagaConnect = (id: Todo["id"]): UseConnectReturn => {
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

export default useReduxSagaConnect;
