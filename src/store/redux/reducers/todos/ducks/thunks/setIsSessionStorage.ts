import type { ReduxThunk } from "../../../../types";

import { SESSION_STORAGE_ITEMS } from "constants/sessionStorage";

import actionTypes from "../actionTypes";

export const setIsSessionStorageAction = (isSessionStorage: boolean) => ({
  type: actionTypes.SET_IS_SESSION_STORAGE,
  payload: isSessionStorage,
});

const setIsSessionStorage =
  (isSessionStorage: boolean): ReduxThunk =>
  dispatch => {
    dispatch(setIsSessionStorageAction(isSessionStorage));

    sessionStorage.setItem(
      SESSION_STORAGE_ITEMS.isTodosSessionStorage,
      JSON.stringify(isSessionStorage),
    );

    window.location.reload();
  };

export default setIsSessionStorage;
