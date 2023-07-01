import { rest } from "msw";

import { waitForDBInitialized, ARTIFICIAL_DELAY_MS } from "../ducks";
import { updateTodoTitleHelpers } from "./ducks";

const { updateTodoTitleDB, updateTodoTitleSS } = updateTodoTitleHelpers;

const updateTodoTitle = rest.put(
  "/fakeApi/todos/:todoId",
  async (req, res, ctx) => {
    await waitForDBInitialized();

    const id = req.params.todoId as string;

    const data = await req.json();

    if (!data || data.content === "error") {
      return res(
        ctx.delay(ARTIFICIAL_DELAY_MS),
        ctx.status(500),
        ctx.json("Server error creating this todo!"),
      );
    }

    const { isSessionStorage, loadDelay, ...todoData } = data;

    const delay = loadDelay || ARTIFICIAL_DELAY_MS;

    const args = { id, todoData };
    const serializedTodo = isSessionStorage
      ? updateTodoTitleSS(args)
      : updateTodoTitleDB(args);

    if (!serializedTodo) {
      return res(
        ctx.delay(delay),
        ctx.status(500),
        ctx.json("Server error updating this todo title!"),
      );
    }

    return res(ctx.delay(delay), ctx.json(serializedTodo));
  },
);

export default updateTodoTitle;
