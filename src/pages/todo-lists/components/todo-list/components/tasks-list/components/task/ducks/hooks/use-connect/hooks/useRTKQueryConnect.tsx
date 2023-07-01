import type { UseConnectReturn } from "../types";
import type { Task } from "api/client";

import { rtkQueryHooks } from "hooks";

import { loadTodosApi } from "store/redux-toolkit-query/api";

const { useSelector } = rtkQueryHooks;

const useRTKQueryConnect = ({ isChecked, todoId }: Task): UseConnectReturn => {
  const search = useSelector(state => state.todos.search);
  const { currentData } = loadTodosApi.useLoadTodosQuery(search);

  const { tasks } = currentData!.entities[todoId];

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

export default useRTKQueryConnect;
