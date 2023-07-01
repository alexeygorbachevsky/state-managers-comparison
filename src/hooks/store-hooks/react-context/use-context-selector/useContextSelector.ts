import type { Store } from "store/react-context";

import { ReactContext } from "store/react-context";

import { useContextSelector as useContextSelectorNative } from "./ducks";

const useContextSelector = <Selected>(selector: (store: Store) => Selected) =>
  useContextSelectorNative<Store, Selected>(ReactContext, selector);

export default useContextSelector;
