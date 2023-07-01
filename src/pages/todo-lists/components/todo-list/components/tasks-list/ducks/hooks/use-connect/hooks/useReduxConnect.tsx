import { useMemo, useState } from "react";

import type { Todo } from "api/client";
import type { UseConnectReturn } from "../types";

import { reduxHooks } from "hooks";

import { TaskListFilter } from "constants/tasks";
import { STATUS } from "constants/status";

import { todosSelectors } from "../../../../../../../../../../store/redux/reducers/todos/ducks";

const { makeSelectTasksByFilter } = todosSelectors;
const { useSelector } = reduxHooks;

const useReduxConnect = (todoId: Todo["id"]): UseConnectReturn => {
  const [filter, setFilter] = useState<TaskListFilter>(TaskListFilter.all);
  const selectTasksByFilter = useMemo(makeSelectTasksByFilter, []);

  const isTodosLoading =
    useSelector(state => state.todos.statuses.todosLoad) === STATUS.loading;

  const tasks = useSelector(state =>
    selectTasksByFilter(state, todoId, filter),
  );

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

export default useReduxConnect;
