import { rtkQueryHooks } from "hooks";

import { setSearch } from "store/redux-toolkit/slices/todos";
import { createTodoApi } from "store/redux-toolkit-query/api";

const { useDispatch } = rtkQueryHooks;

const useRTKQueryConnect = () => {
  const [, { isLoading: isCreatingTodo }] = createTodoApi.useCreateTodoMutation(
    {
      fixedCacheKey: "createTodo",
    },
  );

  const dispatch = useDispatch();

  const onSearchChange = (search: string) => {
    dispatch(setSearch(search));
  };

  return {
    isDisabled: isCreatingTodo,
    isTodosReordering: false,
    isCreatingTodo,
    onSearchChange,
  };
};

export default useRTKQueryConnect;
