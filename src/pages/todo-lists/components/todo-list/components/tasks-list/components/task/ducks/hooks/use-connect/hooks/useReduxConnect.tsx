import { ChangeEvent, MouseEvent, useCallback, useState } from "react";

import type { Todo, Task } from "api/client";
import type { UseConnectReturn } from "../types";

import { reduxHooks } from "hooks";

import {STATUS} from "constants/status";

import { todosThunks, todosSelectors } from "store/redux/reducers/todos/ducks";

import { getIsTargetContainsExcludedClasses } from "helpers/dom";

import styles from "../../../../Task.module.scss";

const { removeTask, updateTask } = todosThunks;
const { selectTodoById } = todosSelectors;

const { isCheckedStatusClass, deleteButton } = styles;

const { useSelector, useDispatch } = reduxHooks;

const useReduxConnect = ({
  id,
  title,
  isChecked,
  todoId,
}: Task): UseConnectReturn => {
  const [isCheckedStatus, setIsCheckedStatus] = useState(isChecked);
  const [isEditableTitleOpened, setIsEditableTitleOpened] = useState(false);
  const { tasks } = useSelector(state => selectTodoById(state, todoId)) as Todo;
  const todoUpdateStatus = useSelector(
    state => state.todos.statuses.todosUpdate[todoId],
  );

  const isTodosLoading =
      useSelector(state => state.todos.statuses.todosLoad) === STATUS.loading;

  const isAnyTaskUpdating = Boolean(
    todoUpdateStatus && !todoUpdateStatus?.isTodoUpdating,
  );

  const isTodoUpdating = Boolean(todoUpdateStatus?.isTodoUpdating);
  const isTaskUpdating = Boolean(todoUpdateStatus?.[id]);

  const isTodoCreating = useSelector(
    state => state.todos.statuses.isTodoCreating,
  );

  const isTodosReordering = useSelector(
    state => state.todos.statuses.isTodosReordering,
  );

  const isDisabled =
    isTodoUpdating || isTaskUpdating || isTodoCreating || isTodosReordering || isTodosLoading;

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

  const dispatch = useDispatch();

  const onRemoveTask = () => {
    dispatch(removeTask({ todoId, id }));
  };

  const onChangeEditableTitle = async (value: string) => {
    if (value.trim() && value !== title) {
      await dispatch(updateTask({ title: value, id, todoId }));
    }

    setIsEditableTitleOpened(false);
  };

  const onChangeTaskStatus = async (
    _: ChangeEvent<HTMLInputElement>,
    isChecked: Task["isChecked"],
  ) => {
    setIsCheckedStatus(prevIsCheckedStatus => !prevIsCheckedStatus);

    try {
      await dispatch(updateTask({ isChecked, id, todoId }));
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

export default useReduxConnect;
