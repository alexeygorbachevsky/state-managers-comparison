import { takeLatest, takeEvery } from "redux-saga/effects";

import loadTodos from "./loadTodos";
import createTask from "./createTask";
import createTodo from "./createTodo";
import removeTodo from "./removeTodo";
import updateTodoTitle from "./updateTodoTitle";
import removeTask from "./removeTask";
import updateTask from "./updateTask";
import reorderTodos from "./reorderTodos";
import reorderTasks from "./reorderTasks";

import { todosSlice } from "../todosSlice";

const {
  loadTodosPending,
  createTaskPending,
  createTodoPending,
  removeTodoPending,
  updateTodoTitlePending,
  removeTaskPending,
  updateTaskPending,
  reorderTodosPending,
    reorderTasksPending
} = todosSlice.actions;

export default function* watchTodos() {
  yield takeLatest(loadTodosPending, loadTodos);
  yield takeEvery(createTodoPending, createTodo);
  yield takeEvery(removeTodoPending, removeTodo);
  yield takeEvery(updateTodoTitlePending, updateTodoTitle);
  yield takeEvery(createTaskPending, createTask);
  yield takeEvery(removeTaskPending, removeTask);
  yield takeEvery(updateTaskPending, updateTask);
  yield takeLatest(reorderTodosPending, reorderTodos);
  yield takeEvery(reorderTasksPending, reorderTasks);
}
