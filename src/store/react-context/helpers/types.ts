import {ComponentType, MutableRefObject, ReactNode} from "react";

export type Listener<Value> = (value: Value) => void;

export type ContextValue<Value> = {
    value: MutableRefObject<Value>;
    listeners: Set<Listener<Value>>;
};

export interface ProviderArgs<Value> {
    value: Value;
    children: ReactNode;
}

export interface Context<Value> {
    Provider: ComponentType<{ value: Value; children: ReactNode }>;
    displayName?: string;
}
