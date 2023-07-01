import {
  Context as ContextOrig,
  useContext as useContextOrig,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import type { Context, ContextValue } from "store/react-context/helpers/types";

// 1
// useReducer and useState behave differently in React 18
// https://twitter.com/dai_shi/status/1534170089981100032
// https://codesandbox.io/s/jolly-haibt-qqykok?file=/src/App.js
// 2
// https://github.com/dai-shi/use-context-selector
// https://dev.to/romaintrotard/use-context-selector-demystified-4f8e
function useContextSelector<Value, Selected>(
  context: Context<Value>,
  selector: (value: Value) => Selected,
) {
  const {
    value: { current: value },
    listeners: listeners,
  } = useContextOrig(context as ContextOrig<Value>) as ContextValue<Value>;

  const [selectedValue, setSelectedValue] = useState(() => selector(value));

  const selectorRef = useRef(selector);

  useLayoutEffect(() => {
    selectorRef.current = selector;
  }, [selector]);

  useLayoutEffect(() => {
    const dispatchValue = (newStoreValue: Value) => {
      const newSelectedValue = selectorRef.current(newStoreValue);

      // TODO
      if (Object.is(selectedValue, newSelectedValue)) {
        return;
      }

      // Use the callback to be able to handle callback value too
      // Otherwise it will the selected callback
      setSelectedValue(() => newSelectedValue);
    };

    listeners.add(dispatchValue);
    return () => {
      listeners.delete(dispatchValue);
    };
  }, [listeners, value]);

  return selectedValue;
}

export default useContextSelector;
