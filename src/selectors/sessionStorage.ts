import { DELAYS, SESSION_STORAGE_ITEMS } from "constants/sessionStorage";

export const getIsTodosSessionStorage = () => {
  let isTodosSessionStorage = true;

  try {
    const isSessionStorageFromSS = JSON.parse(
      sessionStorage.getItem(SESSION_STORAGE_ITEMS.isTodosSessionStorage) ||
        JSON.stringify(isTodosSessionStorage),
    );

    if (typeof isSessionStorageFromSS === "boolean") {
      isTodosSessionStorage = isSessionStorageFromSS;
    } else {
      throw new Error("Incorrect value of isTodosSessionStorage");
    }
  } catch (e) {
    sessionStorage.setItem(
      SESSION_STORAGE_ITEMS.isTodosSessionStorage,
      JSON.stringify(isTodosSessionStorage),
    );
  }

  return isTodosSessionStorage;
};

export const getLoadDelay = () => {
  let loadDelay = DELAYS[1];

  try {
    const loadDelayFromSS = JSON.parse(
      sessionStorage.getItem(SESSION_STORAGE_ITEMS.loadDelay) ??
        JSON.stringify(loadDelay),
    );

    if (DELAYS.includes(loadDelayFromSS)) {
      loadDelay = loadDelayFromSS;
    } else {
      throw new Error("Incorrect value of loadDelay");
    }
  } catch (e) {
    sessionStorage.setItem(
      SESSION_STORAGE_ITEMS.loadDelay,
      JSON.stringify(loadDelay),
    );
  }

  return loadDelay;
};
