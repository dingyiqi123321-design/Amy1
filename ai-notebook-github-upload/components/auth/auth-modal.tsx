'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { LoginForm } from './login-form'
import { RegisterForm } from './register-form'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (email: string, password: string) => Promise<void>
  onRegister: (email: string, password: string, displayName: string) => Promise<void>
  isLoading?: boolean
  error?: string
}

export function AuthModal({ 
  isOpen, 
  onClose, 
  onLogin, 
  onRegister, 
  isLoading = false, 
  error 
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')

  const handleSwitchToRegister = () => setMode('register')
  const handleSwitchToLogin = () => setMode('login')

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="sr-only">
          <span>{mode === 'login' ? '登录' : '注册'}</span>
        </DialogHeader>
        
        {mode === 'login' ? (
          <LoginForm
            onLogin={onLogin}
            onSwitchToRegister={handleSwitchToRegister}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <RegisterForm
            onRegister={onRegister}
            onSwitchToLogin={handleSwitchToLogin}
            isLoading={isLoading}
            error={error}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}