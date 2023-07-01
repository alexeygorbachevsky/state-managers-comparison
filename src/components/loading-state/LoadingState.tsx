import { CircularProgress } from "@mui/material";
import { FC } from "react";
import { DoNotDisturbAlt as DoNotDisturbAltIcon } from "@mui/icons-material";

import styles from "./LoadingState.module.scss";

const { wrapper, text } = styles;

interface Props {
  isLoading: boolean;
  loadingText: string;
  emptyText: string;
}

const LoadingState: FC<Props> = ({ isLoading, loadingText, emptyText }) => (
  <div className={wrapper}>
    {isLoading ? (
      <>
        <CircularProgress
          thickness={2.5}
          size={64}
        />
        <div className={text}>{loadingText}</div>
      </>
    ) : (
      <>
        <DoNotDisturbAltIcon sx={{ height: "64px", width: "64px" }} />
        <div className={text}>{emptyText}</div>
      </>
    )}
  </div>
);

export default LoadingState;
