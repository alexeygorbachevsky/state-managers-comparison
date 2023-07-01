import { useState } from "react";

import type { Todo } from "api/client";
import type { UseConnectReturn } from "../types";

import { reactContextHooks } from "hooks";

import { thunks } from "store/react-context/ducks";

import { STATUS } from "constants/status";

const { useContextSelector } = reactContextHooks;
const { removeTodo, updateTodoTitle } = thunks;

const useReduxConnect = (id: Todo["id"]): UseConnectReturn => {
  const { title } = useContextSelector(state => state.entities[id]) as Todo;
  const [isEditableTitleOpened, setIsEditableTitleOpened] = useState(false);
  const isTodosLoading =
    useContextSelector(state => state.statuses.todosLoad) === STATUS.loading;
  const isTodoCreating = useContextSelector(
    state => state.statuses.isTodoCreating,
  );
  const isTodosReordering = useContextSelector(
    state => state.statuses.isTodosReordering,
  );

  const todosUpdateStatuses = useContextSelector(
    state => state.statuses.todosUpdate,
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

  const dispatch = useContextSelector(state => state.dispatch);

  const isSessionStorage = useContextSelector(state => state.isSessionStorage);

  const loadDelay = useContextSelector(state => state.loadDelay);

  const alerts = useContextSelector(state => state.alerts);

  const onRemoveTodo = () => {
    removeTodo({ id, dispatch, alerts, isSessionStorage, loadDelay });
  };

  const onUpdateTodoTitle = async (value: string) => {
    if (value.trim() && value !== title) {
      await updateTodoTitle({
        id,
        title: value,
        alerts,
        isSessionStorage,
        loadDelay,
        dispatch,
      });
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

export default useReduxConnect;
