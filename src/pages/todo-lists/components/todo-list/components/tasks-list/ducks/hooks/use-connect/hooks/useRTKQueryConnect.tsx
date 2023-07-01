import { useState } from "react";

import type { UseConnectReturn } from "../types";
import type { Todo } from "api/client";

import { rtkQueryHooks } from "hooks";

import { TaskListFilter } from "constants/tasks";

import { loadTodosApi } from "../../../../../../../../../../store/redux-toolkit-query/api";

const { useSelector } = rtkQueryHooks;

const useRTKQueryConnect = (todoId: Todo["id"]): UseConnectReturn => {
  const [filter, setFilter] = useState<TaskListFilter>(TaskListFilter.all);

  const search = useSelector(state => state.todos.search);
  const { tasks } = loadTodosApi.useLoadTodosQuery(search, {
    selectFromResult: ({ currentData }) => {
      const { tasks } = currentData!.entities[todoId];

      if (filter === TaskListFilter.all) {
        return { tasks };
      }

      return {
        tasks: tasks.filter(task => {
          if (filter === TaskListFilter.done) {
            return task.isChecked;
          }

          return !task.isChecked;
        }),
      };
    },
  });

  return {
    filter,
    setFilter,
    tasks,
    isAnyTaskUpdating: false,
    isDisabled: true,
  };
};

export default useRTKQueryConnect;
