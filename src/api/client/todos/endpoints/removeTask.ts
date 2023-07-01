import { stringify } from "query-string";

import type { Todo, Task } from "api/client";
import type { DelaysType } from "constants/sessionStorage";

import { instance } from "../config";

interface RemoveTaskArgs {
  todoId: Todo["id"];
  id: Task["id"];
  isSessionStorage: boolean;
  loadDelay: DelaysType;
}

interface RemoveTask {
  (args: RemoveTaskArgs): Promise<Todo>;
}

const removeTask: RemoveTask = async ({
  todoId,
  id,
  isSessionStorage,
  loadDelay,
}) => {
  const queryString = stringify({
    isSessionStorage,
    loadDelay,
  });

  const response = await instance.delete(
    `todos/${todoId}/tasks/${id}?${queryString}`,
  );

  return response.data;
};

export default removeTask;
