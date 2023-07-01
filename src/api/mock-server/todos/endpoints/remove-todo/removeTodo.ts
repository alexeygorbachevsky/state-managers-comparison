import { rest } from "msw";

import { waitForDBInitialized, ARTIFICIAL_DELAY_MS } from "../ducks";
import { removeTodoHelpers } from "./ducks";

const { removeTodoFromDB, removeTodoFromSS } = removeTodoHelpers;

const removeTodo = rest.delete(
  "/fakeApi/todos/:todoId",
  async (req, res, ctx) => {
    await waitForDBInitialized();

    const id = req.params.todoId as string;
    const isSessionStorage = JSON.parse(
      req.url.searchParams.get("isSessionStorage") || "true",
    );
    const loadDelay = JSON.parse(
      req.url.searchParams.get("loadDelay") || String(ARTIFICIAL_DELAY_MS),
    );

    const serializedTodo = isSessionStorage
      ? removeTodoFromSS(id)
      : removeTodoFromDB(id);

    if (!serializedTodo) {
      return res(
        ctx.delay(loadDelay),
        ctx.status(500),
        ctx.json("Server error removing this todo!"),
      );
    }

    return res(ctx.delay(loadDelay), ctx.json(serializedTodo));
  },
);

export default removeTodo;
