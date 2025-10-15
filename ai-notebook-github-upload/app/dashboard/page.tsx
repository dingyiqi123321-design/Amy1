"use client";

import { useState, useEffect } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { NoteList } from "@/components/note-list";
import { Editor } from "@/components/editor";
import { TodoManager } from "@/components/todo-manager";
import { PomodoroTimer } from "@/components/pomodoro-timer";
import { ApiKeyInput } from "@/components/api-key-input";
import { AIChatModal } from "@/components/ai-chat-modal";
import { DataRecovery } from "@/components/data-recovery";
import { AnimatedButton as Button } from "@/components/ui/animated-button";
import { Note } from "@/types/note";
import { TodoList as TodoListType } from "@/types/todo";
import { Project, ProjectTask } from "@/types/project";
import { ProjectManager } from "@/components/project-manager";
import { ReportsPage } from "@/components/reports-page";
import { UserMenu } from "@/components/auth/user-menu";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/hooks/use-auth";
import { authNoteService, authProjectService, authTodoService, authReportService } from "@/lib/auth-storage";
import { callOpenRouter } from "@/lib/ai-service";
import { DailyReport, WeeklyReport } from "@/types/report";
import { MessageCircle, Settings, FileText, Briefcase, BarChart3 } from "lucide-react";
import { generateId } from "@/lib/utils";

function DashboardContent() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [todoLists, setTodoLists] = useState<TodoListType[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectTasks, setProjectTasks] = useState<ProjectTask[]>([]);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [showChatDialog, setShowChatDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([]);
  const [weeklyReports, setWeeklyReports] = useState<WeeklyReport[]>([]);
  const [activeModule, setActiveModule] = useState<'notes' | 'projects' | 'reports'>('notes');

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedNotes, loadedTodos, loadedProjects, loadedProjectTasks, loadedDailyReports, loadedWeeklyReports] = await Promise.all([
          authNoteService.loadNotes(),
          authTodoService.loadTodoLists(),
          authProjectService.loadProjects(),
          authProjectService.loadProjectTasks(),
          authReportService.loadDailyReports(),
          authReportService.loadWeeklyReports(),
        ]);

        setNotes(loadedNotes);
        setTodoLists(loadedTodos);
        setProjects(loadedProjects);
        setProjectTasks(loadedProjectTasks);
        setDailyReports(loadedDailyReports);
        setWeeklyReports(loadedWeeklyReports);

        if (loadedNotes.length > 0 && !selectedId) {
          setSelectedId(loadedNotes[0].id);
        }
      } catch (error) {
        console.error('加载数据失败:', error);
      }
    };

    if (user) {
      loadData();
    }
  }, [user, selectedId]);

  const selectedNote = notes.find(note => note.id === selectedId);

  const handleNoteSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleNoteUpdate = async (updatedNote: Note) => {
    try {
      const result = await authNoteService.updateNote(updatedNote);
      if (result) {
        setNotes(notes.map(note => note.id === updatedNote.id ? result : note));
      }
    } catch (error) {
      console.error('更新笔记失败:', error);
    }
  };

  const handleNoteCreate = async (title: string, content: string) => {
    try {
      const result = await authNoteService.saveNote({
        title,
        content,
        summary: content.slice(0, 100) + (content.length > 100 ? '...' : ''),
      });
      
      if (result) {
        setNotes([result, ...notes]);
        setSelectedId(result.id);
      }
    } catch (error) {
      console.error('创建笔记失败:', error);
    }
  };

  const handleNoteDelete = async (id: string) => {
    try {
      const success = await authNoteService.deleteNote(id);
      if (success) {
        setNotes(notes.filter(note => note.id !== id));
        if (selectedId === id) {
          setSelectedId(notes.length > 1 ? notes.find(note => note.id !== id)?.id || null : null);
        }
      }
    } catch (error) {
      console.error('删除笔记失败:', error);
    }
  };

  const handleTodoUpdate = async (updatedTodos: TodoListType[]) => {
    setTodoLists(updatedTodos);
    // 这里可以添加保存到数据库的逻辑
  };

  const handleProjectUpdate = async (updatedProjects: Project[]) => {
    setProjects(updatedProjects);
    // 这里可以添加保存到数据库的逻辑
  };

  const handleProjectTaskUpdate = async (updatedTasks: ProjectTask[]) => {
    setProjectTasks(updatedTasks);
    // 这里可以添加保存到数据库的逻辑
  };

  const handleDailyReportUpdate = async (updatedReports: DailyReport[]) => {
    setDailyReports(updatedReports);
    // 这里可以添加保存到数据库的逻辑
  };

  const handleWeeklyReportUpdate = async (updatedReports: WeeklyReport[]) => {
    setWeeklyReports(updatedReports);
    // 这里可以添加保存到数据库的逻辑
  };

  const handleAIChat = async (message: string) => {
    setIsLoading(true);
    try {
      const response = await callOpenRouter(message, selectedNote?.content || '');
      return response;
    } catch (error) {
      console.error('AI聊天失败:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">AI 笔记</h1>
          <nav className="flex space-x-1">
            <Button
              variant={activeModule === 'notes' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveModule('notes')}
              className="flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>笔记</span>
            </Button>
            <Button
              variant={activeModule === 'projects' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveModule('projects')}
              className="flex items-center space-x-2"
            >
              <Briefcase className="w-4 h-4" />
              <span>项目</span>
            </Button>
            <Button
              variant={activeModule === 'reports' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveModule('reports')}
              className="flex items-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>报告</span>
            </Button>
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          <PomodoroTimer />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowChatDialog(true)}
            className="flex items-center space-x-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>AI助手</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowApiKeyDialog(true)}
            className="flex items-center space-x-2"
          >
            <Settings className="w-4 h-4" />
            <span>设置</span>
          </Button>
          <UserMenu />
        </div>
      </header>

      {/* 主要内容区域 */}
      <div className="flex-1 overflow-hidden">
        {activeModule === 'notes' && (
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
              <div className="h-full border-r border-gray-200 bg-white">
                <NoteList
                  notes={notes}
                  selectedId={selectedId}
                  onSelect={handleNoteSelect}
                  onCreate={handleNoteCreate}
                  onDelete={handleNoteDelete}
                />
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full bg-white">
                <Editor
                  note={selectedNote}
                  onUpdate={handleNoteUpdate}
                />
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
              <div className="h-full border-l border-gray-200 bg-white">
                <TodoManager
                  todoLists={todoLists}
                  onUpdate={handleTodoUpdate}
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}

        {activeModule === 'projects' && (
          <div className="h-full bg-white">
            <ProjectManager
              projects={projects}
              projectTasks={projectTasks}
              onProjectUpdate={handleProjectUpdate}
              onTaskUpdate={handleProjectTaskUpdate}
            />
          </div>
        )}

        {activeModule === 'reports' && (
          <div className="h-full bg-white">
            <ReportsPage
              projects={projects}
              dailyReports={dailyReports}
              weeklyReports={weeklyReports}
              onDailyReportUpdate={handleDailyReportUpdate}
              onWeeklyReportUpdate={handleWeeklyReportUpdate}
            />
          </div>
        )}
      </div>

      {/* 对话框 */}
      {showApiKeyDialog && (
        <ApiKeyInput
          onClose={() => setShowApiKeyDialog(false)}
        />
      )}

      {showChatDialog && (
        <AIChatModal
          isOpen={showChatDialog}
          onClose={() => setShowChatDialog(false)}
          onSendMessage={handleAIChat}
          isLoading={isLoading}
        />
      )}

      <DataRecovery />
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}