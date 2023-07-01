import { useMemo } from "react";
import type { UseConnectReturn } from "../types";
import type { Task } from "api/client";

import { Todo } from "api/client";

import { QueryData } from "store/react-query/types";

import { queryClient } from "app/components/routing/hooks/useProvider";

import { useSelector } from "hooks/store-hooks/react-query";

const useReactQueryConnect = ({
  isChecked,
  todoId,
}: Task): UseConnectReturn => {
  const search = useSelector(state => state.todos.search);
  const data: QueryData | undefined = queryClient.getQueryData([
    "todos",
    { search },
  ]);

  const tasks = useMemo(() => {
    const todo =
      data?.pages.reduce((acc, curr) => {
        let targetTodo = acc;
        curr.todos.forEach(todo => {
          if (todoId !== todo.id) {
            return;
          }
          targetTodo = todo;
        });

        return targetTodo;
      }, {} as Todo) || ({} as Todo);

    return todo!.tasks;
  }, [data?.pages]);

  return {
    isCheckedStatus: isChecked,
    isEditableTitleOpened: false,
    tasks,
    isAnyTaskUpdating: false,
    onTaskClick: () => {},
    onRemoveTask: () => {},
    onChangeEditableTitle: () => {},
    onChangeTaskStatus: () => {},
    isDisabled: true,
    setIsEditableTitleOpened: () => {},
  };
};

export default useReactQueryConnect;
