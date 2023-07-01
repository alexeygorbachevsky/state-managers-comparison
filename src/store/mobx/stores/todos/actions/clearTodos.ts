import type TodosStore  from "../todosStore";

function clearTodos(this: TodosStore) {
  this.ids = [];
  this.entities = {};
  this.isLastBatch = false;
  this.cursor = "";
}

export default clearTodos;
