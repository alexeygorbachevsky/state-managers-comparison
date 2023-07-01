import { rest } from "msw";

import { waitForDBInitialized, ARTIFICIAL_DELAY_MS } from "../ducks";
import { createTaskHelpers } from "./ducks";

const { createTodoSS, createTodoDB } = createTaskHelpers;

const createTask = rest.post(
  "/fakeApi/todos/:todoId",
  async (req, res, ctx) => {
    await waitForDBInitialized();

    const todoId = req.params.todoId as string;
    const data = await req.json();

    if (!data || data.content === "error") {
      return res(
        ctx.delay(ARTIFICIAL_DELAY_MS),
        ctx.status(500),
        ctx.json("Server error creating this task!"),
      );
    }

    const { isSessionStorage, loadDelay, ...taskData } = data;

    taskData.date = Date();
    taskData.isChecked = false;

    const args = { todoId, taskData };
    const serializedTodo = isSessionStorage
      ? createTodoSS(args)
      : createTodoDB(args);

    return res(
      ctx.delay(loadDelay || ARTIFICIAL_DELAY_MS),
      ctx.json(serializedTodo),
    );
  },
);

export default createTask;
