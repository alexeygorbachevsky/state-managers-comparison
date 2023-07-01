import { stringify } from "query-string";

import type { DelaysType } from "constants/sessionStorage";
import type { Todo } from "../types";

import { instance } from "../config";

interface RemoveTodoArgs {
  id: Todo["id"];
  isSessionStorage: boolean;
  loadDelay: DelaysType;
}

interface RemoveTodo {
  (args: RemoveTodoArgs): Promise<Todo>;
}

const removeTodo: RemoveTodo = async ({ id, isSessionStorage, loadDelay }) => {
  const queryString = stringify({
    isSessionStorage,
    loadDelay,
  });

  const response = await instance.delete(`todos/${id}?${queryString}`);

  return response.data;
};

export default removeTodo;
