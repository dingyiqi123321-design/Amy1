"use client";

import { useState } from "react";
import { AnimatedButton as Button } from "@/components/ui/animated-button";
import { Input } from "@/components/ui/input";
import { Plus, Folder, Edit3 } from "lucide-react";
import { Project } from "@/types/project";

interface ProjectSidebarProps {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (projectId: string) => void;
  onCreateProject: (name: string) => void;
  onUpdateProject: (projectId: string, name: string) => void;
}

export function ProjectSidebar({ 
  projects, 
  selectedProjectId, 
  onSelectProject, 
  onCreateProject,
  onUpdateProject 
}: ProjectSidebarProps) {
  const [showNewProjectInput, setShowNewProjectInput] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingProjectName, setEditingProjectName] = useState("");

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    
    onCreateProject(newProjectName.trim());
    setNewProjectName("");
    setShowNewProjectInput(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateProject();
    } else if (e.key === 'Escape') {
      setShowNewProjectInput(false);
      setNewProjectName("");
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProjectId(project.id);
    setEditingProjectName(project.name);
  };

  const handleSaveEdit = () => {
    if (editingProjectId && editingProjectName.trim()) {
      onUpdateProject(editingProjectId, editingProjectName.trim());
    }
    setEditingProjectId(null);
    setEditingProjectName("");
  };

  const handleCancelEdit = () => {
    setEditingProjectId(null);
    setEditingProjectName("");
  };

  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">项目</h2>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowNewProjectInput(true)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {showNewProjectInput && (
        <div className="mb-4">
          <Input
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="输入项目名称"
            onKeyDown={handleKeyPress}
            autoFocus
            className="mb-2"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleCreateProject}>
              创建
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => {
                setShowNewProjectInput(false);
                setNewProjectName("");
              }}
            >
              取消
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-2 max-h-[calc(100vh-200px)]">
        {projects.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Folder className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">还没有项目</p>
            <p className="text-xs">点击上方按钮创建第一个项目</p>
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className={`group p-3 rounded-lg transition-colors ${
                selectedProjectId === project.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              {editingProjectId === project.id ? (
                <div className="space-y-2">
                  <Input
                    value={editingProjectName}
                    onChange={(e) => setEditingProjectName(e.target.value)}
                    onKeyDown={handleEditKeyPress}
                    onBlur={handleSaveEdit}
                    autoFocus
                    className="text-sm"
                  />
                </div>
              ) : (
                <div
                  onClick={() => onSelectProject(project.id)}
                  onDoubleClick={() => handleEditProject(project)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <Folder className="h-4 w-4" />
                      <span className="font-medium">{project.name}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditProject(project);
                      }}
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="text-xs opacity-75 mt-1">
                    {new Date(project.createdAt).toLocaleDateString('zh-CN')}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}