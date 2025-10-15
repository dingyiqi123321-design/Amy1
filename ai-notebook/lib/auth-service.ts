import { supabase } from './supabase'
import type { User, Session } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  email: string
  displayName: string
  createdAt: string
}

export interface AuthState {
  user: AuthUser | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
}

class AuthService {
  private listeners: ((state: AuthState) => void)[] = []
  private currentState: AuthState = {
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false
  }

  constructor() {
    this.initialize()
  }

  private async initialize() {
    try {
      // 获取当前会话
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('获取会话失败:', error)
        this.updateState({ isLoading: false })
        return
      }

      if (session?.user) {
        const authUser = await this.createAuthUser(session.user)
        this.updateState({
          user: authUser,
          session,
          isLoading: false,
          isAuthenticated: true
        })
      } else {
        this.updateState({ isLoading: false })
      }

      // 监听认证状态变化
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('认证状态变化:', event, session?.user?.email)
        
        if (session?.user) {
          const authUser = await this.createAuthUser(session.user)
          this.updateState({
            user: authUser,
            session,
            isLoading: false,
            isAuthenticated: true
          })
        } else {
          this.updateState({
            user: null,
            session: null,
            isLoading: false,
            isAuthenticated: false
          })
        }
      })
    } catch (error) {
      console.error('认证服务初始化失败:', error)
      this.updateState({ isLoading: false })
    }
  }

  private async createAuthUser(user: User): Promise<AuthUser> {
    return {
      id: user.id,
      email: user.email || '',
      displayName: user.user_metadata?.display_name || user.email?.split('@')[0] || '用户',
      createdAt: user.created_at
    }
  }

  private updateState(updates: Partial<AuthState>) {
    this.currentState = { ...this.currentState, ...updates }
    this.listeners.forEach(listener => listener(this.currentState))
  }

  // 订阅认证状态变化
  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener)
    // 立即调用一次以获取当前状态
    listener(this.currentState)
    
    // 返回取消订阅函数
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  // 获取当前状态
  getState(): AuthState {
    return this.currentState
  }

  // 用户注册
  async register(email: string, password: string, displayName: string): Promise<void> {
    try {
      this.updateState({ isLoading: true })

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName
          }
        }
      })

      if (error) {
        throw new Error(this.getErrorMessage(error.message))
      }

      if (data.user && !data.session) {
        // 需要邮箱验证
        throw new Error('请检查您的邮箱并点击验证链接完成注册')
      }

    } catch (error) {
      this.updateState({ isLoading: false })
      throw error
    }
  }

  // 用户登录
  async login(email: string, password: string): Promise<void> {
    try {
      this.updateState({ isLoading: true })

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        throw new Error(this.getErrorMessage(error.message))
      }

      if (!data.session) {
        throw new Error('登录失败，请重试')
      }

    } catch (error) {
      this.updateState({ isLoading: false })
      throw error
    }
  }

  // 用户登出
  async logout(): Promise<void> {
    try {
      this.updateState({ isLoading: true })
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        throw new Error(this.getErrorMessage(error.message))
      }
    } catch (error) {
      this.updateState({ isLoading: false })
      throw error
    }
  }

  // 重置密码
  async resetPassword(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        throw new Error(this.getErrorMessage(error.message))
      }
    } catch (error) {
      throw error
    }
  }

  // 更新用户信息
  async updateProfile(updates: { displayName?: string; email?: string }): Promise<void> {
    try {
      const { error } = await supabase.auth.updateUser({
        email: updates.email,
        data: {
          display_name: updates.displayName
        }
      })

      if (error) {
        throw new Error(this.getErrorMessage(error.message))
      }
    } catch (error) {
      throw error
    }
  }

  // 错误消息本地化
  private getErrorMessage(error: string): string {
    const errorMessages: Record<string, string> = {
      'Invalid login credentials': '邮箱或密码错误',
      'Email not confirmed': '邮箱未验证，请检查您的邮箱',
      'User already registered': '该邮箱已被注册',
      'Password should be at least 6 characters': '密码至少需要6个字符',
      'Unable to validate email address: invalid format': '邮箱格式无效',
      'Signup requires a valid password': '请输入有效的密码',
      'User not found': '用户不存在',
      'Email rate limit exceeded': '邮件发送频率过高，请稍后再试',
      'Too many requests': '请求过于频繁，请稍后再试'
    }

    return errorMessages[error] || error || '操作失败，请重试'
  }
}

// 创建单例实例
export const authService = new AuthService()

// 导出类型
export type { AuthState, AuthUser }