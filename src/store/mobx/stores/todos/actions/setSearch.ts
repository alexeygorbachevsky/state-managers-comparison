import type  TodosStore  from "../todosStore";

function setSearch(this: TodosStore, search: string) {
  this.search = search;
}

export default setSearch;
