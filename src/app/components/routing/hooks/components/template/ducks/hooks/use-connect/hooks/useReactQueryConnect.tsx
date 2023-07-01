import { useIsMutating } from "@tanstack/react-query";

import { reactQueryHooks } from "hooks";

import { setSearch } from "store/react-query/slices/todos";

const { useDispatch } = reactQueryHooks;

const useReactQueryConnect = () => {
  const isCreatingTodo = useIsMutating({ mutationKey: ["createTodo"] }) > 0;

  const dispatch = useDispatch();

  const onSearchChange = (search: string) => {
    dispatch(setSearch(search));
  };

  return {
    isDisabled: isCreatingTodo,
    isCreatingTodo,
    isTodosReordering: false,
    onSearchChange,
  };
};

export default useReactQueryConnect;
