"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { AnimatedButton as Button } from "@/components/ui/animated-button";
import { Input } from "@/components/ui/input";
import { Plus, Folder, BarChart3 } from "lucide-react";
import { Project } from "@/types/project";
import { ProjectTask } from "@/types/project";
import { DailyReport, WeeklyReport } from "@/types/report";
import { ProjectSidebar } from "@/components/project-sidebar";
import { ProjectTaskList } from "@/components/project-task-list";
import { AIProjectSplitter } from "@/components/ai-project-splitter";
import { ReportManager } from "@/components/report-manager";
import { generateId } from "@/lib/utils";

interface ProjectManagerProps {
  projects: Project[];
  tasks: ProjectTask[];
  onUpdateProjects: (projects: Project[]) => void;
  onUpdateTasks: (tasks: ProjectTask[]) => void;
  dailyReports?: DailyReport[];
  weeklyReports?: WeeklyReport[];
  onUpdateDailyReports?: (reports: DailyReport[]) => void;
  onUpdateWeeklyReports?: (reports: WeeklyReport[]) => void;
}

export function ProjectManager({ 
  projects, 
  tasks, 
  onUpdateProjects, 
  onUpdateTasks,
  dailyReports = [],
  weeklyReports = [],
  onUpdateDailyReports,
  onUpdateWeeklyReports
}: ProjectManagerProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    projects.length > 0 ? projects[0].id : null
  );
  const [activeView, setActiveView] = useState<'tasks' | 'reports'>('tasks');
  const [newProjectName, setNewProjectName] = useState<string>("");

  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const projectTasks = tasks.filter(t => t.projectId === selectedProjectId);

  const handleCreateProject = (name: string) => {
    const newProject: Project = {
      id: generateId(),
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedProjects = [...projects, newProject];
    onUpdateProjects(updatedProjects);
    setSelectedProjectId(newProject.id);
  };


  const handleCreateTask = (title: string, parentId?: string) => {
    if (!selectedProjectId) return;

    const newTask: ProjectTask = {
      id: generateId(),
      projectId: selectedProjectId,
      parentId: parentId || null,
      title,
      description: '',
      dueDate: '',
      priority: 'medium',
      assignee: '',
      isCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedTasks = [...tasks, newTask];
    onUpdateTasks(updatedTasks);
  };

  const handleUpdateTask = (updatedTask: ProjectTask) => {
    const updatedTasks = tasks.map(t => 
      t.id === updatedTask.id ? { ...updatedTask, updatedAt: new Date().toISOString() } : t
    );
    onUpdateTasks(updatedTasks);
  };

  const handleDeleteTask = (taskId: string) => {
    // 删除任务及其所有子任务
    const taskToDelete = tasks.find(t => t.id === taskId);
    if (!taskToDelete) return;

    const getAllChildTaskIds = (parentId: string): string[] => {
      const childIds: string[] = [];
      const directChildren = tasks.filter(t => t.parentId === parentId);
      
      directChildren.forEach(child => {
        childIds.push(child.id);
        childIds.push(...getAllChildTaskIds(child.id));
      });
      
      return childIds;
    };

    const childTaskIds = getAllChildTaskIds(taskId);
    const allTaskIdsToDelete = [taskId, ...childTaskIds];
    
    const updatedTasks = tasks.filter(t => !allTaskIdsToDelete.includes(t.id));
    onUpdateTasks(updatedTasks);
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const handleUpdateProject = (projectId: string, name: string) => {
    const updatedProjects = projects.map(project => 
      project.id === projectId 
        ? { ...project, name, updatedAt: new Date().toISOString() }
        : project
    );
    onUpdateProjects(updatedProjects);
  };

  const handleAIProjectsCreated = (newProjects: Project[], newTasks: ProjectTask[]) => {
    // 添加新项目
    const updatedProjects = [...projects, ...newProjects];
    onUpdateProjects(updatedProjects);
    
    // 添加新任务
    const updatedTasks = [...tasks, ...newTasks];
    onUpdateTasks(updatedTasks);
    
    // 选择第一个新创建的项目
    if (newProjects.length > 0) {
      setSelectedProjectId(newProjects[0].id);
    }
  };

  if (projects.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="max-w-2xl w-full space-y-6">
          {/* AI 项目拆分组件 */}
          <AIProjectSplitter onProjectsCreated={handleAIProjectsCreated} />
          
          {/* 或者手动创建项目 */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">或者</span>
            </div>
          </div>
          
          <Card className="p-8 text-center">
            <Folder className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">手动创建项目</h2>
            <p className="text-muted-foreground mb-6">
              创建你的第一个项目，开始管理任务和子任务
            </p>
            <div className="space-y-2">
              <Input
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="输入项目名称"
                className="mb-2"
              />
              <Button 
                onClick={() => {
                  if (newProjectName.trim()) {
                    handleCreateProject(newProjectName.trim());
                    setNewProjectName("");
                  }
                }}
                disabled={!newProjectName.trim()}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                创建项目
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* 左侧项目列表 */}
      <div className="w-64 border-r flex flex-col">
        <div className="flex-1">
          <ProjectSidebar
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={handleSelectProject}
            onCreateProject={handleCreateProject}
            onUpdateProject={handleUpdateProject}
          />
        </div>
        
        {selectedProject && (
          <div className="border-t p-4">
            <div className="flex gap-1">
              <Button
                variant={activeView === 'tasks' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('tasks')}
                className="flex-1"
              >
                任务
              </Button>
              <Button
                variant={activeView === 'reports' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('reports')}
                className="flex-1"
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                报告
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 右侧内容区域 */}
      <div className="flex-1 p-4">
        {/* AI 项目拆分功能 - 始终显示 */}
        <div className="mb-6">
          <AIProjectSplitter onProjectsCreated={handleAIProjectsCreated} />
        </div>
        
        {selectedProject ? (
          activeView === 'tasks' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{selectedProject.name}</h1>
                <div className="text-sm text-muted-foreground">
                  {projectTasks.length} 个任务
                </div>
              </div>
              
              <ProjectTaskList
                tasks={projectTasks}
                onUpdateTask={handleUpdateTask}
                onCreateTask={handleCreateTask}
                onDeleteTask={handleDeleteTask}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{selectedProject.name} - 报告管理</h1>
                <div className="text-sm text-muted-foreground">
                  日报周报管理
                </div>
              </div>
              
              {selectedProjectId && (
                <ReportManager
                  projectId={selectedProjectId}
                  dailyReports={dailyReports}
                  weeklyReports={weeklyReports}
                  onUpdateDailyReports={onUpdateDailyReports || (() => {})}
                  onUpdateWeeklyReports={onUpdateWeeklyReports || (() => {})}
                />
              )}
            </div>
          )
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <Folder className="h-12 w-12 mx-auto mb-4" />
              <p>请选择一个项目</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}