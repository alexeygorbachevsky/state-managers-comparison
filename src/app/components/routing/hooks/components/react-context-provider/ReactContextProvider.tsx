import { FC, PropsWithChildren } from "react";

import { ReactContext } from "store/react-context";

import { useStore } from "./hooks";

const ReactContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const store = useStore();

  return (
    <ReactContext.Provider value={store}>{children}</ReactContext.Provider>
  );
};

export default ReactContextProvider;
