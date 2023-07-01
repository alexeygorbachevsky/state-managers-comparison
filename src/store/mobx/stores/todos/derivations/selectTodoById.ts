import type { Todo } from "api/client";
import type TodosStore from "../todosStore";

function selectTodoById(this: TodosStore, id: Todo["id"]) {
  return this.entities[id];
}

export default selectTodoById;
