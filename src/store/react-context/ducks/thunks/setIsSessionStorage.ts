import { SESSION_STORAGE_ITEMS } from "constants/sessionStorage";

import actionTypes from "../actionTypes";
import { Store } from "../../types";

interface SetIsSessionStorage {
  dispatch: Store["dispatch"];
  isSessionStorage: Store["isSessionStorage"];
}

export const setIsSessionStorage = ({
  dispatch,
  isSessionStorage,
}: SetIsSessionStorage) => {
  dispatch({
    type: actionTypes.SET_IS_SESSION_STORAGE,
    payload: isSessionStorage,
  });

  sessionStorage.setItem(
    SESSION_STORAGE_ITEMS.isTodosSessionStorage,
    JSON.stringify(isSessionStorage),
  );

  window.location.reload();
};

export default setIsSessionStorage;
