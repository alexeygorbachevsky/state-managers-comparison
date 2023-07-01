import { ComponentClass } from "react";
import { observer } from "mobx-react-lite";
import { Container, Grid } from "@mui/material";
import { ErrorOutline as ErrorOutlineIcon } from "@mui/icons-material";
import { SortableContainer, SortableContainerProps } from "react-sortable-hoc";
import { DragDropContext } from "react-beautiful-dnd";

import { Todo } from "api/client";

import { InfiniteScroll, LoadingState, Alerts } from "components";

import { TodoList } from "./components";
import { todoListsHooks } from "./ducks";

import styles from "./TodoLists.module.scss";

const { app, container, grid, loadingStateWrapper, errorWrapper, errorText } =
  styles;
const { useConnect } = todoListsHooks;

interface SortableListProps {
  todoIds: Todo["id"][];
}

const SortableList: ComponentClass<SortableContainerProps & SortableListProps> =
  SortableContainer(({ todoIds }: SortableListProps) => (
    <Grid container spacing={3} className={grid}>
      {todoIds.map((id, index) => (
        <TodoList key={id} id={id as Todo["id"]} index={index} />
      ))}
    </Grid>
  ));

const TodoLists = observer(() => {
  const {
    onLoadTodos,
    todoIds,
    isLoading,
    onTaskDragEnd,
    onShouldCancelStartDnD,
    onSortEnd,
    isTodoCreating,
    isLastBatch,
    isFailed,
  } = useConnect();

  if (isFailed) {
    return (
      <div className={app}>
        <div className={errorWrapper}>
          <ErrorOutlineIcon sx={{ height: "64px", width: "64px" }} />
          <div className={errorText}>
            Error is occurred. <div>Unable to load todos.</div>
          </div>
        </div>
      </div>
    );
  }

  if (!todoIds.length) {
    return (
      <div className={app}>
        <div className={loadingStateWrapper}>
          <LoadingState
            isLoading={isLoading}
            loadingText="Loading todo lists"
            emptyText="No todo lists to display"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={app}>
      <Container fixed className={container}>
        <DragDropContext onDragEnd={onTaskDragEnd}>
          <SortableList
            todoIds={todoIds}
            axis="xy"
            getContainer={() =>
              document.querySelector(`.${container}`) as HTMLElement
            }
            useWindowAsScrollContainer
            shouldCancelStart={onShouldCancelStartDnD}
            onSortEnd={onSortEnd}
          />
        </DragDropContext>
        {onLoadTodos && (
          <InfiniteScroll
            onLoadMore={onLoadTodos}
            isLoading={isLoading || isTodoCreating}
            isNeedExecute={!isLastBatch}
          />
        )}
      </Container>
      <Alerts />
    </div>
  );
});

export default TodoLists;
