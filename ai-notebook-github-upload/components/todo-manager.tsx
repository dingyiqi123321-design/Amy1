"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedButton as Button } from "@/components/ui/animated-button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Edit2, Plus } from "lucide-react";
import { TodoList as TodoListType, TodoItem } from "@/types/todo";
import { createTodoList, createTodoItem } from "@/lib/todo-storage";

interface TodoManagerProps {
  todoLists: TodoListType[];
  onUpdateTodoList: (todoList: TodoListType) => void;
  onCreateTodoList: () => void;
  onDeleteTodoList: (id: string) => void;
}

export function TodoManager({ todoLists, onUpdateTodoList, onCreateTodoList, onDeleteTodoList }: TodoManagerProps) {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [newItemTexts, setNewItemTexts] = useState<{ [key: string]: string }>({});
  const [editingListTitle, setEditingListTitle] = useState<string | null>(null);
  const [editingTitleText, setEditingTitleText] = useState("");

  const handleToggleItem = (listId: string, itemId: string) => {
    const todoList = todoLists.find(list => list.id === listId);
    if (!todoList) return;

    const updatedItems = todoList.items.map(item =>
      item.id === itemId
        ? { ...item, completed: !item.completed, updatedAt: new Date().toISOString() }
        : item
    );

    onUpdateTodoList({
      ...todoList,
      items: updatedItems,
      updatedAt: new Date().toISOString()
    });
  };

  const handleDeleteItem = (listId: string, itemId: string) => {
    const todoList = todoLists.find(list => list.id === listId);
    if (!todoList) return;

    const updatedItems = todoList.items.filter(item => item.id !== itemId);
    onUpdateTodoList({
      ...todoList,
      items: updatedItems,
      updatedAt: new Date().toISOString()
    });
  };

  const handleEditItem = (item: TodoItem) => {
    setEditingItem(item.id);
    setEditingText(item.text);
  };

  const handleSaveEdit = (listId: string, itemId: string) => {
    const todoList = todoLists.find(list => list.id === listId);
    if (!todoList) return;

    const updatedItems = todoList.items.map(item =>
      item.id === itemId
        ? { ...item, text: editingText, updatedAt: new Date().toISOString() }
        : item
    );

    onUpdateTodoList({
      ...todoList,
      items: updatedItems,
      updatedAt: new Date().toISOString()
    });

    setEditingItem(null);
    setEditingText("");
  };

  const handleAddItem = (listId: string) => {
    const text = newItemTexts[listId]?.trim();
    if (!text) return;

    const todoList = todoLists.find(list => list.id === listId);
    if (!todoList) return;

    const newItem = createTodoItem(text, listId);
    const updatedItems = [...todoList.items, newItem];

    onUpdateTodoList({
      ...todoList,
      items: updatedItems,
      updatedAt: new Date().toISOString()
    });

    setNewItemTexts(prev => ({ ...prev, [listId]: "" }));
  };

  const handleEditListTitle = (list: TodoListType) => {
    setEditingListTitle(list.id);
    setEditingTitleText(list.title);
  };

  const handleSaveListTitle = (listId: string) => {
    const todoList = todoLists.find(list => list.id === listId);
    if (!todoList) return;

    onUpdateTodoList({
      ...todoList,
      title: editingTitleText,
      updatedAt: new Date().toISOString()
    });

    setEditingListTitle(null);
    setEditingTitleText("");
  };

  const renderTodoItem = (item: TodoItem, listId: string) => {
    const isEditing = editingItem === item.id;
    const createdDate = new Date(item.createdAt).toLocaleDateString('zh-CN');

    return (
      <div key={item.id} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50">
        <Checkbox
          checked={item.completed}
          onCheckedChange={() => handleToggleItem(listId, item.id)}
        />
        <div className="flex-1">
          {isEditing ? (
            <Input
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveEdit(listId, item.id);
                } else if (e.key === 'Escape') {
                  setEditingItem(null);
                  setEditingText("");
                }
              }}
              onBlur={() => handleSaveEdit(listId, item.id)}
              className="w-full"
              autoFocus
            />
          ) : (
            <div>
              <span
                className={`block ${item.completed ? 'line-through text-muted-foreground' : ''}`}
              >
                {item.text}
              </span>
              <span className="text-xs text-muted-foreground">
                {createdDate}
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditItem(item)}
            className="h-6 w-6 p-0"
          >
            <Edit2 className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteItem(listId, item.id)}
            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  };

  const pendingItems = (items: TodoItem[]) => items.filter(item => !item.completed);
  const completedItems = (items: TodoItem[]) => items.filter(item => item.completed);

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">待办事项</h2>
        <Button onClick={onCreateTodoList} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          新建列表
        </Button>
      </div>

      <div className="flex-1 overflow-auto space-y-4">
        {todoLists.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>还没有待办事项列表</p>
            <p className="text-sm">点击上方按钮创建第一个列表</p>
          </div>
        ) : (
          todoLists.map(todoList => (
            <Card key={todoList.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  {editingListTitle === todoList.id ? (
                    <Input
                      value={editingTitleText}
                      onChange={(e) => setEditingTitleText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveListTitle(todoList.id);
                        } else if (e.key === 'Escape') {
                          setEditingListTitle(null);
                          setEditingTitleText("");
                        }
                      }}
                      onBlur={() => handleSaveListTitle(todoList.id)}
                      className="text-lg font-semibold"
                      autoFocus
                    />
                  ) : (
                    <CardTitle 
                      className="cursor-pointer hover:text-blue-600"
                      onClick={() => handleEditListTitle(todoList)}
                    >
                      {todoList.title}
                    </CardTitle>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteTodoList(todoList.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {/* 待办事项 */}
                  <div className="flex-1">
                    <h4 className="text-sm font-medium mb-2 text-blue-600">待办事项</h4>
                    <div className="space-y-1">
                      {pendingItems(todoList.items).map(item => renderTodoItem(item, todoList.id))}
                      {pendingItems(todoList.items).length === 0 && (
                        <p className="text-sm text-muted-foreground py-2">暂无待办事项</p>
                      )}
                    </div>
                  </div>

                  {/* 已办事项 */}
                  {completedItems(todoList.items).length > 0 && (
                    <div className="flex-1">
                      <h4 className="text-sm font-medium mb-2 text-green-600">已办事项</h4>
                      <div className="space-y-1">
                        {completedItems(todoList.items).map(item => renderTodoItem(item, todoList.id))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 添加新项目 */}
                <div className="flex gap-2 mt-4">
                  <Input
                    placeholder="添加新的待办事项..."
                    value={newItemTexts[todoList.id] || ""}
                    onChange={(e) => setNewItemTexts(prev => ({ ...prev, [todoList.id]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddItem(todoList.id);
                      }
                    }}
                  />
                  <Button 
                    onClick={() => handleAddItem(todoList.id)}
                    size="sm"
                  >
                    添加
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}