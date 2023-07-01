import { useReducer } from "react";

import { initialStore, reducer } from "store/react-context";

const useStore = () => {
  const [store, dispatch] = useReducer(reducer, initialStore);

  return {
    ...store,
    dispatch,
  };
};

export default useStore;
