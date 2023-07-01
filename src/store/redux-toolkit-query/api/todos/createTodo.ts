import { nanoid } from "@reduxjs/toolkit";

import type { QueryReturnValue } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import type {
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";
import type { Todo } from "api/client";

import todosApi from "./api";
import { AppDispatch, RootState } from "../../types";
import {
  addAlertThunk,
  ALERT_DEFAULT_TIMEOUT,
  AlertTypes,
} from "../../slices/alerts";
import { todosAdapter } from "../../slices/todos";
import loadTodosApi from "./loadTodos";

type Title = Todo["title"];

type QueryFnReturn = QueryReturnValue<
  Todo,
  FetchBaseQueryError,
  FetchBaseQueryMeta
>;

// bad typing due to https://github.com/reduxjs/redux-toolkit/issues/2191#issuecomment-1087861885
const createTodoApi = todosApi.injectEndpoints({
  endpoints: build => ({
    createTodo: build.mutation<Todo, Title>({
      // Invalidates all Todos-type queries providing the `LIST` id - after all, depending of the sort order,
      // that newly created post could show up in any lists.
      invalidatesTags: [{ type: "Todos", id: "LIST" }],
      queryFn: async (
        title,
        queryApi,
        _extraOptions,
        baseQuery,
      ): Promise<QueryFnReturn> => {
        const getState = queryApi.getState as () => RootState;
        const dispatch = queryApi.dispatch as AppDispatch;

        const { isSessionStorage, loadDelay } = getState().todos;

        let result: QueryFnReturn;
        try {
          result = (await baseQuery({
            url: "todos",
            method: "POST",
            body: { title, isSessionStorage, loadDelay },
          })) as QueryFnReturn;
        } catch (error) {
          dispatch(
            addAlertThunk({
              id: nanoid(),
              message: "Error is occurred - unable to create todo.",
              type: AlertTypes.error,
            }),
          );

          return { error } as QueryFnReturn;
        }

        dispatch(
          loadTodosApi.util.updateQueryData(
            "loadTodos",
            getState().todos.search,
            draft => {
              todosAdapter.addOne(draft, result.data!);
            },
          ),
        );

        dispatch(
          addAlertThunk({
            id: nanoid(),
            message: `Todo "${title}" is successfully created`,
            type: AlertTypes.success,
            timeout: ALERT_DEFAULT_TIMEOUT,
          }),
        );

        return result as QueryFnReturn;
      },
    }),
  }),
});

export default createTodoApi;
