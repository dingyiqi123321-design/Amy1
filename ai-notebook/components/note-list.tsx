"use client";

import { useState } from "react";
import { AnimatedButton as Button } from "@/components/ui/animated-button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { Note } from "@/types/note";
import { NoteListItem } from "./note-list-item";

interface NoteListProps {
  notes: Note[];
  selectedId: string | null;
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
  onDeleteNote: (id: string) => void;
}

export function NoteList({ 
  notes, 
  selectedId, 
  onSelectNote, 
  onCreateNote, 
  onDeleteNote 
}: NoteListProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">我的笔记</h2>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onCreateNote}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            新建
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {notes.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>还没有笔记</p>
              <p className="text-sm">点击上方按钮创建第一篇笔记</p>
            </div>
          ) : (
            notes.map((note) => (
              <NoteListItem
                key={note.id}
                note={note}
                isSelected={selectedId === note.id}
                onSelect={() => onSelectNote(note.id)}
                onDelete={() => onDeleteNote(note.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}