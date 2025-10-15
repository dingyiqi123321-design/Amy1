"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedButton as Button } from "@/components/ui/animated-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Calendar } from "lucide-react";
import { WeeklyReport } from "@/types/report";
import { format, startOfWeek, endOfWeek, parseISO } from "date-fns";
import { zhCN } from "date-fns/locale";

interface WeeklyReportEditorProps {
  projectId: string;
  weeklyReports: WeeklyReport[];
  onUpdateWeeklyReports: (reports: WeeklyReport[]) => void;
}

export function WeeklyReportEditor({ 
  projectId, 
  weeklyReports, 
  onUpdateWeeklyReports 
}: WeeklyReportEditorProps) {
  const [selectedWeekStart, setSelectedWeekStart] = useState(
    format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
  );
  const [currentReport, setCurrentReport] = useState<WeeklyReport | null>(null);
  const [newAchievement, setNewAchievement] = useState("");
  const [newChallenge, setNewChallenge] = useState("");
  const [newPlan, setNewPlan] = useState("");

  const weekEnd = format(endOfWeek(parseISO(selectedWeekStart), { weekStartsOn: 1 }), 'yyyy-MM-dd');

  useEffect(() => {
    const report = weeklyReports.find(r => r.weekStart === selectedWeekStart && r.projectId === projectId);
    if (report) {
      setCurrentReport(report);
    } else {
      setCurrentReport(null);
    }
  }, [selectedWeekStart, projectId, weeklyReports]);

  const handleCreateReport = () => {
    const newReport: WeeklyReport = {
      id: crypto.randomUUID(),
      projectId,
      weekStart: selectedWeekStart,
      weekEnd,
      summary: "",
      achievements: [],
      challenges: [],
      nextWeekPlans: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedReports = [...weeklyReports, newReport];
    onUpdateWeeklyReports(updatedReports);
    setCurrentReport(newReport);
  };

  const handleUpdateReport = (updates: Partial<WeeklyReport>) => {
    if (!currentReport) return;

    const updatedReport = {
      ...currentReport,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const updatedReports = weeklyReports.map(report =>
      report.id === currentReport.id ? updatedReport : report
    );
    
    onUpdateWeeklyReports(updatedReports);
    setCurrentReport(updatedReport);
  };

  const handleAddAchievement = () => {
    if (!currentReport || !newAchievement.trim()) return;

    const updatedAchievements = [...currentReport.achievements, newAchievement.trim()];
    handleUpdateReport({ achievements: updatedAchievements });
    setNewAchievement("");
  };

  const handleRemoveAchievement = (index: number) => {
    if (!currentReport) return;

    const updatedAchievements = currentReport.achievements.filter((_, i) => i !== index);
    handleUpdateReport({ achievements: updatedAchievements });
  };

  const handleAddChallenge = () => {
    if (!currentReport || !newChallenge.trim()) return;

    const updatedChallenges = [...currentReport.challenges, newChallenge.trim()];
    handleUpdateReport({ challenges: updatedChallenges });
    setNewChallenge("");
  };

  const handleRemoveChallenge = (index: number) => {
    if (!currentReport) return;

    const updatedChallenges = currentReport.challenges.filter((_, i) => i !== index);
    handleUpdateReport({ challenges: updatedChallenges });
  };

  const handleAddPlan = () => {
    if (!currentReport || !newPlan.trim()) return;

    const updatedPlans = [...currentReport.nextWeekPlans, newPlan.trim()];
    handleUpdateReport({ nextWeekPlans: updatedPlans });
    setNewPlan("");
  };

  const handleRemovePlan = (index: number) => {
    if (!currentReport) return;

    const updatedPlans = currentReport.nextWeekPlans.filter((_, i) => i !== index);
    handleUpdateReport({ nextWeekPlans: updatedPlans });
  };

  const getWeekDisplay = (weekStart: string) => {
    const start = parseISO(weekStart);
    const end = endOfWeek(start, { weekStartsOn: 1 });
    return `${format(start, 'MM月dd日', { locale: zhCN })} - ${format(end, 'MM月dd日', { locale: zhCN })}`;
  };

  const getRecentWeeks = () => {
    const weeks = [];
    for (let i = 4; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - (i * 7));
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
      weeks.push(format(weekStart, 'yyyy-MM-dd'));
    }
    return weeks;
  };

  return (
    <div className="space-y-4">
      {/* 周选择器 */}
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <select
          value={selectedWeekStart}
          onChange={(e) => setSelectedWeekStart(e.target.value)}
          className="px-3 py-2 border rounded-md bg-background"
        >
          {getRecentWeeks().map(weekStart => (
            <option key={weekStart} value={weekStart}>
              {getWeekDisplay(weekStart)}
            </option>
          ))}
        </select>
        {!currentReport && (
          <Button onClick={handleCreateReport} size="sm">
            创建周报
          </Button>
        )}
      </div>

      {currentReport ? (
        <div className="space-y-6">
          {/* 本周总结 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">本周总结</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="总结本周整体工作情况..."
                value={currentReport.summary}
                onChange={(e) => handleUpdateReport({ summary: e.target.value })}
                rows={4}
                className="w-full"
              />
            </CardContent>
          </Card>

          {/* 主要成果 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">主要成果</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentReport.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="flex-1">• {achievement}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveAchievement(index)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="添加新成果..."
                  value={newAchievement}
                  onChange={(e) => setNewAchievement(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddAchievement()}
                  className="flex-1"
                />
                <Button onClick={handleAddAchievement} size="sm">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 遇到的挑战 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">遇到的挑战</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentReport.challenges.map((challenge, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="flex-1">• {challenge}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveChallenge(index)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="添加新挑战..."
                  value={newChallenge}
                  onChange={(e) => setNewChallenge(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddChallenge()}
                  className="flex-1"
                />
                <Button onClick={handleAddChallenge} size="sm">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 下周计划 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">下周计划</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentReport.nextWeekPlans.map((plan, index) => (
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
          <p>选择周次创建周报</p>
        </div>
      )}
    </div>
  );
}