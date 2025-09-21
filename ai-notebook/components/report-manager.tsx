"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { AnimatedButton as Button } from "@/components/ui/animated-button";
import { DailyReportEditor } from "@/components/daily-report-editor";
import { WeeklyReportEditor } from "@/components/weekly-report-editor";
import { FileText, Calendar } from "lucide-react";
import { DailyReport, WeeklyReport } from "@/types/report";
import { 
  loadDailyReportsFromLocalStorage, 
  saveDailyReportsToLocalStorage,
  loadWeeklyReportsFromLocalStorage,
  saveWeeklyReportsToLocalStorage 
} from "@/lib/report-storage";

interface ReportManagerProps {
  projectId: string;
  dailyReports: DailyReport[];
  weeklyReports: WeeklyReport[];
  onUpdateDailyReports: (reports: DailyReport[]) => void;
  onUpdateWeeklyReports: (reports: WeeklyReport[]) => void;
}

export function ReportManager({ 
  projectId, 
  dailyReports, 
  weeklyReports, 
  onUpdateDailyReports, 
  onUpdateWeeklyReports 
}: ReportManagerProps) {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');

  useEffect(() => {
    const loadedDailyReports = loadDailyReportsFromLocalStorage();
    const loadedWeeklyReports = loadWeeklyReportsFromLocalStorage();
    
    if (loadedDailyReports.length > 0) {
      onUpdateDailyReports(loadedDailyReports);
    }
    if (loadedWeeklyReports.length > 0) {
      onUpdateWeeklyReports(loadedWeeklyReports);
    }
  }, []);

  const getProjectReports = (reports: (DailyReport | WeeklyReport)[]) => {
    return reports.filter(report => report.projectId === projectId);
  };

  const getReportStats = () => {
    const projectDailyReports = getProjectReports(dailyReports);
    const projectWeeklyReports = getProjectReports(weeklyReports);
    
    return {
      dailyCount: projectDailyReports.length,
      weeklyCount: projectWeeklyReports.length,
      todayReport: projectDailyReports.some(report => 
        report.date === new Date().toISOString().split('T')[0]
      ),
      thisWeekReport: projectWeeklyReports.some(report => {
        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay() + 1);
        return report.weekStart === weekStart.toISOString().split('T')[0];
      })
    };
  };

  const stats = getReportStats();

  return (
    <div className="h-full flex flex-col p-4">
      {/* 标题和帮助信息 */}
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">项目报告管理</h2>
        <p className="text-sm text-muted-foreground">
          📊 管理项目的日报和周报，记录工作进展和计划
        </p>
      </div>

      {/* 标签页切换 */}
      <div className="border-b mb-4">
        <div className="flex">
          <Button
            variant={activeTab === 'daily' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('daily')}
            className="rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            <FileText className="h-4 w-4 mr-2" />
            日报
            {stats.dailyCount > 0 && (
              <span className="ml-2 bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
                {stats.dailyCount}
              </span>
            )}
          </Button>
          <Button
            variant={activeTab === 'weekly' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('weekly')}
            className="rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            <Calendar className="h-4 w-4 mr-2" />
            周报
            {stats.weeklyCount > 0 && (
              <span className="ml-2 bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
                {stats.weeklyCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* 快速状态 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-500" />
            <div>
              <div className="text-sm text-muted-foreground">今日日报</div>
              <div className="text-lg font-semibold">
                {stats.todayReport ? '已填写' : '未填写'}
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-green-500" />
            <div>
              <div className="text-sm text-muted-foreground">本周周报</div>
              <div className="text-lg font-semibold">
                {stats.thisWeekReport ? '已填写' : '未填写'}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-200px)]">
        {activeTab === 'daily' ? (
          <DailyReportEditor
            projectId={projectId}
            dailyReports={dailyReports}
            onUpdateDailyReports={onUpdateDailyReports}
          />
        ) : (
          <WeeklyReportEditor
            projectId={projectId}
            weeklyReports={weeklyReports}
            onUpdateWeeklyReports={onUpdateWeeklyReports}
          />
        )}
      </div>
    </div>
  );
}