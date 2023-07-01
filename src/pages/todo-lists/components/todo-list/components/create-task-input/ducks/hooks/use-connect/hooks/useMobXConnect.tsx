import { KeyboardEvent, useState } from "react";

import type { Todo } from "api/client";
import type { UseConnectReturn } from "../types";

import { KEYS } from "constants/eventTarget";
import { STATUS } from "constants/status";

import { mobXHooks } from "hooks";

const { useMobXContext } = mobXHooks;

const useMobXConnect = (todoId: Todo["id"]): UseConnectReturn => {
  const { todos } = useMobXContext();

  const { statuses } = todos;

  const [taskTitle, setTaskTitle] = useState("");
  const todosUpdateStatuses = statuses.todosUpdate;

  const isAnyTaskUpdating = Boolean(
    todosUpdateStatuses[todoId] && !todosUpdateStatuses[todoId]?.isTodoUpdating,
  );

  const isTodosLoading = statuses.todosLoad === STATUS.loading;

  const isTodoUpdating = Boolean(todosUpdateStatuses[todoId]?.isTodoUpdating);

  const isDisabled =
    isTodoUpdating ||
    statuses.isTodoCreating ||
    statuses.isTodosReordering ||
    isAnyTaskUpdating ||
    isTodosLoading;

  const onCreateTask = async () => {
    if (!taskTitle.trim()) {
      return;
    }

    await todos.createTask({ todoId, title: taskTitle });
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

export default useMobXConnect;
