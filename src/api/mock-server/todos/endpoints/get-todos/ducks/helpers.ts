import type { ClientTodo } from "../../ducks";
import type { Todo } from "api/mock-server/todos/db";

import db from "api/mock-server/todos/db";
import {
  serializeTodo,
  TODOS_STORAGE_KEY,
  getTodosSafelyFromSS,
} from "../../ducks";

interface GetTodosFromDB {
  cursor: string | null;
  batchSize: string | null;
  search: string | null;
}

interface GetTodosFromDBOverload {
  (param: GetTodosFromDB): ClientTodo[];

  (param: Pick<GetTodosFromDB, "search">): ClientTodo[];
}

interface GeneralArgs {
  cursor?: string | null;
  batchSize?: string | null;
  search: string | null;
}

export const getTodosFromDB: GetTodosFromDBOverload = (
  options: GeneralArgs,
) => {
  const { cursor, batchSize, search } = options;

  const take = Number(batchSize);

  return db.todo
    .findMany({
      orderBy: { index: "desc" },
      cursor: cursor || null,
      take,
      // ...(page &&
      //   batchSize && {
      //     skip: numberPage * numberBatchSize - numberBatchSize,
      //     take: numberBatchSize,
      //   }),
      ...(search && {
        where: {
          title: {
            contains: search,
          },
        },
      }),
    })
    .map(serializeTodo) as ClientTodo[];
};

interface GetTasksSSArgs {
  batchSize?: string;
  cursor?: string | null;
  search: string | null;
  generatedTodos: ClientTodo[];
}

interface GetTasksSSReturn {
  todos: ClientTodo[];
  allTodos?: ClientTodo[];
}

export const getTodosFromSS = ({
  batchSize,
  search,
  cursor,
  generatedTodos,
}: GetTasksSSArgs): GetTasksSSReturn => {
  let storageTodos = getTodosSafelyFromSS();
  let todos;

  if (!batchSize) {
    if (storageTodos.length) {
      todos = storageTodos.filter((todo: Todo) => {
        if (search) {
          return todo.title.includes(search);
        }
        return true;
      });
    } else {
      todos = generatedTodos;
      sessionStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(generatedTodos));
    }

    return { todos };
  }

  if (storageTodos.length) {
    todos = storageTodos;

    if (search) {
      todos = todos.filter((todo: Todo) => todo.title.includes(search));
    }

    let firstIndex = 0;
    if (cursor) {
      firstIndex = todos.findIndex((todo: ClientTodo) => todo.id === cursor);
    }

    todos = todos.slice(
      firstIndex ? firstIndex + 1 : 0,
      firstIndex + Number(batchSize) + 1,
    );
  } else {
    todos = generatedTodos;

    const allTodos = db.todo.findMany({
      orderBy: { index: "desc" },
    });

    const serializedAllTodos = allTodos.map((newTodo: Todo) =>
      serializeTodo(newTodo),
    );

    sessionStorage.setItem(
      TODOS_STORAGE_KEY,
      JSON.stringify(serializedAllTodos),
    );

    storageTodos = serializedAllTodos;
  }

  if (search) {
    storageTodos = storageTodos.filter((todo: Todo) =>
      todo.title.includes(search),
    );
  }

  return { todos, allTodos: storageTodos };
};
