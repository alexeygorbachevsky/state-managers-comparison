import type { UseConnectReturn } from "../types";

import type { Todo } from "api/client";

import { mobXHooks } from "hooks";

const { useMobXContext } = mobXHooks;

const useMobxConnect = (id: Todo["id"]): UseConnectReturn => {
  const { todos } = useMobXContext();

  const { search, statuses } = todos;

  const todosUpdateStatuses = statuses.todosUpdate;

  const todoUpdateStatus = Boolean(todosUpdateStatuses[id]);
  const isAnyTodoUpdating = Boolean(Object.keys(todosUpdateStatuses).length);

  const isDisabled =
    Boolean(search) ||
    isAnyTodoUpdating ||
    statuses.isTodosReordering ||
    statuses.isTodoCreating;

  return {
    isDisabled,
    todoUpdateStatus,
  };
};

export default useMobxConnect;
