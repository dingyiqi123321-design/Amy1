"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { AnimatedButton as Button } from "@/components/ui/animated-button";
import { Note } from "@/types/note";

interface NoteListItemProps {
  note: Note;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export function NoteListItem({ note, isSelected, onSelect, onDelete }: NoteListItemProps) {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <Card
      className={`p-4 cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "border-primary bg-primary/5" : "border-border"
      }`}
      onClick={onSelect}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate mb-1">{note.title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{note.summary}</p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(note.updatedAt), {
              addSuffix: true,
              locale: zhCN,
            })}
          </p>
        </div>
        
        {showDelete && (
          <Button
            variant="ghost"
            size="sm"
            className="opacity-70 hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>
    </Card>
  );
}