import { STATUS } from "constants/status";

import { reactContextHooks } from "hooks";

import { actions } from "store/react-context/ducks";

const { useContextSelector } = reactContextHooks;
const { setSearch } = actions;

const useReactContextConnect = () => {
  const isLoadingTodo =
    useContextSelector(state => state.statuses.todosLoad) === STATUS.loading;
  const isCreatingTodo = useContextSelector(
    state => state.statuses.isTodoCreating,
  );
  const isTodosReordering = useContextSelector(
    state => state.statuses.isTodosReordering,
  );
  const todosUpdateStatuses = useContextSelector(
    state => state.statuses.todosUpdate,
  );

  const dispatch = useContextSelector(state => state.dispatch);

  const isAnyTodoUpdating = Boolean(Object.values(todosUpdateStatuses).length);
  const isDisabled =
    isLoadingTodo || isCreatingTodo || isTodosReordering || isAnyTodoUpdating;

  const onSearchChange = (search: string) => {
    setSearch({ dispatch, search });
  };

  return {
    isDisabled,
    isTodosReordering,
    isCreatingTodo,
    onSearchChange,
  };
};

export default useReactContextConnect;
