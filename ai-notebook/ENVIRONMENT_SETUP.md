# 🔧 环境变量配置指南
# Environment Variables Setup Guide

## 📋 概述 (Overview)

AI智能笔记本应用支持两种运行模式：
- **演示模式 (Demo Mode)**: 使用内置模拟服务，数据存储在本地
- **生产模式 (Production Mode)**: 使用真实的Supabase云服务

The AI Notebook application supports two modes:
- **Demo Mode**: Uses built-in mock services with local data storage
- **Production Mode**: Uses real Supabase cloud services

## 🚀 快速开始 (Quick Start)

### 方法1: 使用现有配置 (Use Existing Configuration)

应用已经包含了完整的 `.env.local` 文件，您可以直接使用：

```bash
# 应用会自动检测配置并使用适当的模式
npm run dev
```

### 方法2: 从模板创建 (Create from Template)

```bash
# 复制模板文件
cp .env.example .env.local

# 编辑配置文件
# Edit the configuration file
```

## 📁 环境文件说明 (Environment Files)

### `.env.local` - 实际配置文件
- 包含完整的环境变量配置
- 已预配置为演示模式
- 包含详细的使用说明和注释
- **不会被提交到Git** (安全考虑)

### `.env.example` - 配置模板
- 环境变量模板文件
- 可以安全地提交到版本控制
- 用于团队协作和部署参考

## 🔧 配置选项 (Configuration Options)

### 核心配置 (Core Configuration)

| 变量名 | 说明 | 默认值 | 必需 |
|--------|------|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase项目URL | `your_supabase_project_url_here` | 生产模式 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase匿名密钥 | `your_supabase_anon_key_here` | 生产模式 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase服务密钥 | `your_supabase_service_role_key_here` | 生产模式 |

### 应用配置 (Application Configuration)

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `NEXT_PUBLIC_APP_URL` | 应用基础URL | `http://localhost:3000` |
| `NEXT_PUBLIC_AUTH_REDIRECT_URL` | 认证回调URL | `http://localhost:3000/auth/callback` |
| `NODE_ENV` | 运行环境 | `development` |

### 功能开关 (Feature Flags)

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `ENABLE_AI_FEATURES` | 启用AI功能 | `true` |
| `ENABLE_MULTI_USER` | 启用多用户模式 | `true` |
| `ENABLE_DATA_EXPORT` | 启用数据导出 | `true` |
| `ENABLE_REALTIME_SYNC` | 启用实时同步 | `true` |

## 🎯 运行模式详解 (Running Modes)

### 演示模式 (Demo Mode)

**特点:**
- ✅ 无需外部服务配置
- ✅ 数据存储在浏览器本地存储
- ✅ 支持完整的多用户认证流程
- ✅ 所有功能都可正常使用
- ⚠️ 数据仅在本地保存

**适用场景:**
- 快速体验应用功能
- 开发和测试
- 演示和展示

**启用条件:**
保持Supabase配置为默认值即可自动启用

### 生产模式 (Production Mode)

**特点:**
- ✅ 云端数据存储
- ✅ 真实的用户认证
- ✅ 数据持久化和同步
- ✅ 支持多设备访问
- ✅ 企业级安全性

**适用场景:**
- 正式部署和使用
- 多用户协作
- 数据长期保存

**配置步骤:**

1. **创建Supabase项目**
   ```bash
   # 访问 https://supabase.com
   # 创建新项目并获取配置信息
   ```

2. **获取配置信息**
   - 项目URL: `https://your-project.supabase.co`
   - API密钥: 在 Settings > API 中获取

3. **更新环境变量**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key
   ```

4. **初始化数据库**
   ```bash
   # 在Supabase SQL编辑器中运行
   # 执行 ../supabase-database-setup.sql 脚本
   ```

## 🔒 安全最佳实践 (Security Best Practices)

### 开发环境 (Development)
- ✅ 使用 `.env.local` 存储敏感信息
- ✅ 确保 `.env.local` 在 `.gitignore` 中
- ✅ 定期更新开发密钥

### 生产环境 (Production)
- ✅ 使用强密码和复杂密钥
- ✅ 启用Supabase行级安全 (RLS)
- ✅ 定期轮换API密钥
- ✅ 监控异常访问

### 部署配置 (Deployment)
- ✅ 在部署平台设置环境变量
- ✅ 不要在代码中硬编码密钥
- ✅ 使用HTTPS协议

## 🐛 故障排除 (Troubleshooting)

### 常见问题 (Common Issues)

**1. 应用无法启动**
```bash
# 检查环境变量格式
# 确保没有多余的空格或引号
```

**2. 认证功能异常**
```bash
# 检查Supabase项目状态
# 验证API密钥是否正确
```

**3. 数据无法保存**
```bash
# 检查网络连接
# 验证数据库配置
```

### 调试工具 (Debug Tools)

**1. 环境变量检查**
```javascript
// 在浏览器控制台运行
console.log('Environment Check:', {
  hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
  hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  nodeEnv: process.env.NODE_ENV
});
```

**2. 认证测试**
```javascript
// 在浏览器控制台运行
runAuthTests()
```

**3. 连接测试**
```javascript
// 在浏览器控制台运行
testSupabaseConnection()
```

## 📚 相关文档 (Related Documentation)

- [认证系统使用指南](./AUTHENTICATION_GUIDE.md)
- [部署指南](./DEPLOYMENT_GUIDE.md)
- [Supabase集成指南](../SUPABASE-INTEGRATION-GUIDE.md)
- [项目README](./README.md)

## 🆘 获取帮助 (Getting Help)

如果遇到问题，请：

1. **检查日志**: 查看浏览器控制台和终端输出
2. **验证配置**: 确认环境变量设置正确
3. **运行测试**: 使用内置的测试工具
4. **查看文档**: 参考相关的使用指南
5. **提交Issue**: 在GitHub仓库中报告问题

---

**祝您使用愉快！** 🎉
**Happy coding!** 🚀