import type { UseConnectReturn } from "../types";

const useRTKConnect = (): UseConnectReturn => ({
  taskTitle: "",
  setTaskTitle: () => {},
  isDisabled: true,
  onCreateTask: () => {},
  onCreateTaskKeyDown: () => {},
});

export default useRTKConnect;
