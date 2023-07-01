import { KeyboardEvent, useEffect, useState } from "react";

import type { UseConnectReturn } from "../types";
import type { Todo } from "api/client";

import { reduxSagaHooks } from "hooks";

import { todosSlice } from "store/redux-saga/slices/todos";

import { KEYS } from "constants/eventTarget";
import { STATUS } from "constants/status";

const { createTaskPending } = todosSlice.actions;
const { useSelector, useDispatch } = reduxSagaHooks;

const useReduxSagaConnect = (todoId: Todo["id"]): UseConnectReturn => {
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

  useEffect(() => {
    if (!isTodoUpdating) {
      setTaskTitle("");
    }
  }, [isTodoUpdating]);

  const onCreateTask = () => {
    if (!taskTitle.trim()) {
      return;
    }

    dispatch(createTaskPending({ todoId, title: taskTitle }));
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

export default useReduxSagaConnect;
