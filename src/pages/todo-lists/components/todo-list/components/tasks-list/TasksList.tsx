import { FC } from "react";
import { observer } from "mobx-react-lite";
import { DoNotDisturbAlt as DoNotDisturbAltIcon } from "@mui/icons-material";
import { Button } from "@mui/material";
import classNames from "classnames";
import { Droppable } from "react-beautiful-dnd";

import type { Task as ITask } from "api/client";

import { TaskListFilter } from "constants/tasks";

import { Task } from "./components";

import { tasksListHooks } from "./ducks";

import styles from "./TasksList.module.scss";

const {
  tasksListWrapper,
  noTasksWrapper,
  text,
  taskListButtonsWrapper,
  disabledNoTasksWrapper,
} = styles;

const { useConnect } = tasksListHooks;

interface Props {
  todoId: ITask["todoId"];
}

const getListStyle = (isDraggingOver: boolean) => ({
  backgroundColor: isDraggingOver ? "rgba(222,227,243,0.5)" : "initial",
});

const TasksList: FC<Props> = observer(({ todoId }) => {
  const { filter, setFilter, tasks, isAnyTaskUpdating, isDisabled } =
    useConnect(todoId);

  return (
    <>
      <Droppable
        key={todoId}
        droppableId={todoId}
        isDropDisabled={isDisabled || isAnyTaskUpdating}
      >
        {(provided, snapshot) =>
          tasks.length ? (
            <div
              className={tasksListWrapper}
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {tasks.map((task, index) => (
                <Task key={task.id} {...task} index={index} />
              ))}
            </div>
          ) : (
            <div
              className={classNames(tasksListWrapper, noTasksWrapper, {
                [disabledNoTasksWrapper]: isDisabled,
              })}
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              <DoNotDisturbAltIcon sx={{ height: "64px", width: "64px" }} />
              <p className={text}>No tasks</p>
            </div>
          )
        }
      </Droppable>

      <div className={taskListButtonsWrapper}>
        <Button
          variant={filter === TaskListFilter.all ? "contained" : "text"}
          color="primary"
          onClick={() => setFilter(TaskListFilter.all)}
        >
          All
        </Button>
        <Button
          variant={filter === TaskListFilter.active ? "contained" : "text"}
          color="success"
          onClick={() => setFilter(TaskListFilter.active)}
          sx={{ width: "85px" }}
        >
          Active
        </Button>
        <Button
          variant={filter === TaskListFilter.done ? "contained" : "text"}
          color="error"
          onClick={() => setFilter(TaskListFilter.done)}
          sx={{ width: "74px" }}
        >
          Done
        </Button>
      </div>
    </>
  );
});

export default TasksList;
