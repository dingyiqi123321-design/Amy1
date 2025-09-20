"use client";

import { useState } from "react";
import { TodoList as TodoListType, TodoItem } from "@/types/todo";
import { AnimatedButton as Button } from "@/components/ui/animated-button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Edit3, Check, X } from "lucide-react";
import { generateId } from "@/lib/utils";

interface TodoListProps {
  todoList: TodoListType | null;
  onUpdateTodoList: (todoList: TodoListType) => void;
  onCreateTodoList: (noteId: string) => void;
  noteId: string;
}

export function TodoList({ todoList, onUpdateTodoList, onCreateTodoList, noteId }: TodoListProps) {
  const [newItemText, setNewItemText] = useState("");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const handleAddItem = () => {
    if (!todoList || !newItemText.trim()) return;

    const newItem: TodoItem = {
      id: generateId(),
      text: newItemText.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      noteId,
    };

    const updatedList = {
      ...todoList,
      items: [...todoList.items, newItem],
      updatedAt: new Date().toISOString(),
    };

    onUpdateTodoList(updatedList);
    setNewItemText("");
  };

  const handleToggleItem = (itemId: string) => {
    if (!todoList) return;

    const updatedItems = todoList.items.map(item =>
      item.id === itemId
        ? { ...item, completed: !item.completed, updatedAt: new Date().toISOString() }
        : item
    );

    const updatedList = {
      ...todoList,
      items: updatedItems,
      updatedAt: new Date().toISOString(),
    };

    onUpdateTodoList(updatedList);
  };

  const handleDeleteItem = (itemId: string) => {
    if (!todoList) return;

    const updatedItems = todoList.items.filter(item => item.id !== itemId);
    const updatedList = {
      ...todoList,
      items: updatedItems,
      updatedAt: new Date().toISOString(),
    };

    onUpdateTodoList(updatedList);
  };

  const handleStartEdit = (item: TodoItem) => {
    setEditingItemId(item.id);
    setEditingText(item.text);
  };

  const handleSaveEdit = () => {
    if (!todoList || !editingItemId) return;

    const updatedItems = todoList.items.map(item =>
      item.id === editingItemId
        ? { ...item, text: editingText, updatedAt: new Date().toISOString() }
        : item
    );

    const updatedList = {
      ...todoList,
      items: updatedItems,
      updatedAt: new Date().toISOString(),
    };

    onUpdateTodoList(updatedList);
    setEditingItemId(null);
    setEditingText("");
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditingText("");
  };

  if (!todoList) {
    return (
      <div className="p-4">
        <Card className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">待办事项</h3>
            <p className="text-muted-foreground mb-4">这个笔记还没有待办事项列表</p>
            <Button onClick={() => onCreateTodoList(noteId)}>
              <Plus className="h-4 w-4 mr-2" />
              创建待办事项列表
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const pendingItems = todoList.items.filter(item => !item.completed);
  const completedItems = todoList.items.filter(item => item.completed);
  const totalCount = todoList.items.length;

  const renderTodoItem = (item: TodoItem, isPending: boolean = true) => {
    const createdDate = new Date(item.createdAt).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    return (
      <div key={item.id} className="flex items-center gap-2 group">
        <Checkbox
          checked={item.completed}
          onCheckedChange={() => handleToggleItem(item.id)}
          className="shrink-0"
        />
        
        {editingItemId === item.id ? (
          <div className="flex-1 flex items-center gap-2">
            <Input
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
              className="flex-1 h-7 text-sm"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSaveEdit();
                } else if (e.key === 'Escape') {
                  handleCancelEdit();
                }
              }}
              autoFocus
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSaveEdit}
              className="h-7 w-7 p-0"
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancelEdit}
              className="h-7 w-7 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-between">
            <div className="flex flex-col">
              <span 
                className={`text-sm ${
                  item.completed 
                    ? 'line-through text-muted-foreground' 
                    : ''
                }`}
              >
                {item.text}
              </span>
              <span className="text-xs text-muted-foreground">
                创建于 {createdDate}
              </span>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {isPending && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleStartEdit(item)}
                  className="h-7 w-7 p-0"
                >
                  <Edit3 className="h-3 w-3" />
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDeleteItem(item.id)}
                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4">
      <Card className="p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">{todoList.title}</h3>
          {totalCount > 0 && (
            <div className="text-sm text-muted-foreground">
              {completedItems.length} / {totalCount} 已完成
            </div>
          )}
        </div>

        {/* 左右分栏布局 */}
        <div className="flex gap-6 mb-6">
          {/* 待办事项区域 */}
          <div className="flex-1">
            <h4 className="text-md font-medium mb-3 text-gray-700">待办事项 ({pendingItems.length})</h4>
            <div className="space-y-2">
               {pendingItems.length === 0 ? (
                 <div className="text-sm text-muted-foreground text-center py-4">
                   暂无待办事项
                 </div>
               ) : (
                 pendingItems.map((item) => renderTodoItem(item, true))
               )}
             </div>
           </div>

           {/* 已办事项区域 */}
           {completedItems.length > 0 && (
             <div className="flex-1">
               <h4 className="text-md font-medium mb-3 text-gray-700">已办事项 ({completedItems.length})</h4>
               <div className="space-y-2">
                 {completedItems.map((item) => renderTodoItem(item, false))}
               </div>
             </div>
           )}
        </div>

        <div className="flex items-center gap-2">
          <Input
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="添加新的待办事项..."
            className="flex-1 h-8 text-sm"
            onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
          />
          <Button
            size="sm"
            onClick={handleAddItem}
            disabled={!newItemText.trim()}
            className="h-8"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </Card>
    </div>
  );
}