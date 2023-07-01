import actionTypes from "./actionTypes";
import { Store } from "../types";

interface SetSearch {
  dispatch: Store["dispatch"];
  search: string;
}

export const setSearch = ({ dispatch, search }: SetSearch) => {
  dispatch({
    type: actionTypes.SET_SEARCH,
    payload: search,
  });
};

export const clearTodos = (dispatch: Store["dispatch"]) => {
  dispatch({
    type: actionTypes.CLEAR_TODOS,
  });
};
