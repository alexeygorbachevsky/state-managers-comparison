import type { UseConnectReturn } from "../types";
import type { Todo } from "api/client";

import { rtkQueryHooks } from "hooks";

import {
  createTodoApi,
  loadTodosApi,
  removeTodoApi,
} from "store/redux-toolkit-query/api";

const { useSelector } = rtkQueryHooks;

const useRTKQueryConnect = (id: Todo["id"]): UseConnectReturn => {
  const search = useSelector(state => state.todos.search);
  const { currentData } = loadTodosApi.useLoadTodosQuery(search);
  const [removeTodo] = removeTodoApi.useRemoveTodoMutation({
    fixedCacheKey: `removeTodo=${id}`,
  });

  const [, { isLoading: isRemovingTodo }] = createTodoApi.useCreateTodoMutation(
    {
      fixedCacheKey: `removeTodo=${id}`,
    },
  );

  const { title } = currentData!.entities[id];

  const onRemoveTodo = () => {
    removeTodo(id);
  };

  return {
    title,
    isEditableTitleOpened: false,
    setIsEditableTitleOpened: () => {},
    isDisabled: Boolean(isRemovingTodo),
    onRemoveTodo,
    onUpdateTodoTitle: () => {},
  };
};

export default useRTKQueryConnect;
