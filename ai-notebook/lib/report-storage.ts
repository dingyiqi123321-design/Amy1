import { DailyReport, WeeklyReport, ReportTemplate } from '@/types/report';

const DAILY_REPORTS_KEY = 'daily_reports';
const WEEKLY_REPORTS_KEY = 'weekly_reports';
const REPORT_TEMPLATES_KEY = 'report_templates';

export function loadDailyReportsFromLocalStorage(): DailyReport[] {
  try {
    const stored = localStorage.getItem(DAILY_REPORTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('加载日报失败:', error);
    return [];
  }
}

export function saveDailyReportsToLocalStorage(reports: DailyReport[]): void {
  try {
    localStorage.setItem(DAILY_REPORTS_KEY, JSON.stringify(reports));
  } catch (error) {
    console.error('保存日报失败:', error);
  }
}

export function loadWeeklyReportsFromLocalStorage(): WeeklyReport[] {
  try {
    const stored = localStorage.getItem(WEEKLY_REPORTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('加载周报失败:', error);
    return [];
  }
}

export function saveWeeklyReportsToLocalStorage(reports: WeeklyReport[]): void {
  try {
    localStorage.setItem(WEEKLY_REPORTS_KEY, JSON.stringify(reports));
  } catch (error) {
    console.error('保存周报失败:', error);
  }
}

export function loadReportTemplatesFromLocalStorage(): ReportTemplate[] {
  try {
    const stored = localStorage.getItem(REPORT_TEMPLATES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('加载报告模板失败:', error);
    return [];
  }
}

export function saveReportTemplatesToLocalStorage(templates: ReportTemplate[]): void {
  try {
    localStorage.setItem(REPORT_TEMPLATES_KEY, JSON.stringify(templates));
  } catch (error) {
    console.error('保存报告模板失败:', error);
  }
}

export function createDailyReport(projectId: string, date: string): DailyReport {
  return {
    id: generateId(),
    projectId,
    date,
    tasks: [],
    progress: '',
    issues: '',
    plans: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function createWeeklyReport(projectId: string, weekStart: string, weekEnd: string): WeeklyReport {
  return {
    id: generateId(),
    projectId,
    weekStart,
    weekEnd,
    summary: '',
    achievements: [],
    challenges: [],
    nextWeekPlans: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function generateId(): string {
  return crypto.randomUUID();
}