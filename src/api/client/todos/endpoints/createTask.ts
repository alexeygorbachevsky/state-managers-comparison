import type { Todo, Task } from "api/client";

import { DelaysType } from "constants/sessionStorage";

import { instance } from "../config";

interface CreateTaskArgs {
  todoId: Todo["id"];
  title: Task["title"];
  isSessionStorage: boolean;
  loadDelay: DelaysType;
}

interface CreateTask {
  (args: CreateTaskArgs): Promise<Todo>;
}

const createTask: CreateTask = async ({
  todoId,
  title,
  isSessionStorage,
  loadDelay,
}) => {
  const response = await instance.post(`todos/${todoId}`, {
    title,
    isSessionStorage,
    loadDelay,
  });

  return response.data;
};

export default createTask;
