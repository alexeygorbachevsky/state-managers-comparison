import { useSelector } from "react-redux";

import type { TypedUseSelectorHook } from "react-redux";

import { RootState } from "../../../../store/redux";

export const useReduxSelector: TypedUseSelectorHook<RootState> = useSelector;

export default useReduxSelector;
