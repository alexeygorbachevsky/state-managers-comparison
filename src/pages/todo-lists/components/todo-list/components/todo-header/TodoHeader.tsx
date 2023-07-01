import { FC } from "react";
import { observer } from "mobx-react-lite";
import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import classnames from "classnames";

import type { Todo } from "api/client";

import { EditableTitle } from "components";

import { todoHeaderHooks } from "./ducks";

import styles from "./TodoHeader.module.scss";

const {
  todoHeader,
  deleteButton,
  editableTitle,
  editableTitleDisabled,
  todoHeaderDisabled,
} = styles;

const { useConnect } = todoHeaderHooks;

interface Props {
  id: Todo["id"];
}

const TodoHeader: FC<Props> = observer(({ id }) => {
  const {
    title,
    isEditableTitleOpened,
    setIsEditableTitleOpened,
    isDisabled,
    onRemoveTodo,
    onUpdateTodoTitle,
  } = useConnect(id);

  return (
    <div
      className={classnames(todoHeader, { [todoHeaderDisabled]: isDisabled })}
    >
      <EditableTitle
        title={title}
        isOpened={isEditableTitleOpened}
        setIsOpened={setIsEditableTitleOpened}
        onChange={onUpdateTodoTitle}
        titleClassName={classnames(editableTitle, {
          [editableTitleDisabled]: isDisabled,
        })}
        style={{ fontWeight: "700", marginLeft: "12px" }}
        disabled={isDisabled}
      />
      <IconButton
        aria-label="Delete"
        className={deleteButton}
        onClick={onRemoveTodo}
        disabled={isDisabled}
      >
        <Delete />
      </IconButton>
    </div>
  );
});

export default TodoHeader;
