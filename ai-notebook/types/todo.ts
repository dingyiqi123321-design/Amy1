export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TodoList {
  id: string;
  title: string;
  items: TodoItem[];
  createdAt: string;
  updatedAt: string;
}