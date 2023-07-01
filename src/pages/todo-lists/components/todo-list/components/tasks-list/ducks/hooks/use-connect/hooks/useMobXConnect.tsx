import { useState } from "react";

import type { Todo } from "api/client";
import type { UseConnectReturn } from "../types";

import { TaskListFilter } from "constants/tasks";
import { STATUS } from "constants/status";

import { mobXHooks } from "hooks";

const { useMobXContext } = mobXHooks;

const useMobxConnect = (todoId: Todo["id"]): UseConnectReturn => {
  const { todos } = useMobXContext();
  const { statuses } = todos;

  const [filter, setFilter] = useState<TaskListFilter>(TaskListFilter.all);

  const isTodosLoading = statuses.todosLoad === STATUS.loading;

  const tasks = todos.selectTasksByFilter(todoId, filter);

  const todosUpdateStatuses = statuses.todosUpdate?.[todoId];

  const isTodoUpdating = Boolean(todosUpdateStatuses?.isTodoUpdating);

  const isAnyTaskUpdating = Boolean(todosUpdateStatuses && !isTodoUpdating);

  const isDisabled =
    isTodoUpdating ||
    statuses.isTodoCreating ||
    statuses.isTodosReordering ||
    isTodosLoading;

  return {
    filter,
    setFilter,
    tasks,
    isAnyTaskUpdating,
    isDisabled,
  };
};

export default useMobxConnect;
