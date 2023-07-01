import { KeyboardEvent, useState } from "react";

import type { Todo } from "api/client";
import type { UseConnectReturn } from "../types";

import { reactContextHooks } from "hooks";

import { thunks } from "store/react-context/ducks";

import { KEYS } from "constants/eventTarget";
import { STATUS } from "constants/status";

const { useContextSelector } = reactContextHooks;
const { createTask } = thunks;

const useReactContextConnect = (todoId: Todo["id"]): UseConnectReturn => {
  const [taskTitle, setTaskTitle] = useState("");

  const isSessionStorage = useContextSelector(state => state.isSessionStorage);

  const loadDelay = useContextSelector(state => state.loadDelay);

  const alerts = useContextSelector(state => state.alerts);

  const todosUpdateStatuses = useContextSelector(
    state => state.statuses.todosUpdate,
  );
  const isTodoCreating = useContextSelector(
    state => state.statuses.isTodoCreating,
  );

  const isTodosReordering = useContextSelector(
    state => state.statuses.isTodosReordering,
  );

  const isAnyTaskUpdating = Boolean(
    todosUpdateStatuses[todoId] && !todosUpdateStatuses[todoId]?.isTodoUpdating,
  );

  const isTodosLoading =
    useContextSelector(state => state.statuses.todosLoad) === STATUS.loading;

  const isTodoUpdating = Boolean(todosUpdateStatuses[todoId]?.isTodoUpdating);

  const isDisabled =
    isTodoUpdating ||
    isTodoCreating ||
    isTodosReordering ||
    isAnyTaskUpdating ||
    isTodosLoading;

  const dispatch = useContextSelector(state => state.dispatch);

  const onCreateTask = async () => {
    if (!taskTitle.trim()) {
      return;
    }

    await createTask({
      dispatch,
      isSessionStorage,
      loadDelay,
      todoId,
      title: taskTitle,
      alerts,
    });
    setTaskTitle("");
  };

  const onCreateTaskKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === KEYS.enter) {
      onCreateTask();
    }
  };

  return {
    taskTitle,
    setTaskTitle,
    isDisabled,
    onCreateTask,
    onCreateTaskKeyDown,
  };
};

export default useReactContextConnect;
