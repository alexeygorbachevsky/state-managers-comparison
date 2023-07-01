import { SIZE } from "constants/styles";

import { useResizeWindow } from "../use-resize-window";

const useSize = () => {
  const [size] = useResizeWindow();

  const isMobileWidth = size ? SIZE.getIsMobileWidth(size) : false;
  const isTabletSmall = size ? SIZE.getIsTabletSmallWidth(size) : false;

  return {
    isMobileWidth,
    isTabletSmall,
  };
};

export default useSize;
