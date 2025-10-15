# 🚀 Vercel 环境变量配置指南
# Vercel Environment Variables Configuration Guide

## 📋 必需的环境变量 (Required Environment Variables)

在Vercel部署页面的 "Environment Variables" 部分添加以下变量：

### 🔑 核心配置 (Core Configuration)

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `your_supabase_project_url_here` | Supabase项目URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your_supabase_anon_key_here` | Supabase匿名密钥 |
| `SUPABASE_SERVICE_ROLE_KEY` | `your_supabase_service_role_key_here` | Supabase服务密钥 |
| `NEXT_PUBLIC_APP_URL` | `https://your-app-name.vercel.app` | 应用URL（部署后更新） |
| `NODE_ENV` | `production` | 运行环境 |

### 🔒 安全配置 (Security Configuration)

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NEXTAUTH_SECRET` | `your-strong-secret-key-here` | JWT密钥（生成强密钥） |

### ⚙️ 功能开关 (Feature Flags) - 可选

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `ENABLE_AI_FEATURES` | `true` | 启用AI功能 |
| `ENABLE_MULTI_USER` | `true` | 启用多用户模式 |
| `ENABLE_DATA_EXPORT` | `true` | 启用数据导出 |
| `ENABLE_REALTIME_SYNC` | `true` | 启用实时同步 |

## 🎯 两种部署模式 (Two Deployment Modes)

### 模式1：演示模式 (Demo Mode) - 快速部署

如果您想快速部署体验版本，只需设置：

```
NODE_ENV = production
NEXT_PUBLIC_APP_URL = https://your-app-name.vercel.app
NEXTAUTH_SECRET = your-strong-secret-key-here
```

**特点：**
- ✅ 无需Supabase配置
- ✅ 使用内置模拟服务
- ✅ 数据存储在浏览器本地
- ✅ 支持完整功能演示

### 模式2：生产模式 (Production Mode) - 完整功能

如果您有Supabase项目，设置所有环境变量：

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_actual_anon_key
SUPABASE_SERVICE_ROLE_KEY = your_actual_service_role_key
NEXT_PUBLIC_APP_URL = https://your-app-name.vercel.app
NODE_ENV = production
NEXTAUTH_SECRET = your-strong-secret-key-here
```

**特点：**
- ✅ 云端数据存储
- ✅ 真实用户认证
- ✅ 多设备同步
- ✅ 企业级安全

## 📝 配置步骤详解 (Detailed Configuration Steps)

### 步骤1：在Vercel部署页面配置

1. **找到 "Environment Variables" 部分**
2. **点击 "Add More" 按钮**
3. **逐个添加环境变量**：
   - Key: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `your_supabase_project_url_here`
   - 点击添加

4. **重复添加其他变量**

### 步骤2：生成安全密钥

为 `NEXTAUTH_SECRET` 生成强密钥：

```bash
# 方法1：使用在线工具
# 访问 https://generate-secret.vercel.app/

# 方法2：使用命令行
openssl rand -base64 32

# 方法3：使用Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 步骤3：更新应用URL

部署完成后：
1. 获取Vercel分配的URL（如：`https://your-app-name.vercel.app`）
2. 更新 `NEXT_PUBLIC_APP_URL` 环境变量
3. 如果使用Supabase，在Supabase项目中添加此URL到允许的重定向URL列表

## 🔧 Vercel部署配置 (Vercel Deployment Configuration)

确保您的Vercel配置正确：

### Root Directory
```
ai-notebook
```

### Build Command
```
npm run build
```

### Output Directory
```
.next
```

### Install Command
```
npm install
```

## ⚠️ 重要注意事项 (Important Notes)

### 安全提醒 (Security Reminders)
- ❌ **不要**将 `.env.local` 文件上传到GitHub
- ❌ **不要**在代码中硬编码密钥
- ✅ **务必**在Vercel界面中配置环境变量
- ✅ **务必**使用强密钥

### 调试提示 (Debug Tips)
- 部署后检查Vercel的 "Functions" 日志
- 在浏览器控制台检查环境变量是否正确加载
- 使用Vercel的预览部署测试配置

## 🚀 快速部署命令 (Quick Deployment)

如果您想要最简单的部署：

1. **在Vercel中只设置这两个变量**：
   ```
   NODE_ENV = production
   NEXTAUTH_SECRET = [生成的强密钥]
   ```

2. **点击 Deploy**

3. **应用将以演示模式运行**，所有功能都可用！

## 🆘 故障排除 (Troubleshooting)

### 常见问题 (Common Issues)

**1. 部署失败**
- 检查Root Directory是否设置为 `ai-notebook`
- 确认环境变量格式正确

**2. 应用无法访问**
- 检查构建日志
- 验证环境变量是否正确设置

**3. 功能异常**
- 检查浏览器控制台错误
- 验证Supabase配置（如果使用）

---

**准备好了吗？现在就可以在Vercel中配置这些环境变量并部署您的应用！** 🎉