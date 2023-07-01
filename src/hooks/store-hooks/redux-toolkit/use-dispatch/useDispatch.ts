import { useDispatch } from "react-redux";

import type { AppDispatch } from "../../../../store/redux-toolkit";

const useAppDispatch: () => AppDispatch = useDispatch;

export default useAppDispatch;
