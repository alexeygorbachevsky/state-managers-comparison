import { Component, ReactNode } from "react";
import { ErrorOutline as ErrorOutlineIcon } from "@mui/icons-material";

import styles from "./ErrorBoundary.module.scss";

const { wrapper, errorText } = styles;

interface Props {
  children?: ReactNode;
}

interface State {
  isError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = { isError: false };

  public componentDidCatch() {
    this.setState({ isError: true });
  }

  public render() {
    const { children } = this.props;
    const { isError } = this.state;

    if (isError) {
      return (
        <div className={wrapper}>
          <ErrorOutlineIcon sx={{ height: "64px", width: "64px" }} />
          <div className={errorText}>
            Error is occurred. <div>Please try again!</div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
