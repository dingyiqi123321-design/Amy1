import { TodoList, TodoItem } from '@/types/todo';
import { generateId } from '@/lib/utils';

const TODO_STORAGE_KEY = 'ai-notebook-todos';

export const loadTodosFromLocalStorage = (): TodoList[] => {
  try {
    const stored = localStorage.getItem(TODO_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('加载待办事项失败:', error);
    return [];
  }
};

export const saveTodosToLocalStorage = (todos: TodoList[]): void => {
  try {
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('保存待办事项失败:', error);
  }
};

export const createTodoList = (title: string = '待办事项'): TodoList => {
  return {
    id: generateId(),
    title,
    items: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const createTodoItem = (text: string, listId: string): TodoItem => {
  return {
    id: generateId(),
    text,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};