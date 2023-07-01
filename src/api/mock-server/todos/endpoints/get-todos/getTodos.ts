import { rest } from "msw";

import type { ClientTodo } from "../ducks";
import type { Todo } from "../../db";

import db from "../../db";

import {
  waitForDBInitialized,
  ARTIFICIAL_DELAY_MS,
  TODOS_STORAGE_KEY,
} from "../ducks";

import { getTodosHelpers } from "./ducks";

const { getTodosFromSS, getTodosFromDB } = getTodosHelpers;

const getTodo = rest.get("/fakeApi/todos", async (req, res, ctx) => {
  await waitForDBInitialized();

  const cursor = req.url.searchParams.get("cursor");
  const search = req.url.searchParams.get("search");
  const batchSize = req.url.searchParams.get("batchSize");
  const isSessionStorage = JSON.parse(
    req.url.searchParams.get("isSessionStorage") || "true",
  );
  const loadDelay = JSON.parse(
    req.url.searchParams.get("loadDelay") || String(ARTIFICIAL_DELAY_MS),
  );

  if (!isSessionStorage) {
    sessionStorage.removeItem(TODOS_STORAGE_KEY);
  }

  let todos: ClientTodo[];
  let isLastBatch;

  if (!batchSize) {
    todos = getTodosFromDB({ search });
    isLastBatch = true;

    if (isSessionStorage) {
      const result = getTodosFromSS({ search, generatedTodos: todos });
      todos = result.todos;
    }
  } else {
    todos = getTodosFromDB({ cursor, batchSize, search });

    let allTodos: ClientTodo[] | Todo[] = db.todo.findMany({
      orderBy: { index: "desc" },
      ...(search && { where: { title: { contains: search } } }),
    });

    if (isSessionStorage) {
      const result = getTodosFromSS({
        search,
        cursor,
        batchSize,
        generatedTodos: todos,
      });
      todos = result.todos;
      allTodos = result.allTodos as ClientTodo[];
    }

    if (!allTodos.length) {
      isLastBatch = true;
    } else {
      isLastBatch =
        allTodos[allTodos.length - 1].id === todos[todos.length - 1].id;
    }
  }

  return res(ctx.delay(loadDelay), ctx.json({ todos, isLastBatch }));
});

export default getTodo;
