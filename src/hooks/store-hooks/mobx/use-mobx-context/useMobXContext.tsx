import { useContext } from "react";

import { RootStoreContext } from "store/mobx";

const useMobXContext = () => useContext(RootStoreContext);

export default useMobXContext;
