import { KeyboardEvent, useState } from "react";

import type { Todo } from "api/client";
import type { UseConnectReturn } from "../types";

import { reduxHooks } from "hooks";

import { todosThunks } from "store/redux/reducers/todos/ducks";

import { KEYS } from "constants/eventTarget";
import { STATUS } from "constants/status";

const { useSelector, useDispatch } = reduxHooks;
const { createTask } = todosThunks;

const useReduxConnect = (todoId: Todo["id"]): UseConnectReturn => {
  const [taskTitle, setTaskTitle] = useState("");
  const todosUpdateStatuses = useSelector(
    state => state.todos.statuses.todosUpdate,
  );
  const isTodoCreating = useSelector(
    state => state.todos.statuses.isTodoCreating,
  );

  const isTodosReordering = useSelector(
    state => state.todos.statuses.isTodosReordering,
  );

  const isAnyTaskUpdating = Boolean(
    todosUpdateStatuses[todoId] && !todosUpdateStatuses[todoId]?.isTodoUpdating,
  );

  const isTodosLoading =
    useSelector(state => state.todos.statuses.todosLoad) === STATUS.loading;

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

export default useReduxConnect;
