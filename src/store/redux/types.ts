import { Action, AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { default as store } from "./store";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export interface PayloadAction<P> extends Action<string> {
  payload: P;
}

export type ReduxThunk<
  ReturnType = void, // Return type of the thunk function
  State = RootState, // state type used by getState
  Extra = unknown, // any "extra argument" injected into the thunk
  ActionType extends Action = AnyAction, // known types of actions that can be dispatched
> = (
  dispatch: ThunkDispatch<State, Extra, ActionType>,
  getState: () => State,
  extraArgument: Extra,
) => ReturnType;
