import { useMemo, useState } from "react";

import type { UseConnectReturn } from "../types";
import type { Todo } from "api/client";

import { TaskListFilter } from "constants/tasks";

import { QueryData } from "store/react-query/types";

import { queryClient } from "app/components/routing/hooks/useProvider";

import { useSelector } from "hooks/store-hooks/react-query";

const useReactQueryConnect = (todoId: Todo["id"]): UseConnectReturn => {
  const [filter, setFilter] = useState<TaskListFilter>(TaskListFilter.all);
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

  const filteredTasks = useMemo(() => {
    if (filter === TaskListFilter.all) {
      return tasks;
    }

    return tasks.filter(task => {
      if (filter === TaskListFilter.done) {
        return task.isChecked;
      }

      return !task.isChecked;
    });
  }, [tasks, filter]);

  return {
    filter,
    setFilter,
    tasks: filteredTasks,
    isAnyTaskUpdating: false,
    isDisabled: true,
  };
};

export default useReactQueryConnect;
