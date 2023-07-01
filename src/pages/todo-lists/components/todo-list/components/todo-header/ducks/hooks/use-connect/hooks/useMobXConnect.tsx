import { useState } from "react";

import type { Todo } from "api/client";
import type { UseConnectReturn } from "../types";

import { STATUS } from "constants/status";

import { mobXHooks } from "hooks";

const { useMobXContext } = mobXHooks;

const useMobXConnect = (id: Todo["id"]): UseConnectReturn => {
  const { todos } = useMobXContext();

  const { statuses } = todos;

  const { title } = todos.selectTodoById(id);

  const [isEditableTitleOpened, setIsEditableTitleOpened] = useState(false);
  const isTodosLoading = statuses.todosLoad === STATUS.loading;

  const todosUpdateStatuses = statuses.todosUpdate;

  const isAnyTaskUpdating = Boolean(
    todosUpdateStatuses[id] && !todosUpdateStatuses[id]?.isTodoUpdating,
  );

  const isTodoUpdating = Boolean(todosUpdateStatuses[id]?.isTodoUpdating);

  const isDisabled =
    isTodosLoading ||
    statuses.isTodoCreating ||
    statuses.isTodosReordering ||
    isTodoUpdating ||
    isAnyTaskUpdating;

  const onRemoveTodo = () => {
    todos.removeTodo(id);
  };

  const onUpdateTodoTitle = async (value: string) => {
    if (value.trim() && value !== title) {
      await todos.updateTodoTitle({ id, title: value });
    }

    setIsEditableTitleOpened(false);
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

export default useMobXConnect;
