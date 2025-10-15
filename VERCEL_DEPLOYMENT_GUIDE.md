# Vercel 部署指南 - AI智能笔记本

## 🚀 快速部署步骤

### 1. 准备工作

#### 必需文件检查
确保项目包含以下文件：
```
ai-notebook/
├── app/                    # Next.js应用目录
├── components/             # React组件
├── lib/                    # 工具函数
├── public/                 # 静态资源
├── package.json           # 依赖配置
├── next.config.ts         # Next.js配置
├── tsconfig.json          # TypeScript配置
├── tailwind.config.js     # TailwindCSS配置
├── .env.example           # 环境变量模板
└── vercel.json           # Vercel配置文件 ✅
```

#### 环境变量配置
创建 `.env.local` 文件（本地开发用），生产环境变量将在Vercel控制台配置：

```bash
# 复制环境变量模板
cp .env.example .env.local
```

### 2. 一键部署到Vercel

#### 方法A：使用Vercel CLI（推荐）

1. **安装Vercel CLI**
```bash
npm i -g vercel
```

2. **登录Vercel**
```bash
vercel login
```

3. **一键部署**
```bash
cd ai-notebook
vercel --prod
```

4. **按提示配置**
- 项目名称：`ai-notebook`
- 部署目录：`.`（当前目录）
- 构建命令：`npm run build`
- 输出目录：`dist` 或 `.next`

#### 方法B：GitHub集成部署

1. **推送代码到GitHub**
```bash
git add .
git commit -m "准备Vercel部署"
git push origin master
```

2. **Vercel控制台配置**
- 访问 [vercel.com](https://vercel.com)
- 点击 "New Project"
- 选择GitHub仓库
- 配置环境变量
- 点击 "Deploy"

### 3. 环境变量配置

#### 基础配置（必需）
```env
# 应用基础URL
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app

# 运行环境
NODE_ENV=production

# JWT密钥（生成新的随机字符串）
NEXTAUTH_SECRET=your-super-secret-jwt-key-here
```

#### Supabase配置（可选，用于生产环境）
```env
# Supabase项目信息
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

#### 功能开关
```env
# 功能开关
ENABLE_AI_FEATURES=true
ENABLE_MULTI_USER=true
ENABLE_DATA_EXPORT=true
ENABLE_REALTIME_SYNC=true
```

### 4. Vercel配置文件

创建 `vercel.json` 文件：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "nodeVersion": "18.x",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "NEXT_PUBLIC_APP_URL": "@next_public_app_url",
    "NODE_ENV": "production",
    "NEXTAUTH_SECRET": "@nextauth_secret"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_APP_URL": "@next_public_app_url"
    }
  }
}
```

### 5. 部署配置检查清单

#### ✅ 构建前检查
- [ ] 所有依赖已安装：`npm install`
- [ ] 本地构建成功：`npm run build`
- [ ] 环境变量已配置
- [ ] TypeScript编译无错误

#### ✅ 生产环境配置
- [ ] 生成安全的 `NEXTAUTH_SECRET`
- [ ] 配置正确的 `NEXT_PUBLIC_APP_URL`
- [ ] 设置生产环境变量
- [ ] 配置自定义域名（可选）

### 6. 部署后验证

#### 功能测试
- [ ] 访问部署的URL
- [ ] 测试记事本功能
- [ ] 测试AI生成功能
- [ ] 测试ToDo List功能
- [ ] 测试数据持久化

#### 性能检查
- [ ] 页面加载速度
- [ ] API响应时间
- [ ] 静态资源加载

### 7. 常见问题解决

#### 构建失败问题

**问题1：缺少UI组件**
```bash
# 安装缺失的组件
npx shadcn@latest add avatar dropdown-menu
```

**问题2：内存不足**
```json
// vercel.json 添加配置
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30,
      "memory": 1024
    }
  }
}
```

**问题3：环境变量错误**
```bash
# 检查环境变量格式
vercel env ls
vercel env add NEXTAUTH_SECRET production
```

#### 运行时问题

**问题1：API超时**
- 增加函数超时时间
- 优化API响应速度
- 使用Edge Functions

**问题2：数据库连接**
- 检查Supabase配置
- 验证连接字符串
- 检查网络权限

### 8. 高级配置

#### 自定义域名
```bash
# 添加自定义域名
vercel domains add your-domain.com
```

#### 环境分支部署
```bash
# 部署开发分支
vercel --target=development

# 部署预览分支
vercel --target=preview
```

#### 性能优化
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 9. 监控和维护

#### 日志查看
```bash
# 查看部署日志
vercel logs

# 实时日志
vercel logs --follow
```

#### 性能监控
- Vercel Analytics
- 自定义指标
- 错误追踪

### 10. 安全建议

#### 环境安全
- 使用强密钥
- 定期轮换密钥
- 限制数据库访问

#### 代码安全
- 依赖项扫描
- 安全审计
- 输入验证

## 📞 技术支持

如果遇到问题：
1. 查看Vercel文档：[vercel.com/docs](https://vercel.com/docs)
2. 检查构建日志
3. 验证环境变量
4. 联系技术支持

## 🎯 部署成功验证

部署完成后，访问您的应用URL，应该能看到：
- ✅ AI智能记事本界面
- ✅ 多模块切换功能
- ✅ 数据持久化
- ✅ AI生成功能

**恭喜！您的AI智能笔记本已成功部署到Vercel 🎉**