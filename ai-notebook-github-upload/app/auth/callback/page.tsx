'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // 处理认证回调
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('认证回调错误:', error);
          router.push('/login?error=auth_callback_failed');
          return;
        }

        if (data.session) {
          // 认证成功，重定向到仪表板
          router.push('/dashboard');
        } else {
          // 没有会话，重定向到登录页
          router.push('/login');
        }
      } catch (error) {
        console.error('处理认证回调时出错:', error);
        router.push('/login?error=unexpected_error');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">正在处理认证...</p>
      </div>
    </div>
  );
}