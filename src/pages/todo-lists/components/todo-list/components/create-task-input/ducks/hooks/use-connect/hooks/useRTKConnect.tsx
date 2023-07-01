import { KeyboardEvent, useState } from "react";

import type { UseConnectReturn } from "../types";
import type { Todo } from "api/client";

import { rtkHooks } from "hooks";

import { createTask } from "store/redux-toolkit/slices/todos";

import { KEYS } from "constants/eventTarget";
import { STATUS } from "constants/status";

const { useSelector, useDispatch } = rtkHooks;

const useRTKConnect = (todoId: Todo["id"]): UseConnectReturn => {
  const [taskTitle, setTaskTitle] = useState("");
  const todosUpdateStatuses = useSelector(
    state => state.todos.statuses.todosUpdate,
  );
  const isTodoCreating = useSelector(
    state => state.todos.statuses.isTodoCreating,
  );

  const isTodosLoading =
    useSelector(state => state.todos.statuses.todosLoad) === STATUS.loading;

  const isTodosReordering = useSelector(
    state => state.todos.statuses.isTodosReordering,
  );

  const isAnyTaskUpdating = Boolean(
    todosUpdateStatuses[todoId] && !todosUpdateStatuses[todoId]?.isTodoUpdating,
  );

  const isTodoUpdating = Boolean(todosUpdateStatuses[todoId]?.isTodoUpdating);

  const isDisabled =
    isTodoUpdating ||
    isTodoCreating ||
    isTodosReordering ||
    isAnyTaskUpdating ||
    isTodosLoading;

  const dispatch = useDispatch();

  const onCreateTask = async () => {
    if (!taskTitle.trim()) {
      return;
    }

    await dispatch(createTask({ todoId, title: taskTitle }));
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

export default useRTKConnect;
