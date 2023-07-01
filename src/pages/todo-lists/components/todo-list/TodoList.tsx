import { ComponentClass } from "react";
import { Grid, Paper } from "@mui/material";
import { SortableElementProps, SortableElement } from "react-sortable-hoc";

import { Todo } from "api/client";

import {
  TasksList,
  CreateTaskInput,
  TodoHeader,
  TodoStatusLoader,
  dragHeaderClass,
} from "./components";

import styles from "./TodoList.module.scss";

const { todoWrapperClass, paper } = styles;

interface Props {
  id: Todo["id"];
  index: number;
}

const TodoList: ComponentClass<SortableElementProps & Props> = SortableElement(
  ({ id }: Props) => (
    <Grid item className={todoWrapperClass}>
      <Paper className={paper}>
        <TodoStatusLoader id={id} />
        <div>
          <TodoHeader id={id} />
          <CreateTaskInput todoId={id} />
          <TasksList todoId={id} />
        </div>
      </Paper>
    </Grid>
  ),
);

export { dragHeaderClass };

export default TodoList;
