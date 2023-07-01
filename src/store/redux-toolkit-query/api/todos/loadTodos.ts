import { nanoid } from "@reduxjs/toolkit";

import type { QueryReturnValue } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import type {
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query";

import { Todo } from "api/client";

import todosApi from "./api";
import { AppDispatch, RootState } from "../../types";
import { addAlertThunk, AlertTypes } from "../../slices/alerts";
import { todosAdapter } from "../../slices/todos";

type LoadTodosArgs = string | undefined;

interface LoadTodosReturn {
  todos: Todo[];
  isLastBatch: boolean;
}

type QueryFnReturn = QueryReturnValue<
  LoadTodosReturn,
  FetchBaseQueryError,
  FetchBaseQueryMeta
>;

export interface Entities {
  [id: string]: Todo;
}

interface LoadTodosTransformedReturn {
  entities: Entities;
  ids: Todo["id"][];
}

type QueryFnTransformedReturn = QueryReturnValue<
  LoadTodosTransformedReturn,
  FetchBaseQueryError,
  FetchBaseQueryMeta
>;

// bad typing due to https://github.com/reduxjs/redux-toolkit/issues/2191#issuecomment-1087861885
const loadTodosApi = todosApi.injectEndpoints({
  endpoints: build => ({
    loadTodos: build.query<LoadTodosTransformedReturn, LoadTodosArgs>({
      providesTags: result =>
        result
          ? [
              ...result.ids.map(id => ({ type: "Todos", id } as const)),
              { type: "Todos", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Todos', id: 'LIST' }` is invalidated
            [{ type: "Todos", id: "LIST" }],
      queryFn: async (
        search,
        queryApi,
        _extraOptions,
        baseQuery,
      ): Promise<QueryFnTransformedReturn> => {
        const getState = queryApi.getState as () => RootState;
        const dispatch = queryApi.dispatch as AppDispatch;

        const state = getState();
        const { isSessionStorage, loadDelay } = state.todos;

        let result;
        try {
          result = (await baseQuery({
            url: "todos",
            params: {
              batchSize: 100,
              search,
              isSessionStorage,
              loadDelay,
            },
          })) as QueryFnReturn;
        } catch (error) {
          dispatch(
            addAlertThunk({
              id: nanoid(),
              message: "Error is occurred - unable to load todos.",
              type: AlertTypes.error,
            }),
          );

          return {
            error,
          } as QueryFnTransformedReturn;
        }

        return {
          ...result,
          data: todosAdapter.setAll(
            todosAdapter.getInitialState(),
            result.data!.todos,
          ),
        } as QueryFnTransformedReturn;
      },
    }),
  }),
});

export default loadTodosApi;
