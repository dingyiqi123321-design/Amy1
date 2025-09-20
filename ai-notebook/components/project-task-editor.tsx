"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AnimatedButton as Button } from "@/components/ui/animated-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectTask } from "@/types/project";
import { generateId } from "@/lib/utils";

interface ProjectTaskEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: ProjectTask | null;
  onSave: (task: ProjectTask) => void;
  onDelete?: (taskId: string) => void;
}

export function ProjectTaskEditor({ 
  open, 
  onOpenChange, 
  task, 
  onSave, 
  onDelete 
}: ProjectTaskEditorProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium" as "high" | "medium" | "low",
    assignee: "",
    isCompleted: false,
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        assignee: task.assignee,
        isCompleted: task.isCompleted,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
        assignee: "",
        isCompleted: false,
      });
    }
  }, [task, open]);

  const handleSave = () => {
    if (!formData.title.trim()) return;

    const updatedTask: ProjectTask = task
      ? {
          ...task,
          ...formData,
          title: formData.title.trim(),
          updatedAt: new Date().toISOString(),
        }
      : {
          id: generateId(),
          projectId: "", // 需要外部设置
          parentId: null,
          ...formData,
          title: formData.title.trim(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

    onSave(updatedTask);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (task && onDelete) {
      onDelete(task.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{task ? "编辑任务" : "创建任务"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">任务标题 *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="输入任务标题"
            />
          </div>

          <div>
            <Label htmlFor="description">详细描述</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="输入任务详细描述"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="dueDate">截止日期</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="priority">优先级</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: "high" | "medium" | "low") =>
                setFormData({ ...formData, priority: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">高</SelectItem>
                <SelectItem value="medium">中</SelectItem>
                <SelectItem value="low">低</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="assignee">负责人</Label>
            <Input
              id="assignee"
              value={formData.assignee}
              onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
              placeholder="输入负责人姓名"
            />
          </div>

          {task && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isCompleted"
                checked={formData.isCompleted}
                onChange={(e) => setFormData({ ...formData, isCompleted: e.target.checked })}
              />
              <Label htmlFor="isCompleted">标记为已完成</Label>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <div>
            {task && onDelete && (
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                删除
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button size="sm" onClick={handleSave} disabled={!formData.title.trim()}>
              保存
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}