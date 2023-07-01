import { useState } from "react";

import type { Todo } from "api/client";
import type { UseConnectReturn } from "../types";

import { reactContextHooks } from "hooks";

import { selectTasksByFilter } from "store/react-context/ducks/selectors";

import { TaskListFilter } from "constants/tasks";
import { STATUS } from "constants/status";

const { useContextSelector } = reactContextHooks;

const useReduxConnect = (todoId: Todo["id"]): UseConnectReturn => {
  const [filter, setFilter] = useState<TaskListFilter>(TaskListFilter.all);

  const isTodosLoading =
    useContextSelector(state => state.statuses.todosLoad) === STATUS.loading;

  const todo = useContextSelector(state => state.entities[todoId]);

  const tasks = selectTasksByFilter(todo, todoId, filter);

  const todosUpdateStatuses = useContextSelector(
    state => state.statuses.todosUpdate?.[todoId],
  );

  const isTodosReordering = useContextSelector(
    state => state.statuses.isTodosReordering,
  );

  const isTodoUpdating = Boolean(todosUpdateStatuses?.isTodoUpdating);

  const isTodoCreating = useContextSelector(
    state => state.statuses.isTodoCreating,
  );

  const isAnyTaskUpdating = Boolean(todosUpdateStatuses && !isTodoUpdating);

  const isDisabled =
    isTodoUpdating || isTodoCreating || isTodosReordering || isTodosLoading;

  return {
    filter,
    setFilter,
    tasks,
    isAnyTaskUpdating,
    isDisabled,
  };
};

export default useReduxConnect;
