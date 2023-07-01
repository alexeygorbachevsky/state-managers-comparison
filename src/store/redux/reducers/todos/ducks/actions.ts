import actionTypes from "./actionTypes";

export const clearTodos = () => ({ type: actionTypes.CLEAR_TODOS });

export const setSearch = (search: string) => ({
  type: actionTypes.SET_SEARCH,
  payload: search,
});
