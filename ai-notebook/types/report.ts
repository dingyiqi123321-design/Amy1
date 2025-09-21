export interface DailyReport {
  id: string;
  projectId: string;
  date: string; // YYYY-MM-DD
  tasks: string[];
  progress: string;
  issues: string;
  plans: string[];
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyReport {
  id: string;
  projectId: string;
  weekStart: string; // YYYY-MM-DD (周一)
  weekEnd: string; // YYYY-MM-DD (周日)
  summary: string;
  achievements: string[];
  challenges: string[];
  nextWeekPlans: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  type: 'daily' | 'weekly';
  content: string;
  projectId: string;
}