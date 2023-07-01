import { useMemo, useState } from "react";

import type { UseConnectReturn } from "../types";
import type { Todo } from "api/client";

import { reduxSagaHooks } from "hooks";

import { todosSelectors } from "store/redux-saga/slices/todos/ducks";

import { TaskListFilter } from "constants/tasks";
import { STATUS } from "constants/status";

const { makeSelectTasksByFilter } = todosSelectors;

const { useSelector } = reduxSagaHooks;

const useReduxSagaConnect = (todoId: Todo["id"]): UseConnectReturn => {
  const [filter, setFilter] = useState<TaskListFilter>(TaskListFilter.all);
  const selectTasksByFilter = useMemo(makeSelectTasksByFilter, []);

  const tasks = useSelector(state =>
    selectTasksByFilter(state, todoId, filter),
  );

  const isTodosLoading =
    useSelector(state => state.todos.statuses.todosLoad) === STATUS.loading;

  const todosUpdateStatuses = useSelector(
    state => state.todos.statuses.todosUpdate?.[todoId],
  );

  const isTodosReordering = useSelector(
    state => state.todos.statuses.isTodosReordering,
  );

  const isTodoUpdating = Boolean(todosUpdateStatuses?.isTodoUpdating);

  const isTodoCreating = useSelector(
    state => state.todos.statuses.isTodoCreating,
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

export default useReduxSagaConnect;
