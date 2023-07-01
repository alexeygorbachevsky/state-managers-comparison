import type { DelaysType } from "constants/sessionStorage";
import type { Todo, Task } from "../types";

import { instance } from "../config";

interface UpdateTaskArgs {
  todoId: Todo["id"];
  id: Task["id"];
  title?: Task["title"];
  isChecked?: Task["isChecked"];
  isSessionStorage: boolean;
  loadDelay: DelaysType;
}

interface UpdateTask {
  (args: UpdateTaskArgs): Promise<Todo>;
}

const updateTask: UpdateTask = async ({
  id,
  todoId,
  title,
  isChecked,
  isSessionStorage,
  loadDelay,
}) => {
  const response = await instance.put(`todos/${todoId}/tasks/${id}`, {
    title,
    isChecked,
    isSessionStorage,
    loadDelay,
  });

  return response.data;
};

export default updateTask;
