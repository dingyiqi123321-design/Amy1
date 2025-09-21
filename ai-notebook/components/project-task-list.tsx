"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { AnimatedButton as Button } from "@/components/ui/animated-button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, ChevronRight, ChevronDown, Edit3 } from "lucide-react";
import { ProjectTask } from "@/types/project";
import { ProjectTaskEditor } from "@/components/project-task-editor";

interface ProjectTaskListProps {
  tasks: ProjectTask[];
  onUpdateTask: (task: ProjectTask) => void;
  onCreateTask: (title: string, parentId?: string) => void;
  onDeleteTask: (taskId: string) => void;
}

interface TaskItemProps {
  task: ProjectTask;
  level: number;
  childTasks: ProjectTask[];
  onUpdateTask: (task: ProjectTask) => void;
  onCreateTask: (title: string, parentId?: string) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleExpand: (taskId: string) => void;
  expandedTasks: Set<string>;
}

function TaskItem({ 
  task, 
  level, 
  childTasks, 
  onUpdateTask, 
  onCreateTask, 
  onDeleteTask,
  onToggleExpand,
  expandedTasks
}: TaskItemProps) {
  const [showNewSubtask, setShowNewSubtask] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [showTaskEditor, setShowTaskEditor] = useState(false);
  const isExpanded = expandedTasks.has(task.id);
  const hasChildren = childTasks.length > 0;

  const handleToggleComplete = () => {
    onUpdateTask({ ...task, isCompleted: !task.isCompleted });
  };

  const handleCreateSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    onCreateTask(newSubtaskTitle.trim(), task.id);
    setNewSubtaskTitle("");
    setShowNewSubtask(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '中';
    }
  };

  return (
    <div>
      <ProjectTaskEditor
        open={showTaskEditor}
        onOpenChange={setShowTaskEditor}
        task={task}
        onSave={onUpdateTask}
        onDelete={onDeleteTask}
      />
      
      <div 
        className={`flex items-center gap-2 p-2 rounded hover:bg-gray-50 group ${
          level > 0 ? 'ml-' + (level * 4) : ''
        }`}
        style={{ marginLeft: level * 16 }}
      >
        {hasChildren && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onToggleExpand(task.id)}
            className="h-6 w-6 p-0"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        )}
        
        <Checkbox
          checked={task.isCompleted}
          onCheckedChange={handleToggleComplete}
        />
        
        <div 
          className="flex-1 cursor-pointer"
          onClick={() => setShowTaskEditor(true)}
        >
          <div className="flex items-center gap-2">
            <span className={`text-sm ${task.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </span>
            <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(task.priority)} bg-opacity-10`}>
              {getPriorityText(task.priority)}
            </span>
          </div>
          {task.dueDate && (
            <div className="text-xs text-muted-foreground">
              截止: {new Date(task.dueDate).toLocaleDateString('zh-CN')}
            </div>
          )}
          {task.assignee && (
            <div className="text-xs text-muted-foreground">
              负责人: {task.assignee}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowNewSubtask(true)}
            className="h-6 w-6 p-0"
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowTaskEditor(true)}
            className="h-6 w-6 p-0"
          >
            <Edit3 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {showNewSubtask && (
        <div className="flex items-center gap-2 p-2 ml-4" style={{ marginLeft: (level + 1) * 16 }}>
          <Input
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            placeholder="输入子任务标题"
            className="flex-1 h-8 text-sm"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCreateSubtask();
              } else if (e.key === 'Escape') {
                setShowNewSubtask(false);
                setNewSubtaskTitle('');
              }
            }}
            autoFocus
          />
          <Button size="sm" onClick={handleCreateSubtask} className="h-8">
            添加
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => {
              setShowNewSubtask(false);
              setNewSubtaskTitle('');
            }}
            className="h-8"
          >
            取消
          </Button>
        </div>
      )}

      {isExpanded && childTasks.map((childTask) => (
        <TaskItem
          key={childTask.id}
          task={childTask}
          level={level + 1}
          childTasks={[]}
          onUpdateTask={onUpdateTask}
          onCreateTask={onCreateTask}
          onDeleteTask={onDeleteTask}
          onToggleExpand={onToggleExpand}
          expandedTasks={expandedTasks}
        />
      ))}
    </div>
  );
}

export function ProjectTaskList({ 
  tasks, 
  onUpdateTask, 
  onCreateTask, 
  onDeleteTask 
}: ProjectTaskListProps) {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  const rootTasks = tasks.filter(task => !task.parentId);

  const getChildTasks = (parentId: string) => {
    return tasks.filter(task => task.parentId === parentId);
  };

  const handleToggleExpand = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) return;
    onCreateTask(newTaskTitle.trim());
    setNewTaskTitle("");
  };

  return (
    <Card className="p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">任务列表</h3>
        <div className="flex items-center gap-2">
          <Input
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="添加新任务..."
            className="flex-1"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCreateTask();
              }
            }}
          />
          <Button onClick={handleCreateTask} disabled={!newTaskTitle.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            添加
          </Button>
        </div>
      </div>

      <div className="space-y-1 max-h-[400px] overflow-y-auto">
        {rootTasks.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>还没有任务</p>
            <p className="text-sm">在上方输入框中添加第一个任务</p>
          </div>
        ) : (
          rootTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              level={0}
              childTasks={getChildTasks(task.id)}
              onUpdateTask={onUpdateTask}
              onCreateTask={onCreateTask}
              onDeleteTask={onDeleteTask}
              onToggleExpand={handleToggleExpand}
              expandedTasks={expandedTasks}
            />
          ))
        )}
      </div>
    </Card>
  );
}