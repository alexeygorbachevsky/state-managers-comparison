import { createElement, Provider, useLayoutEffect, useRef } from "react";

import type { ContextValue, Listener, ProviderArgs } from "./types";

const createProvider = <Value>(ProviderOrig: Provider<ContextValue<Value>>) =>
  function ContextProvider({ value, children }: ProviderArgs<Value>) {
    const valueRef = useRef(value);

    const contextValue = useRef<ContextValue<Value>>({
      value: valueRef,
      listeners: new Set<Listener<Value>>(),
    });

    useLayoutEffect(() => {
      valueRef.current = value;

      contextValue.current.listeners.forEach(listener => {
        listener(value);
      });
    }, [value]);

    return createElement(
      ProviderOrig,
      { value: contextValue.current },
      children,
    );
  };

export default createProvider;
