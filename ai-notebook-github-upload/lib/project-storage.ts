import { Project, ProjectTask } from '@/types/project';
import { generateId } from '@/lib/utils';

const PROJECT_STORAGE_KEY = 'ai-notebook-projects';
const PROJECT_TASK_STORAGE_KEY = 'ai-notebook-project-tasks';

export const loadProjectsFromLocalStorage = (): Project[] => {
  try {
    const stored = localStorage.getItem(PROJECT_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('加载项目失败:', error);
    return [];
  }
};

export const saveProjectsToLocalStorage = (projects: Project[]): void => {
  try {
    localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('保存项目失败:', error);
  }
};

export const loadProjectTasksFromLocalStorage = (): ProjectTask[] => {
  try {
    const stored = localStorage.getItem(PROJECT_TASK_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('加载项目任务失败:', error);
    return [];
  }
};

export const saveProjectTasksToLocalStorage = (tasks: ProjectTask[]): void => {
  try {
    localStorage.setItem(PROJECT_TASK_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('保存项目任务失败:', error);
  }
};

export const createProject = (name: string): Project => {
  return {
    id: generateId(),
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const createProjectTask = (
  projectId: string,
  title: string,
  parentId: string | null = null
): ProjectTask => {
  return {
    id: generateId(),
    projectId,
    parentId,
    title,
    description: '',
    dueDate: '',
    priority: 'medium',
    assignee: '',
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};