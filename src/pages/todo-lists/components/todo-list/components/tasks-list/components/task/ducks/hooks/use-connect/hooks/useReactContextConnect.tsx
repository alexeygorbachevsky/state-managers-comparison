import { ChangeEvent, MouseEvent, useCallback, useState } from "react";

import type { Todo, Task } from "api/client";
import type { UseConnectReturn } from "../types";

import { reactContextHooks } from "hooks";

import { STATUS } from "constants/status";

import { thunks } from "store/react-context/ducks";

import { getIsTargetContainsExcludedClasses } from "helpers/dom";

import styles from "../../../../Task.module.scss";

const { removeTask, updateTask } = thunks;

const { isCheckedStatusClass, deleteButton } = styles;

const { useContextSelector } = reactContextHooks;

const useReactContextConnect = ({
  id,
  title,
  isChecked,
  todoId,
}: Task): UseConnectReturn => {
  const [isCheckedStatus, setIsCheckedStatus] = useState(isChecked);
  const [isEditableTitleOpened, setIsEditableTitleOpened] = useState(false);
  const { tasks } = useContextSelector(state => state.entities[todoId]) as Todo;
  const todoUpdateStatus = useContextSelector(
    state => state.statuses.todosUpdate[todoId],
  );

  const isSessionStorage = useContextSelector(state => state.isSessionStorage);

  const loadDelay = useContextSelector(state => state.loadDelay);

  const alerts = useContextSelector(state => state.alerts);

  const isTodosLoading =
    useContextSelector(state => state.statuses.todosLoad) === STATUS.loading;

  const isAnyTaskUpdating = Boolean(
    todoUpdateStatus && !todoUpdateStatus?.isTodoUpdating,
  );

  const isTodoUpdating = Boolean(todoUpdateStatus?.isTodoUpdating);
  const isTaskUpdating = Boolean(todoUpdateStatus?.[id]);

  const isTodoCreating = useContextSelector(
    state => state.statuses.isTodoCreating,
  );

  const isTodosReordering = useContextSelector(
    state => state.statuses.isTodosReordering,
  );

  const isDisabled =
    isTodoUpdating ||
    isTaskUpdating ||
    isTodoCreating ||
    isTodosReordering ||
    isTodosLoading;

  const onTaskClick = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      const target = e.target as HTMLElement;
      const currentTarget = e.currentTarget as HTMLElement;

      if (isDisabled) {
        return;
      }

      const isContains = getIsTargetContainsExcludedClasses({
        target,
        currentTarget,
        excludedClasses: [isCheckedStatusClass, deleteButton],
      });
      if (isContains) {
        return;
      }

      setIsEditableTitleOpened(true);
    },
    [title, isDisabled],
  );

  const dispatch = useContextSelector(state => state.dispatch);

  const onRemoveTask = () => {
    removeTask({ dispatch, todoId, id, alerts, isSessionStorage, loadDelay });
  };

  const onChangeEditableTitle = async (value: string) => {
    if (value.trim() && value !== title) {
      await updateTask({
        title: value,
        id,
        todoId,
        dispatch,
        isChecked,
        isSessionStorage,
        loadDelay,
        alerts,
      });
    }

    setIsEditableTitleOpened(false);
  };

  const onChangeTaskStatus = async (
    _: ChangeEvent<HTMLInputElement>,
    isChecked: Task["isChecked"],
  ) => {
    setIsCheckedStatus(prevIsCheckedStatus => !prevIsCheckedStatus);

    try {
      await updateTask({
        dispatch,
        isChecked,
        id,
        todoId,
        alerts,
        loadDelay,
        isSessionStorage,
        title,
      });
    } catch (error) {
      setIsCheckedStatus(prevIsCheckedStatus => !prevIsCheckedStatus);
    }
  };

  return {
    isCheckedStatus,
    isEditableTitleOpened,
    tasks,
    isAnyTaskUpdating,
    onTaskClick,
    onRemoveTask,
    onChangeEditableTitle,
    onChangeTaskStatus,
    isDisabled,
    setIsEditableTitleOpened,
  };
};

export default useReactContextConnect;
