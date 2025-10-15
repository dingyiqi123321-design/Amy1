import { supabase, TABLES, DatabaseNote, DatabaseProject, DatabaseProjectTask, DatabaseTodoList, DatabaseTodoItem, DatabaseDailyReport, DatabaseWeeklyReport, DatabaseReportTemplate } from './supabase';
import { Note } from '@/types/note';
import { Project, ProjectTask } from '@/types/project';
import { TodoList, TodoItem } from '@/types/todo';
import { DailyReport, WeeklyReport, ReportTemplate } from '@/types/report';

// 获取当前用户ID的辅助函数
async function getCurrentUserId(): Promise<string> {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error('用户未登录');
  }
  return user.id;
}

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

// 笔记服务 - 支持用户认证
export const authNoteService = {
  async loadNotes(): Promise<Note[]> {
    try {
      const userId = await getCurrentUserId();
      const { data, error } = await supabase
        .from(TABLES.NOTES)
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('加载笔记失败:', error);
        return [];
      }

      return data?.map(dbNoteToNote) || [];
    } catch (error) {
      console.error('加载笔记失败:', error);
      return [];
    }
  },

  async saveNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note | null> {
    try {
      const userId = await getCurrentUserId();
      const { data, error } = await supabase
        .from(TABLES.NOTES)
        .insert({
          user_id: userId,
          title: note.title,
          content: note.content,
          summary: note.summary,
        })
        .select()
        .single();

      if (error) {
        console.error('保存笔记失败:', error);
        return null;
      }

      return data ? dbNoteToNote(data) : null;
    } catch (error) {
      console.error('保存笔记失败:', error);
      return null;
    }
  },

  async updateNote(note: Note): Promise<Note | null> {
    try {
      const userId = await getCurrentUserId();
      const { data, error } = await supabase
        .from(TABLES.NOTES)
        .update({
          title: note.title,
          content: note.content,
          summary: note.summary,
        })
        .eq('id', note.id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('更新笔记失败:', error);
        return null;
      }

      return data ? dbNoteToNote(data) : null;
    } catch (error) {
      console.error('更新笔记失败:', error);
      return null;
    }
  },

  async deleteNote(id: string): Promise<boolean> {
    try {
      const userId = await getCurrentUserId();
      const { error } = await supabase
        .from(TABLES.NOTES)
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        console.error('删除笔记失败:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('删除笔记失败:', error);
      return false;
    }
  },
};

// 项目服务 - 支持用户认证
export const authProjectService = {
  async loadProjects(): Promise<Project[]> {
    try {
      const userId = await getCurrentUserId();
      const { data, error } = await supabase
        .from(TABLES.PROJECTS)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('加载项目失败:', error);
        return [];
      }

      return data?.map(dbProjectToProject) || [];
    } catch (error) {
      console.error('加载项目失败:', error);
      return [];
    }
  },

  async saveProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project | null> {
    try {
      const userId = await getCurrentUserId();
      const { data, error } = await supabase
        .from(TABLES.PROJECTS)
        .insert({
          user_id: userId,
          name: project.name,
        })
        .select()
        .single();

      if (error) {
        console.error('保存项目失败:', error);
        return null;
      }

      return data ? dbProjectToProject(data) : null;
    } catch (error) {
      console.error('保存项目失败:', error);
      return null;
    }
  },

  async updateProject(project: Project): Promise<Project | null> {
    try {
      const userId = await getCurrentUserId();
      const { data, error } = await supabase
        .from(TABLES.PROJECTS)
        .update({
          name: project.name,
        })
        .eq('id', project.id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('更新项目失败:', error);
        return null;
      }

      return data ? dbProjectToProject(data) : null;
    } catch (error) {
      console.error('更新项目失败:', error);
      return null;
    }
  },

  async deleteProject(id: string): Promise<boolean> {
    try {
      const userId = await getCurrentUserId();
      const { error } = await supabase
        .from(TABLES.PROJECTS)
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        console.error('删除项目失败:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('删除项目失败:', error);
      return false;
    }
  },

  async loadProjectTasks(projectId?: string): Promise<ProjectTask[]> {
    try {
      const userId = await getCurrentUserId();
      let query = supabase
        .from(TABLES.PROJECT_TASKS)
        .select(`
          *,
          projects!inner(user_id)
        `)
        .eq('projects.user_id', userId);

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('加载项目任务失败:', error);
        return [];
      }

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

      if (error) {
        console.error('保存项目任务失败:', error);
        return null;
      }

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

      if (error) {
        console.error('更新项目任务失败:', error);
        return null;
      }

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

      if (error) {
        console.error('删除项目任务失败:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('删除项目任务失败:', error);
      return false;
    }
  },
};

// 待办事项服务 - 支持用户认证
export const authTodoService = {
  async loadTodoLists(): Promise<TodoList[]> {
    try {
      const userId = await getCurrentUserId();
      const { data: listsData, error: listsError } = await supabase
        .from(TABLES.TODO_LISTS)
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (listsError) {
        console.error('加载待办列表失败:', listsError);
        return [];
      }

      if (!listsData || listsData.length === 0) {
        return [];
      }

      const { data: itemsData, error: itemsError } = await supabase
        .from(TABLES.TODO_ITEMS)
        .select(`
          *,
          todo_lists!inner(user_id)
        `)
        .eq('todo_lists.user_id', userId)
        .order('created_at', { ascending: true });

      if (itemsError) {
        console.error('加载待办项目失败:', itemsError);
        return listsData.map(list => dbTodoListToTodoList(list, []));
      }

      const itemsByListId = (itemsData || []).reduce((acc, item) => {
        if (!acc[item.todo_list_id]) {
          acc[item.todo_list_id] = [];
        }
        acc[item.todo_list_id].push(dbTodoItemToTodoItem(item));
        return acc;
      }, {} as Record<string, TodoItem[]>);

      return listsData.map(list => 
        dbTodoListToTodoList(list, itemsByListId[list.id] || [])
      );
    } catch (error) {
      console.error('加载待办列表失败:', error);
      return [];
    }
  },

  async saveTodoList(todoList: Omit<TodoList, 'id' | 'createdAt' | 'updatedAt'>): Promise<TodoList | null> {
    try {
      const userId = await getCurrentUserId();
      const { data, error } = await supabase
        .from(TABLES.TODO_LISTS)
        .insert({
          user_id: userId,
          title: todoList.title,
        })
        .select()
        .single();

      if (error) {
        console.error('保存待办列表失败:', error);
        return null;
      }

      return data ? dbTodoListToTodoList(data, []) : null;
    } catch (error) {
      console.error('保存待办列表失败:', error);
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

      if (error) {
        console.error('保存待办项目失败:', error);
        return null;
      }

      return data ? dbTodoItemToTodoItem(data) : null;
    } catch (error) {
      console.error('保存待办项目失败:', error);
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

      if (error) {
        console.error('更新待办项目失败:', error);
        return null;
      }

      return data ? dbTodoItemToTodoItem(data) : null;
    } catch (error) {
      console.error('更新待办项目失败:', error);
      return null;
    }
  },

  async deleteTodoItem(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(TABLES.TODO_ITEMS)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('删除待办项目失败:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('删除待办项目失败:', error);
      return false;
    }
  },

  async deleteTodoList(id: string): Promise<boolean> {
    try {
      const userId = await getCurrentUserId();
      const { error } = await supabase
        .from(TABLES.TODO_LISTS)
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) {
        console.error('删除待办列表失败:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('删除待办列表失败:', error);
      return false;
    }
  },
};

// 报告服务 - 支持用户认证
export const authReportService = {
  async loadDailyReports(projectId?: string): Promise<DailyReport[]> {
    try {
      const userId = await getCurrentUserId();
      let query = supabase
        .from(TABLES.DAILY_REPORTS)
        .select(`
          *,
          projects!inner(user_id)
        `)
        .eq('projects.user_id', userId);

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query.order('date', { ascending: false });

      if (error) {
        console.error('加载日报失败:', error);
        return [];
      }

      return data?.map(dbDailyReportToDailyReport) || [];
    } catch (error) {
      console.error('加载日报失败:', error);
      return [];
    }
  },

  async loadWeeklyReports(projectId?: string): Promise<WeeklyReport[]> {
    try {
      const userId = await getCurrentUserId();
      let query = supabase
        .from(TABLES.WEEKLY_REPORTS)
        .select(`
          *,
          projects!inner(user_id)
        `)
        .eq('projects.user_id', userId);

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query.order('week_start', { ascending: false });

      if (error) {
        console.error('加载周报失败:', error);
        return [];
      }

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
        .insert({
          project_id: report.projectId,
          date: report.date,
          tasks: report.tasks,
          progress: report.progress,
          issues: report.issues,
          plans: report.plans,
        })
        .select()
        .single();

      if (error) {
        console.error('保存日报失败:', error);
        return null;
      }

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
        .insert({
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

      if (error) {
        console.error('保存周报失败:', error);
        return null;
      }

      return data ? dbWeeklyReportToWeeklyReport(data) : null;
    } catch (error) {
      console.error('保存周报失败:', error);
      return null;
    }
  },

  async loadReportTemplates(projectId?: string): Promise<ReportTemplate[]> {
    try {
      const userId = await getCurrentUserId();
      let query = supabase
        .from(TABLES.REPORT_TEMPLATES)
        .select(`
          *,
          projects!inner(user_id)
        `)
        .eq('projects.user_id', userId);

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('加载报告模板失败:', error);
        return [];
      }

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

      if (error) {
        console.error('保存报告模板失败:', error);
        return null;
      }

      return data ? dbReportTemplateToReportTemplate(data) : null;
    } catch (error) {
      console.error('保存报告模板失败:', error);
      return null;
    }
  },
};