'use client'

import { useState, useEffect } from 'react'
import { authService, type AuthState } from '@/lib/auth-service'

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(authService.getState())
  const [error, setError] = useState<string>('')

  useEffect(() => {
    // 订阅认证状态变化
    const unsubscribe = authService.subscribe(setAuthState)
    
    return unsubscribe
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setError('')
      await authService.login(email, password)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '登录失败'
      setError(errorMessage)
      throw err
    }
  }

  const register = async (email: string, password: string, displayName: string) => {
    try {
      setError('')
      await authService.register(email, password, displayName)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '注册失败'
      setError(errorMessage)
      throw err
    }
  }

  const logout = async () => {
    try {
      setError('')
      await authService.logout()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '登出失败'
      setError(errorMessage)
      throw err
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setError('')
      await authService.resetPassword(email)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '重置密码失败'
      setError(errorMessage)
      throw err
    }
  }

  const updateProfile = async (updates: { displayName?: string; email?: string }) => {
    try {
      setError('')
      await authService.updateProfile(updates)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新资料失败'
      setError(errorMessage)
      throw err
    }
  }

  const clearError = () => setError('')

  return {
    // 状态
    user: authState.user,
    session: authState.session,
    isLoading: authState.isLoading,
    isAuthenticated: authState.isAuthenticated,
    error,
    
    // 方法
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    clearError
  }
}