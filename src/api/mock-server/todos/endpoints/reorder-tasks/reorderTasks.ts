import { rest } from "msw";

import { waitForDBInitialized, ARTIFICIAL_DELAY_MS } from "../ducks";
import { reorderTasksHelpers } from "./ducks";

const { reorderTasksSS, reorderTasksDB } = reorderTasksHelpers;

const reorderTasks = rest.put(
  "/fakeApi/tasks-reorder",
  async (req, res, ctx) => {
    await waitForDBInitialized();

    const data = await req.json();

    if (!data || data.content === "error") {
      return res(
        ctx.delay(ARTIFICIAL_DELAY_MS),
        ctx.status(500),
        ctx.json("Server error when reorder tasks!"),
      );
    }

    const { isSessionStorage, source, destination, loadDelay } = data;

    const delay = loadDelay || ARTIFICIAL_DELAY_MS;
    const args = { source, destination };
    const result = isSessionStorage
      ? reorderTasksSS(args)
      : reorderTasksDB(args);

    if (!result) {
      return res(
        ctx.delay(delay),
        ctx.status(500),
        ctx.json("Server error when reorder tasks!"),
      );
    }

    return res(
      ctx.delay(delay),
      ctx.json({
        sourceTodo: result.updatedSourceTodo,
        destinationTodo: result.updatedDestinationTodo,
      }),
    );
  },
);

export default reorderTasks;
