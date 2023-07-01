import { FC } from "react";
import { observer } from "mobx-react-lite";
import { IconButton, TextField } from "@mui/material";
import { ControlPoint } from "@mui/icons-material";
import classnames from "classnames";

import { Todo } from "api/client";

import { createTaskInputHooks } from "./ducks";

import styles from "./CreateTaskInput.module.scss";

const { useConnect } = createTaskInputHooks;

const {
  createTaskWrapper,
  todoInput,
  todoLabel,
  deleteButton,
  createTaskWrapperDisabled,
} = styles;

interface Props {
  todoId: Todo["id"];
}

const CreateTaskInput: FC<Props> = observer(({ todoId }) => {
  const {
    taskTitle,
    setTaskTitle,
    isDisabled,
    onCreateTask,
    onCreateTaskKeyDown,
  } = useConnect(todoId);

  return (
    <div
      className={classnames(createTaskWrapper, {
        [createTaskWrapperDisabled]: isDisabled,
      })}
    >
      <TextField
        value={taskTitle}
        onChange={e => setTaskTitle(e.target.value)}
        onKeyDown={onCreateTaskKeyDown}
        disabled={isDisabled}
        fullWidth
        variant="standard"
        id="standard-basic"
        label="Create task"
        InputProps={{
          className: todoInput,
          classes: {
            disabled: createTaskWrapperDisabled,
          },
        }}
        InputLabelProps={{ className: todoLabel }}
      />
      <IconButton
        className={deleteButton}
        onClick={onCreateTask}
        disabled={isDisabled}
      >
        <ControlPoint color="primary" />
      </IconButton>
    </div>
  );
});

export default CreateTaskInput;
