import { useEffect } from "react";
import { SortEnd, SortEvent, SortEventWithTag } from "react-sortable-hoc";
import { DropResult } from "react-beautiful-dnd";

import type { UseConnectReturn } from "../types";

import { STATUS } from "constants/status";

import { Todo } from "api/client";

import { dragHeaderClass } from "pages/todo-lists/components";

import { reduxSagaHooks } from "hooks";

import { store } from "store/redux-saga";
import {
  clearTodos,
  selectTodoIds,
  todosSlice,
} from "store/redux-saga/slices/todos";

const { loadTodosPending, reorderTodosPending, reorderTasksPending } =
  todosSlice.actions;

const { useDispatch, useSelector } = reduxSagaHooks;

// use imported store because it's not a good to trigger TodoLists rerender on any Todo updating
export const getIsAnyTodoUpdating = () => {
  const { todosUpdate, isTodosReordering, isTodoCreating, todosLoad } =
    store.getState().todos.statuses;

  return (
    Boolean(Object.keys(todosUpdate).length) ||
    isTodosReordering ||
    isTodoCreating ||
    todosLoad === STATUS.loading
  );
};

const useReduxSagaConnect = (): UseConnectReturn => {
  const todoIds = useSelector(selectTodoIds) as Todo["id"][];
  const search = useSelector(state => state.todos.search);
  const loadTodosStatus = useSelector(state => state.todos.statuses.todosLoad);
  const isTodoCreating = useSelector(
    state => state.todos.statuses.isTodoCreating,
  );
  const isLastBatch = useSelector(state => state.todos.isLastBatch);

  const isLoading = loadTodosStatus === STATUS.loading;

  const dispatch = useDispatch();

  const onLoadTodos = () => {
    dispatch(loadTodosPending());
  };

  const onClearTodos = () => {
    dispatch(clearTodos());
  };

  const onShouldCancelStartDnD = (event: SortEvent | SortEventWithTag) => {
    const target = event.target as HTMLElement;

    return (
      !target.classList.contains(dragHeaderClass) ||
      getIsAnyTodoUpdating() ||
      Boolean(search)
    );
  };

  const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    if (oldIndex === newIndex) {
      return;
    }

    dispatch(
      reorderTodosPending({
        sourceIndex: oldIndex,
        destinationIndex: newIndex,
      }),
    );
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

    dispatch(reorderTasksPending({ source, destination }));
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

export default useReduxSagaConnect;
