import { supabase } from './supabase';

// Supabase Auth 配置
export const authConfig = {
  // 认证提供商配置
  providers: {
    email: true,
    google: false, // 可以后续启用
    github: false, // 可以后续启用
  },
  
  // 会话配置
  session: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  
  // 重定向URL配置
  redirectUrls: {
    signIn: '/dashboard',
    signOut: '/login',
    emailConfirmation: '/auth/confirm',
    passwordReset: '/auth/reset-password',
  },
  
  // 密码策略
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false,
  },
  
  // 用户元数据字段
  userMetadata: {
    displayName: 'display_name',
    avatar: 'avatar_url',
  },
};

// 认证状态监听器
export function setupAuthListener() {
  return supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session?.user?.email);
    
    // 处理不同的认证事件
    switch (event) {
      case 'SIGNED_IN':
        console.log('用户已登录:', session?.user?.email);
        break;
      case 'SIGNED_OUT':
        console.log('用户已登出');
        break;
      case 'TOKEN_REFRESHED':
        console.log('Token已刷新');
        break;
      case 'USER_UPDATED':
        console.log('用户信息已更新');
        break;
      case 'PASSWORD_RECOVERY':
        console.log('密码重置邮件已发送');
        break;
    }
  });
}

// 验证密码强度
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const { passwordPolicy } = authConfig;
  
  if (password.length < passwordPolicy.minLength) {
    errors.push(`密码长度至少需要 ${passwordPolicy.minLength} 个字符`);
  }
  
  if (passwordPolicy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('密码必须包含至少一个大写字母');
  }
  
  if (passwordPolicy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('密码必须包含至少一个小写字母');
  }
  
  if (passwordPolicy.requireNumbers && !/\d/.test(password)) {
    errors.push('密码必须包含至少一个数字');
  }
  
  if (passwordPolicy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('密码必须包含至少一个特殊字符');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// 获取用户显示名称
export function getUserDisplayName(user: any): string {
  return user?.user_metadata?.display_name || 
         user?.user_metadata?.full_name || 
         user?.email?.split('@')[0] || 
         '用户';
}

// 获取用户头像URL
export function getUserAvatarUrl(user: any): string | null {
  return user?.user_metadata?.avatar_url || 
         user?.user_metadata?.picture || 
         null;
}

// 检查用户是否已验证邮箱
export function isEmailVerified(user: any): boolean {
  return user?.email_confirmed_at !== null;
}

// 格式化认证错误消息
export function formatAuthError(error: any): string {
  const errorMessages: Record<string, string> = {
    'Invalid login credentials': '邮箱或密码错误',
    'Email not confirmed': '请先验证您的邮箱',
    'User already registered': '该邮箱已被注册',
    'Password should be at least 6 characters': '密码至少需要6个字符',
    'Unable to validate email address: invalid format': '邮箱格式不正确',
    'Signup is disabled': '注册功能已禁用',
    'Email rate limit exceeded': '邮件发送频率过高，请稍后再试',
    'Token has expired or is invalid': '链接已过期或无效',
  };
  
  const message = error?.message || error?.error_description || '未知错误';
  return errorMessages[message] || message;
}