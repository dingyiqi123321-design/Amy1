# AI笔记本项目 Supabase 集成指南

## 📋 概述

本指南将帮助你将AI笔记本项目连接到Supabase数据库，实现数据的云端存储和同步。

## 🚀 快速开始

### 1. 在Supabase中创建数据库表

1. 登录到你的 [Supabase控制台](https://app.supabase.com/)
2. 选择你的项目
3. 进入 **SQL编辑器**
4. 复制并执行 `supabase-database-setup.sql` 文件中的所有SQL语句

### 2. 配置环境变量

1. 在 `ai-notebook` 目录下找到 `.env.local` 文件
2. 替换以下占位符为你的实际Supabase项目参数：

```env
# Supabase 项目 URL (在项目设置 > API 中找到)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co

# Supabase 匿名公钥 (在项目设置 > API 中找到)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Supabase 服务角色密钥 (在项目设置 > API 中找到，仅在服务端使用)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# 数据库直连 URL (在项目设置 > 数据库 中找到，可选)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project-ref.supabase.co:5432/postgres
```

### 3. 获取Supabase项目参数

在Supabase控制台中：

1. **项目URL和API密钥**：
   - 进入项目设置 → API
   - 复制 `Project URL`
   - 复制 `anon public` 密钥
   - 复制 `service_role` 密钥（谨慎使用）

2. **数据库连接字符串**：
   - 进入项目设置 → 数据库
   - 复制连接字符串并替换密码

## 📊 数据库表结构

项目包含以下8个主要数据表：

### 核心表
- **notes** - 笔记存储
- **projects** - 项目管理
- **project_tasks** - 项目任务
- **todo_lists** - 待办事项列表
- **todo_items** - 待办事项

### 报告表
- **daily_reports** - 日报
- **weekly_reports** - 周报
- **report_templates** - 报告模板

## 🔧 使用新的存储服务

项目已经创建了新的Supabase存储服务 (`lib/supabase-storage.ts`)，包含以下服务：

- `noteService` - 笔记操作
- `projectService` - 项目和任务操作
- `todoService` - 待办事项操作
- `reportService` - 报告操作

### 迁移现有组件

要使用Supabase存储，需要在组件中替换导入：

```typescript
// 旧的导入
import { loadNotesFromLocalStorage, saveNotesToLocalStorage } from '@/lib/storage';

// 新的导入
import { noteService } from '@/lib/supabase-storage';

// 使用示例
const notes = await noteService.loadNotes();
const newNote = await noteService.saveNote({ title, content, summary });
```

## 🔒 安全配置

### 行级安全策略 (RLS)

数据库已启用RLS并配置了基本策略。当前策略允许所有操作，你可以根据需要调整：

```sql
-- 示例：限制用户只能访问自己的数据
CREATE POLICY "Users can only see own notes" ON notes
    FOR ALL USING (auth.uid() = user_id);
```

### 环境变量安全

- ✅ `.env.local` 已被 `.gitignore` 忽略
- ✅ 敏感密钥不会被提交到版本控制
- ⚠️ 服务角色密钥仅在服务端使用

## 🧪 测试集成

### 1. 启动开发服务器

```bash
cd ai-notebook
npm run dev
```

### 2. 验证连接

在浏览器控制台中测试：

```javascript
// 测试笔记服务
import { noteService } from './lib/supabase-storage';
noteService.loadNotes().then(console.log);
```

### 3. 检查数据库

在Supabase控制台的表编辑器中查看数据是否正确存储。

## 📝 数据迁移

如果你有现有的localStorage数据，可以创建迁移脚本：

```typescript
// 示例迁移脚本
import { loadNotesFromLocalStorage } from '@/lib/storage';
import { noteService } from '@/lib/supabase-storage';

async function migrateNotes() {
  const localNotes = loadNotesFromLocalStorage();
  for (const note of localNotes) {
    await noteService.saveNote({
      title: note.title,
      content: note.content,
      summary: note.summary,
    });
  }
}
```

## 🔧 故障排除

### 常见问题

1. **连接失败**
   - 检查环境变量是否正确设置
   - 确认Supabase项目状态正常

2. **权限错误**
   - 检查RLS策略配置
   - 确认API密钥权限

3. **数据类型错误**
   - 检查数据库表结构
   - 确认字段类型匹配

### 调试技巧

```typescript
// 启用详细错误日志
import { supabase } from '@/lib/supabase';

supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event, session);
});
```

## 📚 相关资源

- [Supabase 官方文档](https://supabase.com/docs)
- [Supabase JavaScript 客户端](https://supabase.com/docs/reference/javascript)
- [Next.js 与 Supabase 集成](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)

## 🎯 下一步

1. 根据需要调整RLS策略
2. 实现用户认证（可选）
3. 添加数据备份策略
4. 优化查询性能
5. 添加实时订阅功能

---

**配置完成时间**: $(Get-Date)
**版本**: 1.0.0
**支持**: 如有问题请查看Supabase文档或联系技术支持