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
import { loadNotesFromLocalStorage, saveNotesToLocalStorage, getApiKey } from "@/lib/storage";
import { loadTodosFromLocalStorage, saveTodosToLocalStorage, createTodoList } from "@/lib/todo-storage";
import { loadProjectsFromLocalStorage, saveProjectsToLocalStorage, loadProjectTasksFromLocalStorage, saveProjectTasksToLocalStorage } from "@/lib/project-storage";
import { callOpenRouter } from "@/lib/ai-service";
import { loadDailyReportsFromLocalStorage, saveDailyReportsToLocalStorage, loadWeeklyReportsFromLocalStorage, saveWeeklyReportsToLocalStorage } from "@/lib/report-storage";
import { DailyReport, WeeklyReport } from "@/types/report";
import { MessageCircle, Settings, FileText, Briefcase, BarChart3 } from "lucide-react";
import { generateId } from "@/lib/utils";

export default function Home() {
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

  useEffect(() => {
    const loadedNotes = loadNotesFromLocalStorage();
    const loadedTodos = loadTodosFromLocalStorage();
    const loadedProjects = loadProjectsFromLocalStorage();
    const loadedProjectTasks = loadProjectTasksFromLocalStorage();
    const loadedDailyReports = loadDailyReportsFromLocalStorage();
    const loadedWeeklyReports = loadWeeklyReportsFromLocalStorage();

    setNotes(loadedNotes);
    setTodoLists(loadedTodos);
    setProjects(loadedProjects);
    setProjectTasks(loadedProjectTasks);
    setDailyReports(loadedDailyReports);
    setWeeklyReports(loadedWeeklyReports);
    
    if (loadedNotes.length > 0) {
      setSelectedId(loadedNotes[0].id);
    }
    
    // 检查是否需要显示API Key对话框
    if (!getApiKey()) {
      setShowApiKeyDialog(true);
    }
  }, []);

  useEffect(() => {
    saveNotesToLocalStorage(notes);
  }, [notes]);

  useEffect(() => {
    saveTodosToLocalStorage(todoLists);
  }, [todoLists]);

  useEffect(() => {
    saveProjectsToLocalStorage(projects);
  }, [projects]);

  useEffect(() => {
    saveProjectTasksToLocalStorage(projectTasks);
  }, [projectTasks]);

  useEffect(() => {
    saveDailyReportsToLocalStorage(dailyReports);
  }, [dailyReports]);

  useEffect(() => {
    saveWeeklyReportsToLocalStorage(weeklyReports);
  }, [weeklyReports]);

  const createNote = () => {
    const newNote: Note = {
      id: generateId(),
      title: "新笔记",
      content: "",
      summary: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes(prev => [newNote, ...prev]);
    setSelectedId(newNote.id);
  };

  const updateNote = async (id: string, content: string) => {
    const note = notes.find(n => n.id === id);
    const shouldGenerateTitle = note && content.length > 50 && content !== note.content && content.trim().length > 0;
    
    setNotes(prev => 
      prev.map(note => 
        note.id === id 
          ? { ...note, content, updatedAt: new Date().toISOString() }
          : note
      )
    );

    // 如果内容发生显著变化，调用AI生成标题和摘要
    if (shouldGenerateTitle) {
      setIsLoading(true);
      try {
        const result = await callOpenRouter(content, 'generate');
        if (result && typeof result === 'object' && 'title' in result) {
          setNotes(prev => 
            prev.map(n => 
              n.id === id 
                ? { ...n, title: result.title, summary: result.summary }
                : n
            )
          );
        }
      } catch (error) {
        console.error('AI生成失败:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    if (selectedId === id) {
      const remainingNotes = notes.filter(note => note.id !== id);
      setSelectedId(remainingNotes.length > 0 ? remainingNotes[0].id : null);
    }
  };

  const selectedNote = notes.find(note => note.id === selectedId);

  const handleUpdateTodoList = (updatedTodoList: TodoListType) => {
    setTodoLists(prev => 
      prev.map(todoList => 
        todoList.id === updatedTodoList.id ? updatedTodoList : todoList
      )
    );
  };

  const handleCreateTodoList = () => {
    const newTodoList = createTodoList();
    setTodoLists(prev => [...prev, newTodoList]);
  };

  const handleDeleteTodoList = (id: string) => {
    setTodoLists(prev => prev.filter(todoList => todoList.id !== id));
  };

  const handleDataRestored = (restoredNotes: Note[], restoredTodos: TodoListType[]) => {
    setNotes(restoredNotes);
    setTodoLists(restoredTodos);
    if (restoredNotes.length > 0) {
      setSelectedId(restoredNotes[0].id);
    }
  };

  const handleUpdateProjects = (updatedProjects: Project[]) => {
    setProjects(updatedProjects);
  };

  const handleUpdateProjectTasks = (updatedTasks: ProjectTask[]) => {
    setProjectTasks(updatedTasks);
  };

  const handleUpdateDailyReports = (updatedReports: DailyReport[]) => {
    setDailyReports(updatedReports);
  };

  const handleUpdateWeeklyReports = (updatedReports: WeeklyReport[]) => {
    setWeeklyReports(updatedReports);
  };

  const hasData = notes.length > 0 || todoLists.length > 0 || projects.length > 0;

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">AI 记事本</h1>
        <div className="flex items-center gap-2">
          {/* 模块切换按钮 */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <Button
              size="sm"
              variant={activeModule === 'notes' ? 'default' : 'ghost'}
              onClick={() => setActiveModule('notes')}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              记事本
            </Button>
            <Button
              size="sm"
              variant={activeModule === 'projects' ? 'default' : 'ghost'}
              onClick={() => setActiveModule('projects')}
              className="gap-2"
            >
              <Briefcase className="h-4 w-4" />
              项目
            </Button>
            <Button
              size="sm"
              variant={activeModule === 'reports' ? 'default' : 'ghost'}
              onClick={() => setActiveModule('reports')}
              className="gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              报告
            </Button>
          </div>

          {isLoading && (
            <div className="text-sm text-muted-foreground">AI 处理中...</div>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowApiKeyDialog(true)}
            className="gap-2"
          >
            <Settings className="h-4 w-4" />
            设置
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowChatDialog(true)}
            className="gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            AI 问答
          </Button>
        </div>
      </header>

      {hasData ? (
        activeModule === 'notes' ? (
          <ResizablePanelGroup direction="horizontal" className="flex-1">
            <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
              <NoteList
                notes={notes}
                selectedId={selectedId}
                onSelectNote={setSelectedId}
                onCreateNote={createNote}
                onDeleteNote={deleteNote}
              />
            </ResizablePanel>
            
            <ResizableHandle />
            
            <ResizablePanel defaultSize={40} minSize={30}>
              <Editor
                note={selectedNote || null}
                onUpdateNote={updateNote}
                isAiGenerating={isLoading}
              />
            </ResizablePanel>
            
            <ResizableHandle />
            
            <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
              <TodoManager
                todoLists={todoLists}
                onUpdateTodoList={handleUpdateTodoList}
                onCreateTodoList={handleCreateTodoList}
                onDeleteTodoList={handleDeleteTodoList}
              />
            </ResizablePanel>
            
            <ResizableHandle />
            
            <ResizablePanel defaultSize={15} minSize={12} maxSize={25}>
              <PomodoroTimer className="h-full" />
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : activeModule === 'reports' ? (
          <ReportsPage
            dailyReports={dailyReports}
            weeklyReports={weeklyReports}
            onUpdateDailyReports={handleUpdateDailyReports}
            onUpdateWeeklyReports={handleUpdateWeeklyReports}
          />
        ) : (
          <ProjectManager
            projects={projects}
            tasks={projectTasks}
            onUpdateProjects={handleUpdateProjects}
            onUpdateTasks={handleUpdateProjectTasks}
          />
        )
      ) : (
        <div className="flex-1 flex items-center justify-center p-8">
          <DataRecovery onDataRestored={handleDataRestored} />
        </div>
      )}

      <ApiKeyInput
        open={showApiKeyDialog}
        onOpenChange={setShowApiKeyDialog}
      />

      <AIChatModal
        open={showChatDialog}
        onOpenChange={setShowChatDialog}
        notes={notes}
        todoLists={todoLists}
      />
    </div>
  );
}
