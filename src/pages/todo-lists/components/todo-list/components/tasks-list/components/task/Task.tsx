import { FC } from "react";
import { observer } from "mobx-react-lite";
import { Checkbox, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import classnames from "classnames";
import { Draggable } from "react-beautiful-dnd";

import type { Task as ITask } from "api/client";

import { EditableTitle } from "components";

import { tasksListConstants } from "../../ducks";

import { taskHooks } from "./ducks";

import styles from "./Task.module.scss";

const { useConnect } = taskHooks;

const {
  taskWrapper,
  taskInputWrapper,
  deleteButton,
  taskInputWrapperWithScroll,
  deleteButtonIcon,
  taskWrapperDisabled,
  isCheckedStatusClass,
} = styles;

const { MAX_TASKS_COUNT_WITHOUT_SCROLL } = tasksListConstants;

interface Props {
  index: number;
}

const Task: FC<ITask & Props> = observer(({ index, ...task }) => {
  const {
    isDisabled,
    isCheckedStatus,
    isEditableTitleOpened,
    tasks,
    isAnyTaskUpdating,
    onTaskClick,
    onRemoveTask,
    onChangeEditableTitle,
    onChangeTaskStatus,
    setIsEditableTitleOpened,
  } = useConnect(task);

  return (
    <Draggable
      key={task.id}
      draggableId={task.id}
      index={index}
      isDragDisabled={isDisabled || isAnyTaskUpdating}
    >
      {provided => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          role="button"
          className={classnames(taskWrapper, {
            [taskWrapperDisabled]: isDisabled,
          })}
          onClick={onTaskClick}
        >
          <div
            className={classnames(taskInputWrapper, {
              [taskInputWrapperWithScroll]:
                tasks.length > MAX_TASKS_COUNT_WITHOUT_SCROLL,
            })}
          >
            <Checkbox
              className={isCheckedStatusClass}
              checked={isCheckedStatus}
              disabled={isDisabled}
              onChange={onChangeTaskStatus}
              value="checkedA"
              inputProps={{ "aria-label": "Checkbox A" }}
            />
            <EditableTitle
              isOpened={isEditableTitleOpened}
              title={task.title}
              onChange={onChangeEditableTitle}
              setIsOpened={setIsEditableTitleOpened}
              disabled={isDisabled}
            />
          </div>
          <IconButton
            aria-label="delete"
            className={deleteButton}
            onClick={onRemoveTask}
            disabled={isDisabled}
          >
            <Delete className={deleteButtonIcon} />
          </IconButton>
        </div>
      )}
    </Draggable>
  );
});

export default Task;
