import { useEffect } from "react";
import { SortEnd, SortEvent, SortEventWithTag } from "react-sortable-hoc";
import { DropResult } from "react-beautiful-dnd";

import type { UseConnectReturn } from "../types";

import { STATUS } from "constants/status";

import { dragHeaderClass } from "pages/todo-lists/components";

import { store } from "store/mobx";

import { mobXHooks } from "hooks";

const { useMobXContext } = mobXHooks;

// use imported store because it's not a good to trigger TodoLists rerender on any Todo updating
export const getIsAnyTodoUpdating = () => {
  const { todosUpdate, isTodosReordering, isTodoCreating, todosLoad } =
    store.todos.statuses;

  return (
    Boolean(Object.keys(todosUpdate).length) ||
    isTodosReordering ||
    isTodoCreating ||
    todosLoad === STATUS.loading
  );
};

const useMobxConnect = (): UseConnectReturn => {
  const { todos } = useMobXContext();

  const { ids: todoIds, search, statuses, isLastBatch } = todos;

  const loadTodosStatus = statuses.todosLoad;

  const onLoadTodos = () => {
    todos.loadTodos();
  };

  const onClearTodos = () => {
    todos.clearTodos();
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

    todos.reorderTodos({ sourceIndex: oldIndex, destinationIndex: newIndex });
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

    todos.reorderTasks({ source, destination });
  };

  useEffect(() => {
    onClearTodos();
    onLoadTodos();
  }, [search]);

  return {
    onLoadTodos,
    isFailed: loadTodosStatus === STATUS.failed,
    isLoading: loadTodosStatus === STATUS.loading,
    todoIds,
    onTaskDragEnd,
    onShouldCancelStartDnD,
    onSortEnd,
    isTodoCreating: statuses.isTodoCreating,
    isLastBatch,
  };
};

export default useMobxConnect;
