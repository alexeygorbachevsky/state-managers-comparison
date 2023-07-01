import type TodosStore  from "../todosStore";

import { DelaysType, SESSION_STORAGE_ITEMS } from "constants/sessionStorage";

function setLoadDelay(this: TodosStore, loadDelay: DelaysType) {
  this.loadDelay = loadDelay;

  sessionStorage.setItem(
    SESSION_STORAGE_ITEMS.loadDelay,
    JSON.stringify(loadDelay),
  );
}

export default setLoadDelay;
