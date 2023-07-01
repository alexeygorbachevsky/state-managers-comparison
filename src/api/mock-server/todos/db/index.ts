import { factory, oneOf, manyOf, primaryKey } from "@mswjs/data";
import { nanoid } from "@reduxjs/toolkit";

const db = factory({
  todo: {
    id: primaryKey(nanoid),
    index: Number,
    title: String,
    tasks: manyOf("task"),
    date: Date,
  },
  task: {
    id: primaryKey(nanoid),
    title: String,
    isChecked: Boolean,
    todo: oneOf("todo"),
    date: Date,
  },
});

const todo = db.todo.getAll()[0];
const task = db.task.getAll()[0];

export type Todo = typeof todo;
export type Task = typeof task;

export const dbOptions = {
  isInitialized: false,
};

export default db;
