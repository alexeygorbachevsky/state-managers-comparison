import { createContext } from "react";

export enum CONTEXT {
  reactContext = "React context",
}

export enum QUERY_MANAGERS {
  reduxToolkitQuery = "Redux toolkit query",
  reactQuery = "React query",
  // swr = "SWR",
}

export enum STATE_MANAGERS {
  reduxToolkit = "Redux toolkit",
  redux = "Redux",
  reduxSaga = "Redux saga",
  mobX = "MobX",
  // effector = "Effector",
  // recoil = "Recoil",
  // selfWrittenRedux="Self-written Redux"
  // jotai="Jotai"
  // zustand="Zustand"
}

export const stateAndQueryManagers = {
  ...STATE_MANAGERS,
  ...QUERY_MANAGERS,
  ...CONTEXT,
};

export type STATE_AND_QUERY_MANAGERS_TYPE =
  | STATE_MANAGERS
  | QUERY_MANAGERS
  | CONTEXT;

export type STATE_AND_QUERY_MANAGERS_OPTION_TYPE = {
  id: number;
  label: STATE_AND_QUERY_MANAGERS_TYPE;
  group: string;
};

export type STATE_AND_QUERY_MANAGERS_OPTIONS_TYPE = Record<
  STATE_AND_QUERY_MANAGERS_TYPE,
  STATE_AND_QUERY_MANAGERS_OPTION_TYPE
>;

const getGroupName = (key: string, value: STATE_AND_QUERY_MANAGERS_TYPE) => {
  switch (value) {
    case QUERY_MANAGERS[key as keyof typeof QUERY_MANAGERS]: {
      return "Query managers";
    }

    case CONTEXT[key as keyof typeof CONTEXT]: {
      return "Context";
    }

    default: {
      return "State managers";
    }
  }
};

export const STATE_AND_QUERY_MANAGERS_OPTIONS: STATE_AND_QUERY_MANAGERS_OPTIONS_TYPE =
  Object.entries(stateAndQueryManagers).reduce((memo, [key, value], index) => {
    memo[value] = {
      id: index + 1,
      label: value,
      group: getGroupName(key, value),
    } as STATE_AND_QUERY_MANAGERS_OPTION_TYPE;

    return memo;
  }, {} as STATE_AND_QUERY_MANAGERS_OPTIONS_TYPE);

export const STATE_MANAGERS_OPTIONS_LIST = Object.values(
  STATE_AND_QUERY_MANAGERS_OPTIONS,
);

export const DEFAULT_STATE_MANAGERS_NAME = STATE_MANAGERS.reduxToolkit;

export const DEFAULT_STATE_MANAGERS_OPTION =
  STATE_AND_QUERY_MANAGERS_OPTIONS[DEFAULT_STATE_MANAGERS_NAME];

export const StateManagersContext = createContext(DEFAULT_STATE_MANAGERS_NAME);
