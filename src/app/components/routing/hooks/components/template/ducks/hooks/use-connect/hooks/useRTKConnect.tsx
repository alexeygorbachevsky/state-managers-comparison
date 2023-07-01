import { STATUS } from "constants/status";

import { rtkHooks } from "hooks";

import { setSearch } from "store/redux-toolkit/slices/todos";

const { useDispatch, useSelector } = rtkHooks;

const useRTKConnect = () => {
  const isLoadingTodo =
    useSelector(state => state.todos.statuses.todosLoad) === STATUS.loading;
  const isCreatingTodo = useSelector(
    state => state.todos.statuses.isTodoCreating,
  );
  const isTodosReordering = useSelector(
    state => state.todos.statuses.isTodosReordering,
  );
  const todosUpdateStatuses = useSelector(
    state => state.todos.statuses.todosUpdate,
  );

  const dispatch = useDispatch();

  const isAnyTodoUpdating = Boolean(Object.values(todosUpdateStatuses).length);
  const isDisabled =
    isLoadingTodo || isCreatingTodo || isTodosReordering || isAnyTodoUpdating;

  const onSearchChange = (search: string) => {
    dispatch(setSearch(search));
  };

  return {
    isDisabled,
    isTodosReordering,
    isCreatingTodo,
    onSearchChange,
  };
};

export default useRTKConnect;
