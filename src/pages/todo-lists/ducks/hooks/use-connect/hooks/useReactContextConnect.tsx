import { useEffect } from "react";
import { SortEnd, SortEvent, SortEventWithTag } from "react-sortable-hoc";
import { DropResult } from "react-beautiful-dnd";

import type { UseConnectReturn } from "../types";

import { STATUS } from "constants/status";

import { Todo } from "api/client";

import { dragHeaderClass } from "pages/todo-lists/components";

import { reactContextHooks } from "hooks";

import { thunks, actions } from "../../../../../../store/react-context/ducks";

const { useContextSelector } = reactContextHooks;
const { loadTodos, reorderTodos, reorderTasks } = thunks;
const { clearTodos } = actions;

const useReduxConnect = (): UseConnectReturn => {
  const todoIds = useContextSelector(state => state.ids) as Todo["id"][];
  const search = useContextSelector(state => state.search);
  const loadTodosStatus = useContextSelector(state => state.statuses.todosLoad);
  const isTodoCreating = useContextSelector(
    state => state.statuses.isTodoCreating,
  );
  const todosUpdate = useContextSelector(state => state.statuses.todosUpdate);

  const isTodosReordering = useContextSelector(
    state => state.statuses.isTodosReordering,
  );

  const isLastBatch = useContextSelector(state => state.isLastBatch);

  const loadDelay = useContextSelector(state => state.loadDelay);

  const cursor = useContextSelector(state => state.cursor);

  const alerts = useContextSelector(state => state.alerts);

  const isSessionStorage = useContextSelector(state => state.isSessionStorage);

  const isLoading = loadTodosStatus === STATUS.loading;

  const dispatch = useContextSelector(state => state.dispatch);

  const ids = useContextSelector(state => state.ids);

  const entities = useContextSelector(state => state.entities);

  const onLoadTodos = () => {
    loadTodos({
      loadDelay,
      cursor,
      search,
      alerts,
      isSessionStorage,
      dispatch,
    });
  };

  const onClearTodos = () => {
    clearTodos(dispatch);
  };

  const onShouldCancelStartDnD = (event: SortEvent | SortEventWithTag) => {
    const target = event.target as HTMLElement;

    const isAnyTodoUpdating =
      Boolean(Object.keys(todosUpdate).length) ||
      isTodosReordering ||
      isTodoCreating ||
      isLoading;

    return (
      !target.classList.contains(dragHeaderClass) ||
      isAnyTodoUpdating ||
      Boolean(search)
    );
  };

  const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    if (oldIndex === newIndex) {
      return;
    }

    reorderTodos({
      sourceIndex: oldIndex,
      destinationIndex: newIndex,
      ids,
      entities,
      alerts,
      isSessionStorage,
      dispatch,
      loadDelay,
    });
  };

  const onTaskDragEnd = ({ source, destination }: DropResult) => {
    if (!destination || !source) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    reorderTasks({
      source,
      destination,
      alerts,
      isSessionStorage,
      dispatch,
      loadDelay,
    });
  };

  useEffect(() => {
    onClearTodos();
    onLoadTodos();
  }, [search]);

  return {
    onLoadTodos,
    isFailed: loadTodosStatus === STATUS.failed,
    todoIds,
    isLoading,
    onTaskDragEnd,
    onShouldCancelStartDnD,
    onSortEnd,
    isTodoCreating,
    isLastBatch,
  };
};

export default useReduxConnect;
