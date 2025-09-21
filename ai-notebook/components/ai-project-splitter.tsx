"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedButton as Button } from "@/components/ui/animated-button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, FileText } from "lucide-react";
import { Project, ProjectTask } from "@/types/project";
import { generateId } from "@/lib/utils";
import { callOpenRouter } from "@/lib/ai-service";

interface AIProjectSplitterProps {
  onProjectsCreated: (projects: Project[], tasks: ProjectTask[]) => void;
}

interface ParsedProject {
  name: string;
  description?: string;
  tasks: {
    title: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    subtasks?: {
      title: string;
      description?: string;
    }[];
  }[];
}

export function AIProjectSplitter({ onProjectsCreated }: AIProjectSplitterProps) {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSplitProjects = async () => {
    if (!inputText.trim()) {
      alert("请输入项目描述或会议纪要");
      return;
    }

    setIsLoading(true);
    try {
      const prompt = `请分析以下文本内容，将其拆分为项目和任务的层级结构。请以JSON格式返回，格式如下：
{
  "projects": [
    {
      "name": "项目名称",
      "description": "项目描述（可选）",
      "tasks": [
        {
          "title": "任务标题",
          "description": "任务描述（可选）",
          "priority": "high/medium/low",
          "subtasks": [
            {
              "title": "子任务标题",
              "description": "子任务描述（可选）"
            }
          ]
        }
      ]
    }
  ]
}

请确保：
1. 项目名称简洁明了，不超过20个字
2. 任务标题清晰具体，不超过30个字
3. 合理设置任务优先级（high/medium/low）
4. 如果有子任务，请适当拆分
5. 描述字段可以为空

文本内容：
${inputText}`;

      const result = await callOpenRouter(prompt, 'chat') as string;
      
      // 解析AI返回的JSON
      let parsedData;
      try {
        // 尝试提取JSON部分
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("未找到有效的JSON格式");
        }
      } catch (parseError) {
        console.error("JSON解析失败:", parseError);
        alert("AI返回的数据格式有误，请重试");
        return;
      }

      if (!parsedData.projects || !Array.isArray(parsedData.projects)) {
        alert("AI返回的项目数据格式不正确");
        return;
      }

      // 转换为应用所需的数据格式
      const projects: Project[] = [];
      const allTasks: ProjectTask[] = [];

      parsedData.projects.forEach((projectData: ParsedProject) => {
        const projectId = generateId();
        
        // 创建项目
        const project: Project = {
          id: projectId,
          name: projectData.name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        projects.push(project);

        // 创建任务
        if (projectData.tasks && Array.isArray(projectData.tasks)) {
          projectData.tasks.forEach((taskData, taskIndex) => {
            const taskId = generateId();
            
            const task: ProjectTask = {
              id: taskId,
              projectId: projectId,
              title: taskData.title,
              description: taskData.description || "",
              isCompleted: false,
              priority: taskData.priority || 'medium',
              dueDate: "",
              assignee: "",
              parentId: "",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            allTasks.push(task);

            // 创建子任务
            if (taskData.subtasks && Array.isArray(taskData.subtasks)) {
              taskData.subtasks.forEach((subtaskData, subtaskIndex) => {
                const subtaskId = generateId();
                
                const subtask: ProjectTask = {
                  id: subtaskId,
                  projectId: projectId,
                  title: subtaskData.title,
                  description: subtaskData.description || "",
                  isCompleted: false,
                  priority: 'medium',
                  dueDate: "",
                  assignee: "",
                  parentId: taskId,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                };
                allTasks.push(subtask);
              });
            }
          });
        }
      });

      // 调用回调函数创建项目和任务
      onProjectsCreated(projects, allTasks);
      
      // 清空输入
      setInputText("");
      setIsExpanded(false);
      
      alert(`成功创建了 ${projects.length} 个项目和 ${allTasks.length} 个任务！`);
      
    } catch (error) {
      console.error("AI项目拆分失败:", error);
      alert("AI项目拆分失败，请检查网络连接和API配置");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-blue-500" />
          AI 项目拆分
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isExpanded ? (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">
              输入项目描述或会议纪要，AI 将自动为您拆分出项目和任务
            </p>
            <Button
              onClick={() => setIsExpanded(true)}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              开始使用 AI 拆分
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="project-input" className="text-sm font-medium">
                项目描述或会议纪要
              </Label>
              <Textarea
                id="project-input"
                placeholder="例如：我们需要开发一个电商网站，包含用户注册登录、商品展示、购物车、订单管理、支付系统等功能。前端使用React，后端使用Node.js，数据库使用MySQL..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="mt-2 min-h-[120px]"
                disabled={isLoading}
              />
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setIsExpanded(false);
                  setInputText("");
                }}
                disabled={isLoading}
              >
                取消
              </Button>
              <Button
                onClick={handleSplitProjects}
                disabled={isLoading || !inputText.trim()}
                className="gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    AI 分析中...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    开始拆分
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}