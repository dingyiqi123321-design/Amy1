"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Note } from "@/types/note";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface EditorProps {
  note: Note | null;
  onUpdateNote: (id: string, content: string) => void;
  isAiGenerating?: boolean;
}

export function Editor({ note, onUpdateNote, isAiGenerating = false }: EditorProps) {
  const [content, setContent] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  useEffect(() => {
    setContent(note?.content || "");
  }, [note]);

  useEffect(() => {
    if (!note) return;

    if (content !== note.content) {
      setSaveStatus('unsaved');
      
      const timeoutId = setTimeout(() => {
        setSaveStatus('saving');
        onUpdateNote(note.id, content);
        setTimeout(() => setSaveStatus('saved'), 500);
      }, 2000);

      return () => clearTimeout(timeoutId);
    } else {
      setSaveStatus('saved');
    }
  }, [content, note?.id, note?.content, onUpdateNote]);

  if (!note) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">欢迎使用 AI 记事本</h3>
          <p>选择一篇笔记开始编辑，或创建新的笔记</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 relative">
        {isPreview ? (
          <Card className="h-full overflow-auto">
            <div className="prose prose-sm max-w-none p-6">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          </Card>
        ) : (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="开始写作... 支持 Markdown 语法"
            className="h-full resize-none border-0 text-base leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        )}
      </div>

      <div className="border-t p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            最后更新: {new Date(note.updatedAt).toLocaleString('zh-CN')}
          </div>
          <div className={`text-xs px-2 py-1 rounded ${
             saveStatus === 'saved' ? 'bg-green-100 text-green-700' :
             saveStatus === 'saving' ? 'bg-yellow-100 text-yellow-700' :
             'bg-gray-100 text-gray-700'
           }`}>
             {saveStatus === 'saved' ? '已保存' :
              saveStatus === 'saving' ? '保存中...' :
              '未保存'}
           </div>
           {isAiGenerating && (
             <div className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
               AI生成中...
             </div>
           )}
        </div>
        <button
          onClick={() => setIsPreview(!isPreview)}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          {isPreview ? '编辑' : '预览'}
        </button>
      </div>
    </div>
  );
}