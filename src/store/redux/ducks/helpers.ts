import { PayloadAction } from "../types";

type Handlers<State> = Record<
  string,
  (state: State, action: PayloadAction<never>) => State
>;

export const createReducer =
  <State>(initialState: State, handlers: Handlers<State>) =>
  (state = initialState, action: PayloadAction<never>) => {
    if (Object.prototype.hasOwnProperty.call(handlers, action.type)) {
      return handlers[action.type](state, action);
    }
    return state;
  };
