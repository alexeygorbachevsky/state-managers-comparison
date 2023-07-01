import { rest } from "msw";

import type { ClientTodo } from "../ducks";

import db from "../../db";
import {
  waitForDBInitialized,
  ARTIFICIAL_DELAY_MS,
  serializeTodo,
  TODOS_STORAGE_KEY,
  getTodosSafelyFromSS,
} from "../ducks";

const createTodo = rest.post("/fakeApi/todos", async (req, res, ctx) => {
  await waitForDBInitialized();

  const data = await req.json();

  if (!data || data.content === "error") {
    return res(
      ctx.delay(ARTIFICIAL_DELAY_MS),
      ctx.status(500),
      ctx.json("Server error creating this todo!"),
    );
  }

  const { isSessionStorage, loadDelay, ...todoData } = data;

  todoData.date = Date();
  let lastIndex = 0;

  const todosFromSS = getTodosSafelyFromSS();

  if (isSessionStorage) {
    if (todosFromSS.length) {
      todosFromSS.forEach((todo: ClientTodo) => {
        if (todo.index > lastIndex) {
          lastIndex = todo.index;
        }
      });
    }
  } else {
    const allTodos = db.todo.getAll();
    allTodos.forEach(todo => {
      if (todo.index > lastIndex) {
        lastIndex = todo.index;
      }
    });
  }

  todoData.index = lastIndex + 1;

  const todo = db.todo.create(todoData);
  const serializedTodo = serializeTodo(todo);

  if (isSessionStorage) {
    sessionStorage.setItem(
      TODOS_STORAGE_KEY,
      JSON.stringify([serializedTodo, ...todosFromSS]),
    );
  }

  return res(
    ctx.delay(loadDelay || ARTIFICIAL_DELAY_MS),
    ctx.json(serializedTodo),
  );
});

export default createTodo;
