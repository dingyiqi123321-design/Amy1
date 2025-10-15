"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedButton as Button } from "@/components/ui/animated-button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw, Timer } from "lucide-react";

interface PomodoroTimerProps {
  className?: string;
}

export function PomodoroTimer({ className }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15分钟 = 900秒
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const totalTime = 15 * 60; // 15分钟总时长

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            // 播放完成提示音（如果浏览器支持）
            try {
              const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
              audio.play().catch(() => {});
            } catch (e) {}
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (isCompleted) {
      // 如果已完成，重新开始
      setTimeLeft(totalTime);
      setIsCompleted(false);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(totalTime);
    setIsCompleted(false);
  };

  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5" />
          番茄钟
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 时间显示 */}
        <div className="text-center">
          <div className={`text-4xl font-mono font-bold ${
            isCompleted ? 'text-green-600' : 
            timeLeft <= 60 ? 'text-red-500' : 
            'text-foreground'
          }`}>
            {formatTime(timeLeft)}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {isCompleted ? '🎉 番茄钟完成！' : 
             isRunning ? '专注中...' : 
             timeLeft === totalTime ? '准备开始' : '已暂停'}
          </div>
        </div>

        {/* 进度条 */}
        <div className="space-y-2">
          <Progress 
            value={progress} 
            className="h-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0:00</span>
            <span>{Math.round(progress)}%</span>
            <span>15:00</span>
          </div>
        </div>

        {/* 控制按钮 */}
        <div className="flex justify-center gap-2">
          {!isRunning ? (
            <Button 
              onClick={handleStart}
              className="flex items-center gap-2"
              variant={isCompleted ? "default" : "default"}
            >
              <Play className="h-4 w-4" />
              {isCompleted ? '重新开始' : timeLeft === totalTime ? '开始' : '继续'}
            </Button>
          ) : (
            <Button 
              onClick={handlePause}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Pause className="h-4 w-4" />
              暂停
            </Button>
          )}
          
          <Button 
            onClick={handleReset}
            variant="outline"
            className="flex items-center gap-2"
            disabled={timeLeft === totalTime && !isRunning}
          >
            <RotateCcw className="h-4 w-4" />
            重置
          </Button>
        </div>

        {/* 使用提示 */}
        <div className="text-xs text-muted-foreground text-center">
          💡 番茄工作法：专注15分钟，然后休息5分钟
        </div>
      </CardContent>
    </Card>
  );
}