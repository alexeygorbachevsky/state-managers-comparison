import { rest } from "msw";

import { waitForDBInitialized, ARTIFICIAL_DELAY_MS } from "../ducks";
import { removeTaskHelpers } from "./ducks";

const { removeTaskFromDB, removeTaskFromSS } = removeTaskHelpers;

const removeTask = rest.delete(
  "/fakeApi/todos/:todoId/tasks/:taskId",
  async (req, res, ctx) => {
    await waitForDBInitialized();

    const todoId = req.params.todoId as string;
    const taskId = req.params.taskId as string;
    const isSessionStorage = JSON.parse(
      req.url.searchParams.get("isSessionStorage") || "true",
    );
    const loadDelay = JSON.parse(
      req.url.searchParams.get("loadDelay") || String(ARTIFICIAL_DELAY_MS),
    );

    const args = { taskId, todoId };
    const serializedTodo = isSessionStorage
      ? removeTaskFromSS(args)
      : removeTaskFromDB(args);

    if (!serializedTodo) {
      return res(
        ctx.delay(loadDelay),
        ctx.status(500),
        ctx.json("Server error removing this task!"),
      );
    }

    return res(ctx.delay(loadDelay), ctx.json(serializedTodo));
  },
);

export default removeTask;
