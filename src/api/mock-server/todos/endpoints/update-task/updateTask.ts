import { rest } from "msw";

import { waitForDBInitialized, ARTIFICIAL_DELAY_MS } from "../ducks";
import { updateTaskHelpers } from "./ducks";

const { updateTaskSS, updateTaskDB } = updateTaskHelpers;

const updateTask = rest.put(
  "/fakeApi/todos/:todoId/tasks/:taskId",
  async (req, res, ctx) => {
    await waitForDBInitialized();

    const todoId = req.params.todoId as string;
    const id = req.params.taskId as string;

    const data = await req.json();

    if (!data || data.content === "error") {
      return res(
        ctx.delay(ARTIFICIAL_DELAY_MS),
        ctx.status(500),
        ctx.json("Server error updating this task!"),
      );
    }

    const { isSessionStorage, loadDelay, ...taskData } = data;

    const delay = loadDelay || ARTIFICIAL_DELAY_MS;

    const args = { todoId, id, taskData };
    const serializedTodo = isSessionStorage
      ? updateTaskSS(args)
      : updateTaskDB(args);

    if (!serializedTodo) {
      return res(
        ctx.delay(delay),
        ctx.status(500),
        ctx.json("Server error updating this task!"),
      );
    }

    return res(ctx.delay(delay), ctx.json(serializedTodo));
  },
);

export default updateTask;
