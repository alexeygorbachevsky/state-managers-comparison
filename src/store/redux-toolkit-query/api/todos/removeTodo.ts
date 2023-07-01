import { nanoid } from "@reduxjs/toolkit";
import { stringify } from "query-string";

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
import loadTodosApi from "./loadTodos";
import { todosAdapter } from "../../slices/todos";

type QueryFnReturn = QueryReturnValue<
  Todo,
  FetchBaseQueryError,
  FetchBaseQueryMeta
>;

// bad typing due to https://github.com/reduxjs/redux-toolkit/issues/2191#issuecomment-1087861885
const removeTodoApi = todosApi.injectEndpoints({
  endpoints: build => ({
    removeTodo: build.mutation<Todo, Todo["id"]>({
      // Invalidates all Todos-type queries providing the `LIST` id - after all, depending of the sort order,
      // that newly created post could show up in any lists.
      invalidatesTags: [{ type: "Todos", id: "LIST" }],
      queryFn: async (
        id,
        queryApi,
        _extraOptions,
        baseQuery,
      ): Promise<QueryFnReturn> => {
        const getState = queryApi.getState as () => RootState;
        const dispatch = queryApi.dispatch as AppDispatch;

        const { isSessionStorage, loadDelay } = getState().todos;

        const queryString = stringify({
          isSessionStorage,
          loadDelay,
        });

        let result: QueryFnReturn;
        try {
          result = (await baseQuery({
            url: `todos/${id}?${queryString}`,
            method: "DELETE",
          })) as QueryFnReturn;
        } catch (error) {
          dispatch(
            addAlertThunk({
              id: nanoid(),
              message: "Error is occurred - unable to remove todo.",
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
              todosAdapter.removeOne(draft, result.data!.id);
            },
          ),
        );

        dispatch(
          addAlertThunk({
            id: nanoid(),
            message: `Todo "${result.data!.title}" is successfully removed`,
            type: AlertTypes.success,
            timeout: ALERT_DEFAULT_TIMEOUT,
          }),
        );

        return result as QueryFnReturn;
      },
    }),
  }),
});

export default removeTodoApi;
