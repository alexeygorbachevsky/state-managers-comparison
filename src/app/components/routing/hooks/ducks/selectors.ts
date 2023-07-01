import { SESSION_STORAGE_ITEMS } from "constants/sessionStorage";
import {
  DEFAULT_STATE_MANAGERS_NAME,
  STATE_AND_QUERY_MANAGERS_TYPE,
  stateAndQueryManagers,
} from "constants/state-managers";

export const getDefaultStateManager = () => {
  const sessionStateManagerName = sessionStorage.getItem(
    SESSION_STORAGE_ITEMS.stateManagerName,
  ) as STATE_AND_QUERY_MANAGERS_TYPE;

  if (Object.values(stateAndQueryManagers).includes(sessionStateManagerName)) {
    return sessionStateManagerName;
  }

  sessionStorage.setItem(
    SESSION_STORAGE_ITEMS.stateManagerName,
    DEFAULT_STATE_MANAGERS_NAME,
  );

  return DEFAULT_STATE_MANAGERS_NAME;
};
