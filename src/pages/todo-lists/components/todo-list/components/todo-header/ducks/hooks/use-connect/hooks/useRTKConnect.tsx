import { useState } from "react";

import type { UseConnectReturn } from "../types";
import type { Todo } from "api/client";

import { rtkHooks } from "hooks";
import {
  removeTodo,
  selectTodoById,
  updateTodoTitle,
} from "store/redux-toolkit/slices/todos";

import { STATUS } from "constants/status";

const { useSelector, useDispatch } = rtkHooks;

const useRTKConnect = (id: Todo["id"]): UseConnectReturn => {
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
    dispatch(removeTodo(id));
  };

  const onUpdateTodoTitle = async (value: string) => {
    if (value.trim() && value !== title) {
      await dispatch(updateTodoTitle({ id, title: value }));
    }

    setIsEditableTitleOpened(false);
  };

  return {
    title,
    isEditableTitleOpened,
    setIsEditableTitleOpened,
    isDisabled,
    onRemoveTodo,
    onUpdateTodoTitle
  };
};

export default useRTKConnect;
