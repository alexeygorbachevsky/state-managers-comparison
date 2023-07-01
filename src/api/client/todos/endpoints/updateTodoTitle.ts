import type { DelaysType } from "constants/sessionStorage";
import type { Todo } from "../types";

import { instance } from "../config";

interface UpdateTodoTitleArgs {
  id: Todo["id"];
  title: Todo["title"];
  isSessionStorage: boolean;
  loadDelay: DelaysType;
}

interface UpdateTodoTitle {
  (args: UpdateTodoTitleArgs): Promise<Todo>;
}

const updateTodoTitle: UpdateTodoTitle = async ({
  id,
  title,
  isSessionStorage,
  loadDelay,
}) => {
  const response = await instance.put(`todos/${id}`, {
    title,
    isSessionStorage,
    loadDelay,
  });

  return response.data;
};

export default updateTodoTitle;
