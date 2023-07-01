import { rest } from "msw";

import { waitForDBInitialized, ARTIFICIAL_DELAY_MS } from "../ducks";
import { reorderTodosHelpers } from "./ducks";

const { reorderTodosSS, reorderTodosDB } = reorderTodosHelpers;

const reorderTodos = rest.put(
  "/fakeApi/todos-reorder",
  async (req, res, ctx) => {
    await waitForDBInitialized();

    const data = await req.json();

    if (!data || data.content === "error") {
      return res(
        ctx.delay(ARTIFICIAL_DELAY_MS),
        ctx.status(500),
        ctx.json("Server error creating this todo!"),
      );
    }

    const { isSessionStorage, ids, loadDelay } = data;

    if (isSessionStorage) {
      reorderTodosSS(ids);
    } else {
      reorderTodosDB(ids);
    }

    return res(
      ctx.delay(loadDelay || ARTIFICIAL_DELAY_MS),
      ctx.json({
        ids,
      }),
    );
  },
);

export default reorderTodos;
