import {
  ChangeEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

import type { UseConnectReturn } from "../types";
import type { Task, Todo } from "api/client";

import { reduxSagaHooks } from "hooks";

import { selectTodoById, todosSlice } from "store/redux-saga/slices/todos";

import { STATUS } from "constants/status";

import { getIsTargetContainsExcludedClasses } from "helpers/dom";

import styles from "../../../../Task.module.scss";

const { removeTaskPending, updateTaskPending } = todosSlice.actions;
const { useSelector, useDispatch } = reduxSagaHooks;
const { isCheckedStatusClass, deleteButton } = styles;

const useReduxSagaConnect = ({
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

  const isAnyTaskUpdating = Boolean(
    todoUpdateStatus && !todoUpdateStatus?.isTodoUpdating,
  );

  const isTodoUpdating = Boolean(todoUpdateStatus?.isTodoUpdating);
  const isTaskUpdating = Boolean(todoUpdateStatus?.[id]);

  const isTodosLoading =
    useSelector(state => state.todos.statuses.todosLoad) === STATUS.loading;

  const isTodoCreating = useSelector(
    state => state.todos.statuses.isTodoCreating,
  );

  const isTodosReordering = useSelector(
    state => state.todos.statuses.isTodosReordering,
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

  const dispatch = useDispatch();

  const onRemoveTask = () => {
    dispatch(removeTaskPending({ todoId, id }));
  };

  useEffect(() => {
    if (!isTaskUpdating) {
      setIsEditableTitleOpened(false);
    }
  }, [isTaskUpdating]);

  const setPreviousIsCheckedStatus = () => {
    setIsCheckedStatus(prevIsCheckedStatus => !prevIsCheckedStatus);
  };

  const onChangeEditableTitle = (value: string) => {
    if (value.trim() && value !== title) {
      dispatch(updateTaskPending({ title: value, id, todoId }));
    } else {
      setIsEditableTitleOpened(false);
    }
  };

  const onChangeTaskStatus = (
    _: ChangeEvent<HTMLInputElement>,
    isChecked: Task["isChecked"],
  ) => {
    setPreviousIsCheckedStatus();
    dispatch(
      updateTaskPending({ isChecked, id, todoId, setPreviousIsCheckedStatus }),
    );
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

export default useReduxSagaConnect;
