import type { Todo } from "../types";

import { DelaysType } from "constants/sessionStorage";

import { instance } from "../config";

interface FetchTodosArgs {
  title: Todo["title"];
  isSessionStorage: boolean;
  loadDelay: DelaysType;
}

interface FetchTodos {
  (args: FetchTodosArgs): Promise<Todo>;
}

const createTodo: FetchTodos = async ({
  title,
  isSessionStorage,
  loadDelay,
}) => {
  const response = await instance.post("todos", {
    title,
    isSessionStorage,
    loadDelay,
  });

  return response.data;
};

export default createTodo;
