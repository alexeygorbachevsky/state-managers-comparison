import { stringify } from "query-string";

import type { DelaysType } from "constants/sessionStorage";
import type { Todo } from "../types";

import { instance } from "../config";

interface FetchTodosArgs {
  cursor?: string | null;
  batchSize?: number;
  search: string;
  isSessionStorage: boolean;
  loadDelay: DelaysType;
}

interface FetchTodosReturn {
  todos: Todo[];
  isLastBatch: boolean;
}

interface FetchTodos {
  (args: FetchTodosArgs): Promise<FetchTodosReturn>;
}

const fetchTodos: FetchTodos = async ({
  cursor,
  batchSize = 20,
  search,
  isSessionStorage,
  loadDelay,
}) => {
  const queryString = stringify({
    cursor,
    batchSize,
    search,
    isSessionStorage,
    loadDelay,
  });

  const response = await instance.get(`todos?${queryString}`);

  return response.data;
};

export default fetchTodos;
