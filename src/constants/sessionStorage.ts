export const SESSION_STORAGE_ITEMS = {
    stateManagerName: "state-managers/stateManagerName",
    isTodosSessionStorage: "state-managers/isTodosSessionStorage",
    loadDelay: "state-managers/loadDelay",
};

export const DELAYS = [0, 1000, 2000, 3000, 4000, 5000] as const;

export type DelaysType = typeof DELAYS[number];
