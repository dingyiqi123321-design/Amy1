'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Eye, EyeOff } from 'lucide-react'

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>
  onSwitchToRegister: () => void
  isLoading?: boolean
  error?: string
}

export function LoginForm({ onLogin, onSwitchToRegister, isLoading = false, error }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    
    try {
      await onLogin(email, password)
    } catch (err) {
      // 错误处理由父组件处理
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">登录</CardTitle>
        <CardDescription className="text-center">
          输入您的邮箱和密码来访问您的笔记
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="输入您的密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !email || !password}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                登录中...
              </>
            ) : (
              '登录'
            )}
          </Button>
          
          <div className="text-center text-sm">
            <span className="text-muted-foreground">还没有账户？</span>
            <Button
              type="button"
              variant="link"
              className="p-0 ml-1 h-auto"
              onClick={onSwitchToRegister}
              disabled={isLoading}
            >
              立即注册
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}