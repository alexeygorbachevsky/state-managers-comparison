import { FC } from "react";
import { observer } from "mobx-react-lite";
import { LinearProgress } from "@mui/material";
import classnames from "classnames";

import type { Todo } from "api/client";

import styles from "./TodoStatusLoader.module.scss";

import { todoStatusLoaderHooks } from "./ducks";

const { dragHeaderClass, dragHeaderDisabled } = styles;

const { useConnect } = todoStatusLoaderHooks;

interface Props {
  id: Todo["id"];
}

const TodoStatusLoader: FC<Props> = observer(({ id }) => {
  const { isDisabled, todoUpdateStatus } = useConnect(id);

  return (
    <>
      <div
        className={classnames(dragHeaderClass, {
          [dragHeaderDisabled]: isDisabled,
        })}
      />
      {todoUpdateStatus && (
        <LinearProgress
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            borderRadius: "4px 4px 0 0",
            cursor: "not-allowed",
          }}
        />
      )}
    </>
  );
});

export { dragHeaderClass };

export default TodoStatusLoader;
