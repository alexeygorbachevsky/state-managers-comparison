import { ReactNode, useEffect, useState } from "react";

import { createContext } from "store/react-context/helpers";
import { useContextSelector as useContextSelectorNative } from "hooks/store-hooks/react-context/use-context-selector/ducks";

export interface StoreExample {
    count: number;
    count2: number;
    setCount: (count: number) => void;
    setCount2: (count: number) => void;
}

const useContextSelectorExample = <Selected,>(
  selector: (store: StoreExample) => Selected,
) =>
  useContextSelectorNative<StoreExample, Selected>(
    ReactContextExample,
    selector,
  );

const initialStoreExample: StoreExample = {
  count: 0,
  count2: 0,
  setCount: () => {},
  setCount2: () => {},
};

export const ReactContextExample =
  createContext<StoreExample>(initialStoreExample);

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [count, setCount] = useState(0);
  const [count2, setCount2] = useState(0);

  const store: StoreExample = { count, count2, setCount, setCount2 };

  return (
    <ReactContextExample.Provider value={store}>
      {children}
    </ReactContextExample.Provider>
  );
};

const Wrapper = ({ children }: { children: ReactNode }) => {
  console.log("Wrapper");
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      {children}
    </div>
  );
};
const First = () => {
  console.log("First");

  const count = useContextSelectorExample(state => state.count);
  const setCount = useContextSelectorExample(state => state.setCount);

  console.log("count", count);

  return (
    <div style={{ marginBottom: "20px" }}>
      First
      <div>Count: {count}</div>
      <button onClick={() => setCount(count + 1)}>First</button>
    </div>
  );
};
const Second = () => {
  console.log("Second");

  const count2 = useContextSelectorExample<number>(state => state.count2);
  const setCount2 = useContextSelectorExample<(count: number) => void>(
    state => state.setCount2,
  );
  console.log("count2", count2);
  return (
    <div style={{ marginBottom: "20px" }}>
      {" "}
      Second
      <div>Count2: {count2}</div>
      <button onClick={() => setCount2(count2 + 1)}>Third</button>
    </div>
  );
};

const ThirdNested = () => {
  console.log("ThirdNested");
  return <div>ThirdNested</div>;
};

const Third = () => {
  console.log("Third");

  useEffect(() => {
    console.log("Third useEffect");
  });

  const count = useContextSelectorExample(state => state.count);
  const setCount = useContextSelectorExample(state => state.setCount);

  console.log("count", count);
  return (
    <>
      {" "}
      Third
      <div>Count: {count}</div>
      <button onClick={() => setCount(count + 1)}>First</button>
      <ThirdNested />
    </>
  );
};

const ReactContextExampleComponent = () => (
  <ContextProvider>
    <Wrapper>
      <First />
      <Second />
      <Third />
    </Wrapper>
  </ContextProvider>
);

export default ReactContextExampleComponent;
