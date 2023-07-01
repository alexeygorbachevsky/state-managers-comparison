import { DelaysType, SESSION_STORAGE_ITEMS } from "constants/sessionStorage";

import { ReduxThunk } from "../../../../types";

import actionTypes from "../actionTypes";

export const setLoadDelayAction = (loadDelay: DelaysType) => ({
  type: actionTypes.SET_LOAD_DELAY,
  payload: loadDelay,
});

const setLoadDelay =
  (loadDelay: DelaysType): ReduxThunk =>
  dispatch => {
    dispatch(setLoadDelayAction(loadDelay));

    sessionStorage.setItem(
      SESSION_STORAGE_ITEMS.loadDelay,
      JSON.stringify(loadDelay),
    );
  };

export default setLoadDelay;
