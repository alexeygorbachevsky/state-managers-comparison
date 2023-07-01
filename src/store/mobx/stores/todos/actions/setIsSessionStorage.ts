import type TodosStore  from "../todosStore";

import { SESSION_STORAGE_ITEMS } from "constants/sessionStorage";

function setIsSessionStorage(this: TodosStore, isSessionStorage: boolean) {
  this.isSessionStorage = isSessionStorage;

  sessionStorage.setItem(
    SESSION_STORAGE_ITEMS.isTodosSessionStorage,
    JSON.stringify(isSessionStorage),
  );

  window.location.reload();
}

export default setIsSessionStorage;
