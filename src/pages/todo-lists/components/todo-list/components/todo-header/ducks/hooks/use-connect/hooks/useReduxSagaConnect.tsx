import { useEffect, useState } from "react";

import type { UseConnectReturn } from "../types";
import type { Todo } from "api/client";

import { reduxSagaHooks } from "hooks";
import { selectTodoById, todosSlice } from "store/redux-saga/slices/todos";

import { STATUS } from "constants/status";

const { removeTodoPending, updateTodoTitlePending } = todosSlice.actions;
const { useSelector, useDispatch } = reduxSagaHooks;

const useReduxSagaConnect = (id: Todo["id"]): UseConnectReturn => {
  const { title } = useSelector(state => selectTodoById(state, id)) as Todo;
  const [isEditableTitleOpened, setIsEditableTitleOpened] = useState(false);
  const isTodosLoading =
    useSelector(state => state.todos.statuses.todosLoad) === STATUS.loading;
  const isTodoCreating = useSelector(
    state => state.todos.statuses.isTodoCreating,
  );
  const isTodosReordering = useSelector(
    state => state.todos.statuses.isTodosReordering,
  );

  const todosUpdateStatuses = useSelector(
    state => state.todos.statuses.todosUpdate,
  );

  const isAnyTaskUpdating = Boolean(
    todosUpdateStatuses[id] && !todosUpdateStatuses[id]?.isTodoUpdating,
  );

  const isTodoUpdating = Boolean(todosUpdateStatuses[id]?.isTodoUpdating);

  const isDisabled =
    isTodosLoading ||
    isTodoCreating ||
    isTodosReordering ||
    isTodoUpdating ||
    isAnyTaskUpdating;

  const dispatch = useDispatch();

  const onRemoveTodo = () => {
    dispatch(removeTodoPending(id));
  };

  useEffect(() => {
    if (!isTodoUpdating) {
      setIsEditableTitleOpened(false);
    }
  }, [isTodoUpdating]);

  const onUpdateTodoTitle = (value: string) => {
    if (value.trim() && value !== title) {
      dispatch(updateTodoTitlePending({ id, title: value }));
    }
  };

  return {
    title,
    isEditableTitleOpened,
    setIsEditableTitleOpened,
    isDisabled,
    onRemoveTodo,
    onUpdateTodoTitle,
  };
};

export default useReduxSagaConnect;
