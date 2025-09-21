"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedButton as Button } from "@/components/ui/animated-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FileText, BarChart3, Calendar, TrendingUp } from "lucide-react";
import { Project } from "@/types/project";
import { DailyReport, WeeklyReport } from "@/types/report";
import { ReportManager } from "@/components/report-manager";
import { loadProjectsFromLocalStorage } from "@/lib/project-storage";

interface ReportsPageProps {
  dailyReports: DailyReport[];
  weeklyReports: WeeklyReport[];
  onUpdateDailyReports: (reports: DailyReport[]) => void;
  onUpdateWeeklyReports: (reports: WeeklyReport[]) => void;
}

export function ReportsPage({
  dailyReports,
  weeklyReports,
  onUpdateDailyReports,
  onUpdateWeeklyReports
}: ReportsPageProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [reportType, setReportType] = useState<'daily' | 'weekly'>('daily');

  useEffect(() => {
    const loadedProjects = loadProjectsFromLocalStorage();
    setProjects(loadedProjects);
  }, []);

  // 计算统计数据
  const getStats = () => {
    const projectDailyReports = selectedProjectId === 'all'
      ? dailyReports
      : dailyReports.filter(r => r.projectId === selectedProjectId);

    const projectWeeklyReports = selectedProjectId === 'all'
      ? weeklyReports
      : weeklyReports.filter(r => r.projectId === selectedProjectId);

    const today = new Date().toISOString().split('T')[0];
    const weekStart = getWeekStart(new Date()).toISOString().split('T')[0];

    return {
      totalDaily: projectDailyReports.length,
      totalWeekly: projectWeeklyReports.length,
      todayReport: projectDailyReports.some(r => r.date === today),
      thisWeekReport: projectWeeklyReports.some(r => r.weekStart === weekStart)
    };
  };

  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const stats = getStats();

  if (projects.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <Card className="p-8 text-center max-w-md">
          <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-4">暂无项目</h2>
          <p className="text-muted-foreground mb-6">
            请先创建项目，然后才能管理日报和周报
          </p>
          <p className="text-sm text-muted-foreground">
            切换到项目管理模块创建您的第一个项目
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* 顶部标题和控制区域 */}
      <div className="border-b p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6" />
            <h1 className="text-2xl font-bold">报告管理</h1>
          </div>
          <div className="text-sm text-muted-foreground">
            {reportType === 'daily' ? `${stats.totalDaily} 份日报` : `${stats.totalWeekly} 份周报`}
          </div>
        </div>

        {/* 控制栏 */}
        <div className="flex gap-4 items-center flex-wrap">
          {/* 项目选择 */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">项目:</span>
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="选择项目" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有项目</SelectItem>
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 报告类型切换 */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">类型:</span>
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                size="sm"
                variant={reportType === 'daily' ? 'default' : 'ghost'}
                onClick={() => setReportType('daily')}
                className="gap-2"
              >
                <Calendar className="h-4 w-4" />
                日报
              </Button>
              <Button
                size="sm"
                variant={reportType === 'weekly' ? 'default' : 'ghost'}
                onClick={() => setReportType('weekly')}
                className="gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                周报
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="p-6 border-b bg-muted/30">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">总日报数</p>
                  <p className="text-2xl font-bold">{stats.totalDaily}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">总周报数</p>
                  <p className="text-2xl font-bold">{stats.totalWeekly}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">今日日报</p>
                  <p className="text-lg font-semibold">
                    {stats.todayReport ? '✅ 已填写' : '❌ 未填写'}
                  </p>
                </div>
                <div className={`h-3 w-3 rounded-full ${stats.todayReport ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">本周周报</p>
                  <p className="text-lg font-semibold">
                    {stats.thisWeekReport ? '✅ 已填写' : '❌ 未填写'}
                  </p>
                </div>
                <div className={`h-3 w-3 rounded-full ${stats.thisWeekReport ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="space-y-6">
          {/* 报告管理器 */}
          {selectedProjectId && (
            <ReportManager
              projectId={selectedProjectId}
              dailyReports={reportType === 'daily' ?
                (selectedProjectId === 'all' ? dailyReports : dailyReports.filter(r => r.projectId === selectedProjectId)) :
                dailyReports
              }
              weeklyReports={reportType === 'weekly' ?
                (selectedProjectId === 'all' ? weeklyReports : weeklyReports.filter(r => r.projectId === selectedProjectId)) :
                weeklyReports
              }
              onUpdateDailyReports={onUpdateDailyReports}
              onUpdateWeeklyReports={onUpdateWeeklyReports}
            />
          )}
        </div>
      </div>
    </div>
  );
}