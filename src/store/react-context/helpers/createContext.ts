import { createContext as createContextOrig } from "react";

import type { ContextValue, Context } from "./types";

import createProvider from "./createProvider";

const createContext = <Value>(defaultValue: Value) => {
  const context = createContextOrig<ContextValue<Value>>({
    value: { current: defaultValue },
    listeners: new Set(),
  });

  (context as Context<Value>).Provider = createProvider(context.Provider);

  // eslint-disable-next-line
  delete (context as any).Consumer; // no support for Consumer

  return context as Context<Value>;
};

export default createContext;
