import { faker } from "@faker-js/faker";

import { observer } from "./eventObserver";
import db, { dbOptions } from "../db";

const TODOS_COUNT = 60;

const getRandomNumber = (min: number, max: number) =>
  faker.datatype.number({ min, max });

const initializeDB = () => {
  // Create an initial set of todos and tasks
  for (let i = 0; i < TODOS_COUNT; i++) {
    const todo = db.todo.create({
      title: faker.lorem.words(getRandomNumber(2, 4)),
      date: Date(),
      index: i,
    });

    const tasks = [];
    for (let i = 0; i < getRandomNumber(0, 14); i++) {
      const task = db.task.create({
        todo,
        title: faker.lorem.words(getRandomNumber(2, 4)),
        isChecked: faker.datatype.boolean(),
        date: Date(),
      });

      tasks.push(task);
    }

    db.todo.update({ where: { id: { equals: todo.id } }, data: { tasks } });
  }

  // await sleep();
  //
  // db.to do.create({
  //   title: "Some title",
  //   date: Date(),
  // });

  dbOptions.isInitialized = true;

  observer.broadcast(dbOptions.isInitialized);
};

export default initializeDB;
