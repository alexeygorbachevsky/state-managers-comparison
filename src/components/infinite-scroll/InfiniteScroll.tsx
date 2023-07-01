import { FC, useCallback, useEffect, useRef } from "react";
import { CircularProgress } from "@mui/material";

import styles from "./InfiniteScroll.module.scss";

const { spinnerWrapper } = styles;

interface Props {
  onLoadMore: () => void;
  isLoading: boolean;
  isNeedExecute?: boolean;
  options?: IntersectionObserverInit;
}

const InfiniteScroll: FC<Props> = ({
  onLoadMore,
  options,
  isLoading,
  isNeedExecute = true,
}) => {
  const loaderRef = useRef<HTMLDivElement>(null);

  const onIntersect: IntersectionObserverCallback = useCallback(
    ([entry]) => {
      if (!isNeedExecute || isLoading) {
        return;
      }

      if (entry.isIntersecting) {
        onLoadMore();
      }
    },
    [isNeedExecute, isLoading],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersect, options);

    observer.observe(loaderRef.current as HTMLDivElement);

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [onIntersect]);

  return (
    <div ref={loaderRef}>
      {isNeedExecute && (
        <div className={spinnerWrapper}>
          {isLoading && <CircularProgress thickness={3} size={50} />}
        </div>
      )}
    </div>
  );
};

export default InfiniteScroll;
