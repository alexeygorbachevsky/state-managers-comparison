import { STATUS } from "constants/status";

import { mobXHooks } from "hooks";

const { useMobXContext } = mobXHooks;

const useMobXConnect = () => {
  const { todos } = useMobXContext();

  const { statuses } = todos;

  const isLoadingTodo = statuses.todosLoad === STATUS.loading;

  const isCreatingTodo = statuses.isTodoCreating;

  const isTodosReordering = statuses.isTodosReordering;

  const todosUpdateStatuses = statuses.todosUpdate;

  const isAnyTodoUpdating = Boolean(Object.values(todosUpdateStatuses).length);
  const isDisabled =
    isLoadingTodo || isCreatingTodo || isTodosReordering || isAnyTodoUpdating;

  const onSearchChange = (search: string) => {
    todos.setSearch(search);
  };

  return {
    isDisabled,
    isTodosReordering,
    isCreatingTodo,
    onSearchChange,
  };
};

export default useMobXConnect;
