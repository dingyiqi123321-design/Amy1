export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectTask {
  id: string;
  projectId: string;
  parentId: string | null;
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  assignee: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectWithTasks {
  project: Project;
  tasks: ProjectTask[];
}