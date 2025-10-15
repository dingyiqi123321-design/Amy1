"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedButton as Button } from "@/components/ui/animated-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Calendar } from "lucide-react";
import { DailyReport } from "@/types/report";
import { format, isToday, parseISO } from "date-fns";
import { zhCN } from "date-fns/locale";

interface DailyReportEditorProps {
  projectId: string;
  dailyReports: DailyReport[];
  onUpdateDailyReports: (reports: DailyReport[]) => void;
}

export function DailyReportEditor({ 
  projectId, 
  dailyReports, 
  onUpdateDailyReports 
}: DailyReportEditorProps) {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [currentReport, setCurrentReport] = useState<DailyReport | null>(null);
  const [newTask, setNewTask] = useState("");
  const [newPlan, setNewPlan] = useState("");

  useEffect(() => {
    const report = dailyReports.find(r => r.date === selectedDate && r.projectId === projectId);
    if (report) {
      setCurrentReport(report);
    } else {
      setCurrentReport(null);
    }
  }, [selectedDate, projectId, dailyReports]);

  const handleCreateReport = () => {
    const newReport: DailyReport = {
      id: crypto.randomUUID(),
      projectId,
      date: selectedDate,
      tasks: [],
      progress: "",
      issues: "",
      plans: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedReports = [...dailyReports, newReport];
    onUpdateDailyReports(updatedReports);
    setCurrentReport(newReport);
  };

  const handleUpdateReport = (updates: Partial<DailyReport>) => {
    if (!currentReport) return;

    const updatedReport = {
      ...currentReport,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const updatedReports = dailyReports.map(report =>
      report.id === currentReport.id ? updatedReport : report
    );
    
    onUpdateDailyReports(updatedReports);
    setCurrentReport(updatedReport);
  };

  const handleAddTask = () => {
    if (!currentReport || !newTask.trim()) return;

    const updatedTasks = [...currentReport.tasks, newTask.trim()];
    handleUpdateReport({ tasks: updatedTasks });
    setNewTask("");
  };

  const handleRemoveTask = (index: number) => {
    if (!currentReport) return;

    const updatedTasks = currentReport.tasks.filter((_, i) => i !== index);
    handleUpdateReport({ tasks: updatedTasks });
  };

  const handleAddPlan = () => {
    if (!currentReport || !newPlan.trim()) return;

    const updatedPlans = [...currentReport.plans, newPlan.trim()];
    handleUpdateReport({ plans: updatedPlans });
    setNewPlan("");
  };

  const handleRemovePlan = (index: number) => {
    if (!currentReport) return;

    const updatedPlans = currentReport.plans.filter((_, i) => i !== index);
    handleUpdateReport({ plans: updatedPlans });
  };

  const getDateDisplay = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) {
      return "今天";
    }
    return format(date, 'MM月dd日', { locale: zhCN });
  };

  const getRecentDates = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(format(date, 'yyyy-MM-dd'));
    }
    return dates;
  };

  return (
    <div className="space-y-4">
      {/* 日期选择器 */}
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <select
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 border rounded-md bg-background"
        >
          {getRecentDates().map(date => (
            <option key={date} value={date}>
              {getDateDisplay(date)}
            </option>
          ))}
        </select>
        {!currentReport && (
          <Button onClick={handleCreateReport} size="sm">
            创建日报
          </Button>
        )}
      </div>

      {currentReport ? (
        <div className="space-y-6">
          {/* 今日任务 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">今日任务</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentReport.tasks.map((task, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="flex-1">• {task}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveTask(index)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="添加新任务..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                  className="flex-1"
                />
                <Button onClick={handleAddTask} size="sm">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 今日进展 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">今日进展</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="描述今天的工作进展..."
                value={currentReport.progress}
                onChange={(e) => handleUpdateReport({ progress: e.target.value })}
                rows={4}
                className="w-full"
              />
            </CardContent>
          </Card>

          {/* 遇到的问题 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">遇到的问题</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="记录今天遇到的问题和解决方案..."
                value={currentReport.issues}
                onChange={(e) => handleUpdateReport({ issues: e.target.value })}
                rows={3}
                className="w-full"
              />
            </CardContent>
          </Card>

          {/* 明日计划 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">明日计划</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentReport.plans.map((plan, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="flex-1">• {plan}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemovePlan(index)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="添加新计划..."
                  value={newPlan}
                  onChange={(e) => setNewPlan(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddPlan()}
                  className="flex-1"
                />
                <Button onClick={handleAddPlan} size="sm">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-4" />
          <p>选择日期创建日报</p>
        </div>
      )}
    </div>
  );
}