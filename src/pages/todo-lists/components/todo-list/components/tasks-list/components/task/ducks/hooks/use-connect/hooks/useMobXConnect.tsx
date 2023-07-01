import {
  ChangeEvent,
  MouseEvent,
  useCallback,
  useState,
} from "react";

import type { Task } from "api/client";
import type { UseConnectReturn } from "../types";

import { STATUS } from "constants/status";

import { mobXHooks } from "hooks";

import { getIsTargetContainsExcludedClasses } from "helpers/dom";

import styles from "../../../../Task.module.scss";

const { isCheckedStatusClass, deleteButton } = styles;
const { useMobXContext } = mobXHooks;

const useMobxConnect = ({
  id,
  title,
  isChecked,
  todoId,
}: Task): UseConnectReturn => {
  const { todos } = useMobXContext();

  const { statuses } = todos;

  const [isCheckedStatus, setIsCheckedStatus] = useState(isChecked);
  const [isEditableTitleOpened, setIsEditableTitleOpened] = useState(false);

  const { tasks } = todos.selectTodoById(todoId);
  const todoUpdateStatus = statuses.todosUpdate[todoId];

  const isTodosLoading = statuses.todosLoad === STATUS.loading;

  const isAnyTaskUpdating = Boolean(
    todoUpdateStatus && !todoUpdateStatus?.isTodoUpdating,
  );

  const isTodoUpdating = Boolean(todoUpdateStatus?.isTodoUpdating);
  const isTaskUpdating = Boolean(todoUpdateStatus?.[id]);

  const isDisabled =
    isTodoUpdating ||
    isTaskUpdating ||
    statuses.isTodoCreating ||
    statuses.isTodosReordering ||
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

  const onRemoveTask = () => {
    todos.removeTask({ todoId, id });
  };

  const onChangeEditableTitle = async (value: string) => {
    if (value.trim() && value !== title) {
      await todos.updateTask({ title: value, id, todoId });
    }

    setIsEditableTitleOpened(false);
  };

  const onChangeTaskStatus = async (
    _: ChangeEvent<HTMLInputElement>,
    isChecked: Task["isChecked"],
  ) => {
    setIsCheckedStatus(prevIsCheckedStatus => !prevIsCheckedStatus);

    try {
      await todos.updateTask({ isChecked, id, todoId });
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

export default useMobxConnect;
