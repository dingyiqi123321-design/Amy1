import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";

export const metadata: Metadata = {
  title: "AI 笔记 - 智能笔记管理系统",
  description: "基于AI的智能笔记管理系统，支持笔记、项目、待办事项和报告管理",
  keywords: ["AI", "笔记", "项目管理", "待办事项", "报告"],
  authors: [{ name: "AI Notebook Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
