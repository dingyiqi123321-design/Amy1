"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AnimatedButton as Button } from "@/components/ui/animated-button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Note } from "@/types/note";
import { TodoList } from "@/types/todo";
import { callOpenRouter } from "@/lib/ai-service";
import { MessageCircle, Send } from "lucide-react";

interface AIChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notes: Note[];
  todoLists: TodoList[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AIChatModal({ open, onOpenChange, notes, todoLists }: AIChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 当消息更新时自动滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // 构建笔记上下文
      const notesContext = notes.map(note => 
        `标题: ${note.title}\n内容: ${note.content}\n---`
      ).join('\n');

      // 构建待办事项上下文
      const todosContext = todoLists.map(todoList => {
        const pendingItems = todoList.items.filter(item => !item.completed);
        const completedItems = todoList.items.filter(item => item.completed);
        
        let todoInfo = `待办事项列表: ${todoList.title}\n`;
        
        if (pendingItems.length > 0) {
          todoInfo += `待办事项 (${pendingItems.length}项):\n`;
          todoInfo += pendingItems.map(item => `- ${item.text}`).join('\n');
          todoInfo += '\n';
        }
        
        if (completedItems.length > 0) {
          todoInfo += `已完成事项 (${completedItems.length}项):\n`;
          todoInfo += completedItems.map(item => `- ${item.text}`).join('\n');
          todoInfo += '\n';
        }
        
        return todoInfo + '---';
      }).join('\n');

      const context = [notesContext, todosContext].filter(Boolean).join('\n\n');
      const prompt = `基于以下所有笔记内容和待办事项信息回答问题：\n\n${context}\n\n用户问题：${input}`;
      
      const response = await callOpenRouter(prompt, 'chat');
      
      const aiMessage: Message = { role: 'assistant', content: response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = { 
        role: 'assistant', 
        content: '抱歉，处理问题时出现了错误。请检查API密钥是否正确配置。'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[700px] w-[95vw] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            AI 智能问答
          </DialogTitle>
          <DialogDescription>
            基于您所有笔记内容和待办事项向 AI 提问
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] flex-shrink-0" ref={scrollAreaRef}>
          <div className="space-y-4 p-4">
            {messages.map((message, index) => {
              // 为用户消息和AI消息分别设置宽度策略，确保不会溢出
               let messageWidth;
               if (message.role === 'user') {
                 // 用户消息：短消息紧凑显示，长消息适中宽度
                 messageWidth = message.content.length > 50 ? 'max-w-[55%]' : 'max-w-fit min-w-[100px]';
               } else {
                 // AI消息：严格控制宽度，防止溢出
                 messageWidth = message.content.length > 100 ? 'max-w-[65%]' : 'max-w-[60%] min-w-[180px]';
               }
              
              return (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-3 px-2`}>
                   <Card className={`${messageWidth} p-4 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'} overflow-hidden`}>
                     <p className="text-sm whitespace-pre-wrap break-words word-wrap break-all leading-relaxed">{message.content}</p>
                   </Card>
                 </div>
              );
            })}
            {isLoading && (
               <div className="flex justify-start mb-3 px-2">
                 <Card className="max-w-[60%] min-w-[180px] p-4 bg-muted overflow-hidden">
                   <p className="text-sm text-muted-foreground leading-relaxed">AI正在思考...</p>
                 </Card>
               </div>
             )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <DialogFooter>
          <div className="flex gap-2 w-full">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入您的问题..."
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
              disabled={isLoading}
            />
            <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}