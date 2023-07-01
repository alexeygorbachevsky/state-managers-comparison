import { useSelector } from "react-redux";

import type { TypedUseSelectorHook } from "react-redux";

import type { RootState } from "store/react-query";

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default useAppSelector;
