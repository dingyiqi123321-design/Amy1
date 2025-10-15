"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AnimatedButton as Button } from "@/components/ui/animated-button";
import { Settings, Key } from "lucide-react";
import { getApiKey, saveApiKey } from "@/lib/storage";

interface ApiKeyInputProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApiKeyInput({ open, onOpenChange }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState("");
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const key = getApiKey();
    setIsConfigured(!!key);
    if (key) setApiKey(key);
  }, []);

  const handleSave = () => {
    saveApiKey(apiKey);
    setIsConfigured(true);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            配置 OpenRouter API Key
          </DialogTitle>
          <DialogDescription>
            请输入您的 OpenRouter API Key 以启用 AI 功能。密钥将保存在浏览器本地存储中。
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="password"
            placeholder="sk-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={!apiKey.trim()}>
            保存并启用AI功能
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}