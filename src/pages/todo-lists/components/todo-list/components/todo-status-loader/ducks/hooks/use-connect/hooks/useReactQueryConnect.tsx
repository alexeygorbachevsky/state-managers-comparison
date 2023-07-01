import { useIsMutating } from "@tanstack/react-query";

import type { UseConnectReturn } from "../types";

import type { Todo } from "api/client";

const useReactQueryConnect = (id: Todo["id"]): UseConnectReturn => {
  const isTodoRemoving = useIsMutating({ mutationKey: ["removeTodo", id] }) > 0;

  return {
    isDisabled: isTodoRemoving,
    todoUpdateStatus: isTodoRemoving,
  };
};

export default useReactQueryConnect;
