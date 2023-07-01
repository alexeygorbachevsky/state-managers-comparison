import { useRef, useState, useEffect } from "react";
import debounce from "lodash/debounce";

const useResizeWindow = (debounceDelay = 100) => {
  const prevSizesRef = useRef<{ width: number; height: number } | null>(null);
  const [sizes, setSizes] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handler = debounce(({ target }) => {
      prevSizesRef.current = sizes;
      setSizes({ width: target.innerWidth, height: target.innerHeight });
    }, debounceDelay);

    window.addEventListener("resize", handler);

    return () => window.removeEventListener("resize", handler);
  }, []);

  return [sizes, prevSizesRef.current];
};

export default useResizeWindow;
