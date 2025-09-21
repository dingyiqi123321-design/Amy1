"use client";

import { useState } from "react";
import { AnimatedButton as Button } from "@/components/ui/animated-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// Alert component removed - using Card instead
import { RefreshCw, Download, Trash2, CheckCircle } from "lucide-react";
import { Note } from "@/types/note";
import { TodoList } from "@/types/todo";

interface DataRecoveryProps {
  onDataRestored: (notes: Note[], todos: TodoList[]) => void;
}

export function DataRecovery({ onDataRestored }: DataRecoveryProps) {
  const [isRestoring, setIsRestoring] = useState(false);
  const [message, setMessage] = useState("");

  // 示例笔记数据
  const sampleNotes: Note[] = [
    {
      id: 'note-1',
      title: '我的第一篇笔记',
      content: '# 欢迎使用AI笔记本\n\n这是一个功能强大的笔记应用，支持：\n- Markdown编辑\n- AI问答\n- 待办事项管理\n\n开始记录你的想法吧！',
      summary: '欢迎使用AI笔记本的说明文档',
      createdAt: new Date('2024-01-01').toISOString(),
      updatedAt: new Date('2024-01-01').toISOString()
    },
    {
      id: 'note-2',
      title: '学习计划',
      content: '# 2024年学习计划\n\n## 技术学习\n- React 18新特性\n- TypeScript进阶\n- Node.js后端开发\n\n## 读书计划\n- 《代码整洁之道》\n- 《设计模式》\n- 《算法导论》',
      summary: '2024年学习计划和读书清单',
      createdAt: new Date('2024-01-02').toISOString(),
      updatedAt: new Date('2024-01-02').toISOString()
    },
    {
      id: 'note-3',
      title: '项目想法',
      content: '# 项目想法收集\n\n## Web应用\n1. 个人博客系统\n2. 在线代码编辑器\n3. 任务管理工具\n\n## 移动应用\n1. 习惯追踪器\n2. 记账应用\n3. 学习打卡应用',
      summary: 'Web和移动应用项目想法收集',
      createdAt: new Date('2024-01-03').toISOString(),
      updatedAt: new Date('2024-01-03').toISOString()
    }
  ];

  // 示例待办事项数据
  const sampleTodos: TodoList[] = [
    {
      id: 'todo-list-1',
      title: '工作任务',
      items: [
        {
          id: 'todo-1',
          text: '完成项目文档',
          completed: false,
          createdAt: new Date('2024-01-01').toISOString(),
          updatedAt: new Date('2024-01-01').toISOString()
        },
        {
          id: 'todo-2',
          text: '代码审查',
          completed: true,
          createdAt: new Date('2024-01-01').toISOString(),
          updatedAt: new Date('2024-01-01').toISOString()
        },
        {
          id: 'todo-3',
          text: '团队会议准备',
          completed: false,
          createdAt: new Date('2024-01-02').toISOString(),
          updatedAt: new Date('2024-01-02').toISOString()
        }
      ],
      createdAt: new Date('2024-01-01').toISOString(),
      updatedAt: new Date('2024-01-02').toISOString()
    },
    {
      id: 'todo-list-2',
      title: '个人事务',
      items: [
        {
          id: 'todo-4',
          text: '买菜',
          completed: true,
          createdAt: new Date('2024-01-03').toISOString(),
          updatedAt: new Date('2024-01-03').toISOString()
        },
        {
          id: 'todo-5',
          text: '健身',
          completed: false,
          createdAt: new Date('2024-01-03').toISOString(),
          updatedAt: new Date('2024-01-03').toISOString()
        },
        {
          id: 'todo-6',
          text: '读书30分钟',
          completed: false,
          createdAt: new Date('2024-01-03').toISOString(),
          updatedAt: new Date('2024-01-03').toISOString()
        }
      ],
      createdAt: new Date('2024-01-03').toISOString(),
      updatedAt: new Date('2024-01-03').toISOString()
    }
  ];

  const handleRestoreData = async () => {
    setIsRestoring(true);
    setMessage("");

    try {
      // 保存到本地存储
      localStorage.setItem('ai-notebook-notes', JSON.stringify(sampleNotes));
      localStorage.setItem('ai-notebook-todos', JSON.stringify(sampleTodos));
      
      // 通知父组件数据已恢复
      onDataRestored(sampleNotes, sampleTodos);
      
      setMessage("数据恢复成功！已恢复3篇示例笔记和2个待办清单。");
    } catch (error) {
      console.error('数据恢复失败:', error);
      setMessage("数据恢复失败，请稍后重试。");
    } finally {
      setIsRestoring(false);
    }
  };

  const checkCurrentData = () => {
    const notes = localStorage.getItem('ai-notebook-notes');
    const todos = localStorage.getItem('ai-notebook-todos');
    
    const notesCount = notes ? JSON.parse(notes).length : 0;
    const todosCount = todos ? JSON.parse(todos).length : 0;
    
    setMessage(`当前数据状态：${notesCount} 篇笔记，${todosCount} 个待办清单`);
  };

  const clearAllData = () => {
    if (confirm('确定要清空所有数据吗？此操作不可恢复！')) {
      localStorage.removeItem('ai-notebook-notes');
      localStorage.removeItem('ai-notebook-todos');
      onDataRestored([], []);
      setMessage("所有数据已清空。");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          数据恢复
        </CardTitle>
        <CardDescription>
          如果您的笔记和待办事项丢失了，可以使用以下功能进行恢复或管理。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button 
            onClick={handleRestoreData} 
            disabled={isRestoring}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            {isRestoring ? '恢复中...' : '恢复示例数据'}
          </Button>
          
          <Button 
            onClick={checkCurrentData} 
            variant="outline"
            className="w-full"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            检查当前数据
          </Button>
          
          <Button 
            onClick={clearAllData} 
            variant="destructive"
            className="w-full"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            清空所有数据
          </Button>
        </div>
        
        {message && (
          <div className="p-3 bg-muted rounded-md text-sm">
            {message}
          </div>
        )}
        
        <div className="text-sm text-muted-foreground">
          <p><strong>示例数据包含：</strong></p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>3篇示例笔记（欢迎笔记、学习计划、项目想法）</li>
            <li>2个待办清单（工作任务、个人事务）</li>
            <li>多个待办事项（包含已完成和未完成）</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}