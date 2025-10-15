'use client';

import { useEffect } from 'react';
import { setupAuthListener } from '@/lib/auth-config';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  useEffect(() => {
    // 设置认证状态监听器
    const { data: { subscription } } = setupAuthListener();

    // 清理函数
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return <>{children}</>;
}