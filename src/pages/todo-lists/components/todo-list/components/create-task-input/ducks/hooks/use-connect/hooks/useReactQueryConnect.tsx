import type { UseConnectReturn } from "../types";

const useReactQueryConnect = (): UseConnectReturn => ({
  taskTitle: "",
  setTaskTitle: () => {},
  isDisabled: true,
  onCreateTask: () => {},
  onCreateTaskKeyDown: () => {},
});

export default useReactQueryConnect;
