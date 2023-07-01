import { useDispatch } from "react-redux";

import type { AppDispatch } from "../../../../store/redux";

const useAppDispatch: () => AppDispatch = useDispatch;

export default useAppDispatch;
