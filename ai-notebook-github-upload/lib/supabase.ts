import { createClient } from '@supabase/supabase-js';
import { mockSupabase } from './mock-supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 检查是否有有效的Supabase配置
const hasValidSupabaseConfig = supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_project_url_here' &&
  supabaseAnonKey !== 'your_supabase_anon_key_here' &&
  supabaseUrl.startsWith('http');

// 如果没有有效配置，使用模拟服务
export const supabase = hasValidSupabaseConfig 
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : mockSupabase as any;

// 用于服务端操作的客户端（使用服务角色密钥）
export const supabaseAdmin = hasValidSupabaseConfig && supabaseServiceRoleKey
  ? createClient(
      supabaseUrl!,
      supabaseServiceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
  : mockSupabase as any;

// 导出配置状态
export const isUsingMockSupabase = !hasValidSupabaseConfig;

// 在开发环境下显示配置状态
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('Supabase配置状态:', {
    isUsingMock: isUsingMockSupabase,
    hasUrl: !!supabaseUrl,
    hasAnonKey: !!supabaseAnonKey,
    urlValid: supabaseUrl?.startsWith('http')
  });
}

// 数据库表名常量
export const TABLES = {
  NOTES: 'notes',
  PROJECTS: 'projects',
  PROJECT_TASKS: 'project_tasks',
  TODO_LISTS: 'todo_lists',
  TODO_ITEMS: 'todo_items',
  DAILY_REPORTS: 'daily_reports',
  WEEKLY_REPORTS: 'weekly_reports',
  REPORT_TEMPLATES: 'report_templates',
} as const;

// 类型定义，与数据库表结构对应
export interface DatabaseNote {
  id: string;
  user_id: string;
  title: string;
  content: string;
  summary: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseProject {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseProjectTask {
  id: string;
  project_id: string;
  parent_id: string | null;
  title: string;
  description: string;
  due_date: string | null;
  priority: 'high' | 'medium' | 'low';
  assignee: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseTodoList {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseTodoItem {
  id: string;
  todo_list_id: string;
  text: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseDailyReport {
  id: string;
  project_id: string;
  date: string;
  tasks: string[];
  progress: string;
  issues: string;
  plans: string[];
  created_at: string;
  updated_at: string;
}

export interface DatabaseWeeklyReport {
  id: string;
  project_id: string;
  week_start: string;
  week_end: string;
  summary: string;
  achievements: string[];
  challenges: string[];
  next_week_plans: string[];
  created_at: string;
  updated_at: string;
}

export interface DatabaseReportTemplate {
  id: string;
  name: string;
  type: 'daily' | 'weekly';
  content: string;
  project_id: string;
  created_at: string;
  updated_at: string;
}