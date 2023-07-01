import { useDispatch } from "react-redux";

import type { AppDispatch } from "store/redux-saga";

const useAppDispatch: () => AppDispatch = useDispatch;

export default useAppDispatch;
