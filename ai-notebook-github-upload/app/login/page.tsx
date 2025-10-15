'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { AuthModal } from '@/components/auth/auth-modal';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();
  const [showModal, setShowModal] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 如果用户已登录，重定向到仪表板
    if (user && !isLoading) {
      router.push('/dashboard');
      return;
    }

    // 检查URL参数中的错误信息
    const errorParam = searchParams.get('error');
    if (errorParam) {
      switch (errorParam) {
        case 'auth_callback_failed':
          setError('认证失败，请重试');
          break;
        case 'unexpected_error':
          setError('发生意外错误，请重试');
          break;
        default:
          setError('登录时发生错误');
      }
    }
  }, [user, isLoading, router, searchParams]);

  const handleAuthSuccess = () => {
    setShowModal(false);
    router.push('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* 应用标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI 笔记</h1>
          <p className="text-gray-600">智能笔记管理系统</p>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* 功能介绍卡片 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">功能特色</h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              智能笔记管理
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              项目任务跟踪
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              待办事项管理
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              工作报告生成
            </li>
          </ul>
        </div>

        {/* 登录按钮 */}
        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          开始使用
        </button>

        {/* 认证模态框 */}
        {showModal && (
          <AuthModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSuccess={handleAuthSuccess}
          />
        )}
      </div>
    </div>
  );
}