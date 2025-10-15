import { supabase, TABLES, DatabaseNote, DatabaseProject, DatabaseProjectTask, DatabaseTodoList, DatabaseTodoItem, DatabaseDailyReport, DatabaseWeeklyReport, DatabaseReportTemplate } from './supabase';
import { Note } from '@/types/note';
import { Project, ProjectTask } from '@/types/project';
import { TodoList, TodoItem } from '@/types/todo';
import { DailyReport, WeeklyReport, ReportTemplate } from '@/types/report';

// 数据转换函数：数据库格式 -> 应用格式
function dbNoteToNote(dbNote: DatabaseNote): Note {
  return {
    id: dbNote.id,
    title: dbNote.title,
    content: dbNote.content,
    summary: dbNote.summary,
    createdAt: dbNote.created_at,
    updatedAt: dbNote.updated_at,
  };
}

function dbProjectToProject(dbProject: DatabaseProject): Project {
  return {
    id: dbProject.id,
    name: dbProject.name,
    createdAt: dbProject.created_at,
    updatedAt: dbProject.updated_at,
  };
}

function dbProjectTaskToProjectTask(dbTask: DatabaseProjectTask): ProjectTask {
  return {
    id: dbTask.id,
    projectId: dbTask.project_id,
    parentId: dbTask.parent_id,
    title: dbTask.title,
    description: dbTask.description,
    dueDate: dbTask.due_date || '',
    priority: dbTask.priority,
    assignee: dbTask.assignee,
    isCompleted: dbTask.is_completed,
    createdAt: dbTask.created_at,
    updatedAt: dbTask.updated_at,
  };
}

function dbTodoListToTodoList(dbTodoList: DatabaseTodoList, items: TodoItem[]): TodoList {
  return {
    id: dbTodoList.id,
    title: dbTodoList.title,
    items,
    createdAt: dbTodoList.created_at,
    updatedAt: dbTodoList.updated_at,
  };
}

function dbTodoItemToTodoItem(dbItem: DatabaseTodoItem): TodoItem {
  return {
    id: dbItem.id,
    text: dbItem.text,
    completed: dbItem.completed,
    createdAt: dbItem.created_at,
    updatedAt: dbItem.updated_at,
  };
}

function dbDailyReportToDailyReport(dbReport: DatabaseDailyReport): DailyReport {
  return {
    id: dbReport.id,
    projectId: dbReport.project_id,
    date: dbReport.date,
    tasks: dbReport.tasks,
    progress: dbReport.progress,
    issues: dbReport.issues,
    plans: dbReport.plans,
    createdAt: dbReport.created_at,
    updatedAt: dbReport.updated_at,
  };
}

function dbWeeklyReportToWeeklyReport(dbReport: DatabaseWeeklyReport): WeeklyReport {
  return {
    id: dbReport.id,
    projectId: dbReport.project_id,
    weekStart: dbReport.week_start,
    weekEnd: dbReport.week_end,
    summary: dbReport.summary,
    achievements: dbReport.achievements,
    challenges: dbReport.challenges,
    nextWeekPlans: dbReport.next_week_plans,
    createdAt: dbReport.created_at,
    updatedAt: dbReport.updated_at,
  };
}

function dbReportTemplateToReportTemplate(dbTemplate: DatabaseReportTemplate): ReportTemplate {
  return {
    id: dbTemplate.id,
    name: dbTemplate.name,
    type: dbTemplate.type,
    content: dbTemplate.content,
    projectId: dbTemplate.project_id,
  };
}

// 笔记相关操作
export const noteService = {
  async loadNotes(): Promise<Note[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.NOTES)
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data?.map(dbNoteToNote) || [];
    } catch (error) {
      console.error('加载笔记失败:', error);
      return [];
    }
  },

  async saveNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.NOTES)
        .insert({
          title: note.title,
          content: note.content,
          summary: note.summary,
        })
        .select()
        .single();

      if (error) throw error;
      return data ? dbNoteToNote(data) : null;
    } catch (error) {
      console.error('保存笔记失败:', error);
      return null;
    }
  },

  async updateNote(note: Note): Promise<Note | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.NOTES)
        .update({
          title: note.title,
          content: note.content,
          summary: note.summary,
        })
        .eq('id', note.id)
        .select()
        .single();

      if (error) throw error;
      return data ? dbNoteToNote(data) : null;
    } catch (error) {
      console.error('更新笔记失败:', error);
      return null;
    }
  },

  async deleteNote(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(TABLES.NOTES)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('删除笔记失败:', error);
      return false;
    }
  },
};

// 项目相关操作
export const projectService = {
  async loadProjects(): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.PROJECTS)
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data?.map(dbProjectToProject) || [];
    } catch (error) {
      console.error('加载项目失败:', error);
      return [];
    }
  },

  async saveProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.PROJECTS)
        .insert({ name: project.name })
        .select()
        .single();

      if (error) throw error;
      return data ? dbProjectToProject(data) : null;
    } catch (error) {
      console.error('保存项目失败:', error);
      return null;
    }
  },

  async updateProject(project: Project): Promise<Project | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.PROJECTS)
        .update({ name: project.name })
        .eq('id', project.id)
        .select()
        .single();

      if (error) throw error;
      return data ? dbProjectToProject(data) : null;
    } catch (error) {
      console.error('更新项目失败:', error);
      return null;
    }
  },

  async deleteProject(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(TABLES.PROJECTS)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('删除项目失败:', error);
      return false;
    }
  },

  async loadProjectTasks(projectId?: string): Promise<ProjectTask[]> {
    try {
      let query = supabase
        .from(TABLES.PROJECT_TASKS)
        .select('*')
        .order('created_at', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data?.map(dbProjectTaskToProjectTask) || [];
    } catch (error) {
      console.error('加载项目任务失败:', error);
      return [];
    }
  },

  async saveProjectTask(task: Omit<ProjectTask, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProjectTask | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.PROJECT_TASKS)
        .insert({
          project_id: task.projectId,
          parent_id: task.parentId,
          title: task.title,
          description: task.description,
          due_date: task.dueDate || null,
          priority: task.priority,
          assignee: task.assignee,
          is_completed: task.isCompleted,
        })
        .select()
        .single();

      if (error) throw error;
      return data ? dbProjectTaskToProjectTask(data) : null;
    } catch (error) {
      console.error('保存项目任务失败:', error);
      return null;
    }
  },

  async updateProjectTask(task: ProjectTask): Promise<ProjectTask | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.PROJECT_TASKS)
        .update({
          title: task.title,
          description: task.description,
          due_date: task.dueDate || null,
          priority: task.priority,
          assignee: task.assignee,
          is_completed: task.isCompleted,
        })
        .eq('id', task.id)
        .select()
        .single();

      if (error) throw error;
      return data ? dbProjectTaskToProjectTask(data) : null;
    } catch (error) {
      console.error('更新项目任务失败:', error);
      return null;
    }
  },

  async deleteProjectTask(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(TABLES.PROJECT_TASKS)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('删除项目任务失败:', error);
      return false;
    }
  },
};

// 待办事项相关操作
export const todoService = {
  async loadTodoLists(): Promise<TodoList[]> {
    try {
      const { data: lists, error: listsError } = await supabase
        .from(TABLES.TODO_LISTS)
        .select('*')
        .order('updated_at', { ascending: false });

      if (listsError) throw listsError;

      const todoLists: TodoList[] = [];
      
      for (const list of lists || []) {
        const { data: items, error: itemsError } = await supabase
          .from(TABLES.TODO_ITEMS)
          .select('*')
          .eq('todo_list_id', list.id)
          .order('created_at', { ascending: false });

        if (itemsError) throw itemsError;

        todoLists.push(dbTodoListToTodoList(list, items?.map(dbTodoItemToTodoItem) || []));
      }

      return todoLists;
    } catch (error) {
      console.error('加载待办事项失败:', error);
      return [];
    }
  },

  async saveTodoList(todoList: Omit<TodoList, 'id' | 'createdAt' | 'updatedAt'>): Promise<TodoList | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.TODO_LISTS)
        .insert({ title: todoList.title })
        .select()
        .single();

      if (error) throw error;
      return data ? dbTodoListToTodoList(data, []) : null;
    } catch (error) {
      console.error('保存待办事项列表失败:', error);
      return null;
    }
  },

  async saveTodoItem(listId: string, item: Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<TodoItem | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.TODO_ITEMS)
        .insert({
          todo_list_id: listId,
          text: item.text,
          completed: item.completed,
        })
        .select()
        .single();

      if (error) throw error;
      return data ? dbTodoItemToTodoItem(data) : null;
    } catch (error) {
      console.error('保存待办事项失败:', error);
      return null;
    }
  },

  async updateTodoItem(item: TodoItem): Promise<TodoItem | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.TODO_ITEMS)
        .update({
          text: item.text,
          completed: item.completed,
        })
        .eq('id', item.id)
        .select()
        .single();

      if (error) throw error;
      return data ? dbTodoItemToTodoItem(data) : null;
    } catch (error) {
      console.error('更新待办事项失败:', error);
      return null;
    }
  },

  async deleteTodoItem(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(TABLES.TODO_ITEMS)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('删除待办事项失败:', error);
      return false;
    }
  },

  async deleteTodoList(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(TABLES.TODO_LISTS)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('删除待办事项列表失败:', error);
      return false;
    }
  },
};

// 报告相关操作
export const reportService = {
  async loadDailyReports(projectId?: string): Promise<DailyReport[]> {
    try {
      let query = supabase
        .from(TABLES.DAILY_REPORTS)
        .select('*')
        .order('date', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data?.map(dbDailyReportToDailyReport) || [];
    } catch (error) {
      console.error('加载日报失败:', error);
      return [];
    }
  },

  async loadWeeklyReports(projectId?: string): Promise<WeeklyReport[]> {
    try {
      let query = supabase
        .from(TABLES.WEEKLY_REPORTS)
        .select('*')
        .order('week_start', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data?.map(dbWeeklyReportToWeeklyReport) || [];
    } catch (error) {
      console.error('加载周报失败:', error);
      return [];
    }
  },

  async saveDailyReport(report: Omit<DailyReport, 'id' | 'createdAt' | 'updatedAt'>): Promise<DailyReport | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.DAILY_REPORTS)
        .upsert({
          project_id: report.projectId,
          date: report.date,
          tasks: report.tasks,
          progress: report.progress,
          issues: report.issues,
          plans: report.plans,
        })
        .select()
        .single();

      if (error) throw error;
      return data ? dbDailyReportToDailyReport(data) : null;
    } catch (error) {
      console.error('保存日报失败:', error);
      return null;
    }
  },

  async saveWeeklyReport(report: Omit<WeeklyReport, 'id' | 'createdAt' | 'updatedAt'>): Promise<WeeklyReport | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.WEEKLY_REPORTS)
        .upsert({
          project_id: report.projectId,
          week_start: report.weekStart,
          week_end: report.weekEnd,
          summary: report.summary,
          achievements: report.achievements,
          challenges: report.challenges,
          next_week_plans: report.nextWeekPlans,
        })
        .select()
        .single();

      if (error) throw error;
      return data ? dbWeeklyReportToWeeklyReport(data) : null;
    } catch (error) {
      console.error('保存周报失败:', error);
      return null;
    }
  },

  async loadReportTemplates(projectId?: string): Promise<ReportTemplate[]> {
    try {
      let query = supabase
        .from(TABLES.REPORT_TEMPLATES)
        .select('*')
        .order('created_at', { ascending: false });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data?.map(dbReportTemplateToReportTemplate) || [];
    } catch (error) {
      console.error('加载报告模板失败:', error);
      return [];
    }
  },

  async saveReportTemplate(template: Omit<ReportTemplate, 'id'>): Promise<ReportTemplate | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.REPORT_TEMPLATES)
        .insert({
          name: template.name,
          type: template.type,
          content: template.content,
          project_id: template.projectId,
        })
        .select()
        .single();

      if (error) throw error;
      return data ? dbReportTemplateToReportTemplate(data) : null;
    } catch (error) {
      console.error('保存报告模板失败:', error);
      return null;
    }
  },
};