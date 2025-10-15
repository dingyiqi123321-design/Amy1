'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Eye, EyeOff, Check, X } from 'lucide-react'

interface RegisterFormProps {
  onRegister: (email: string, password: string, displayName: string) => Promise<void>
  onSwitchToLogin: () => void
  isLoading?: boolean
  error?: string
}

export function RegisterForm({ onRegister, onSwitchToLogin, isLoading = false, error }: RegisterFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const passwordRequirements = [
    { test: (pwd: string) => pwd.length >= 8, text: '至少8个字符' },
    { test: (pwd: string) => /[A-Z]/.test(pwd), text: '包含大写字母' },
    { test: (pwd: string) => /[a-z]/.test(pwd), text: '包含小写字母' },
    { test: (pwd: string) => /\d/.test(pwd), text: '包含数字' },
  ]

  const isPasswordValid = passwordRequirements.every(req => req.test(password))
  const isPasswordMatch = password === confirmPassword && password.length > 0
  const isFormValid = email && displayName && isPasswordValid && isPasswordMatch

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return
    
    try {
      await onRegister(email, password, displayName)
    } catch (err) {
      // 错误处理由父组件处理
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">注册</CardTitle>
        <CardDescription className="text-center">
          创建您的账户来开始使用AI笔记本
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
            <Label htmlFor="displayName">用户名</Label>
            <Input
              id="displayName"
              type="text"
              placeholder="输入您的用户名"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          
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
            
            {password && (
              <div className="space-y-1 text-sm">
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    {req.test(password) ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <X className="h-3 w-3 text-red-500" />
                    )}
                    <span className={req.test(password) ? 'text-green-600' : 'text-red-600'}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">确认密码</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="再次输入您的密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {confirmPassword && (
              <div className="flex items-center space-x-2 text-sm">
                {isPasswordMatch ? (
                  <>
                    <Check className="h-3 w-3 text-green-500" />
                    <span className="text-green-600">密码匹配</span>
                  </>
                ) : (
                  <>
                    <X className="h-3 w-3 text-red-500" />
                    <span className="text-red-600">密码不匹配</span>
                  </>
                )}
              </div>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                注册中...
              </>
            ) : (
              '注册'
            )}
          </Button>
          
          <div className="text-center text-sm">
            <span className="text-muted-foreground">已有账户？</span>
            <Button
              type="button"
              variant="link"
              className="p-0 ml-1 h-auto"
              onClick={onSwitchToLogin}
              disabled={isLoading}
            >
              立即登录
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}