import { SESSION_STORAGE_ITEMS } from "constants/sessionStorage";

import actionTypes from "../actionTypes";
import { Store } from "../../types";

interface SetLoadDelay {
  dispatch: Store["dispatch"];
  loadDelay: Store["loadDelay"];
}

export const setLoadDelay = ({ dispatch, loadDelay }: SetLoadDelay) => {
  dispatch({ type: actionTypes.SET_LOAD_DELAY, payload: loadDelay });

  sessionStorage.setItem(
    SESSION_STORAGE_ITEMS.loadDelay,
    JSON.stringify(loadDelay),
  );
};

export default setLoadDelay;
