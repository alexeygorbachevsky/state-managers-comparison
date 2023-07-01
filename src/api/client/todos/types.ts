export interface Task {
  id: string;
  title: string;
  isChecked: boolean;
  date: string;
  todoId: string;
}

export interface Todo {
  id: string;
  index: number;
  title: string;
  date: string;
  tasks: Task[];
}
