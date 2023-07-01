import { useContext } from "react";

import { StateManagersContext } from "constants/state-managers";

const useStateManagersContext = () => useContext(StateManagersContext);

export default useStateManagersContext;
