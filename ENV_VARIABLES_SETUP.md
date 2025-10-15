# 环境变量配置指南

## 🚀 快速开始

### 1. 必需环境变量

```env
# 应用基础URL - Vercel会自动设置
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# 运行环境
NODE_ENV=production

# JWT密钥 - 重要：生成新的随机密钥
NEXTAUTH_SECRET=your-super-secret-jwt-key-here
```

### 2. 功能开关

```env
# 启用AI功能
ENABLE_AI_FEATURES=true

# 启用多用户功能
ENABLE_MULTI_USER=true

# 启用数据导出
ENABLE_DATA_EXPORT=true

# 启用实时同步
ENABLE_REALTIME_SYNC=true
```

### 3. 可选的Supabase配置

```env
# 如果需要真实数据库，配置Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 🔑 生成安全密钥

### JWT密钥生成
```bash
# Linux/Mac
openssl rand -base64 32

# Windows (PowerShell)
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

### 示例密钥（请勿直接使用）
```env
NEXTAUTH_SECRET="your-super-secret-jwt-key-min-32-characters-long"
```

## 📋 Vercel部署配置步骤

### 1. 登录Vercel控制台
```bash
# 安装Vercel CLI
npm i -g vercel

# 登录
vercel login
```

### 2. 配置环境变量
```bash
# 添加环境变量
vercel env add NEXT_PUBLIC_APP_URL production
vercel env add NODE_ENV production
vercel env add NEXTAUTH_SECRET production
vercel env add ENABLE_AI_FEATURES production
```

### 3. 一键部署
```bash
cd ai-notebook
vercel --prod
```

## 🎯 部署验证清单

### 部署前检查
- [ ] 生成了新的NEXTAUTH_SECRET
- [ ] 配置了正确的APP_URL
- [ ] 所有功能开关已设置
- [ ] 本地构建成功

### 部署后验证
- [ ] 访问应用URL正常
- [ ] AI功能正常工作
- [ ] 数据持久化正常
- [ ] 多模块切换正常

## 🔧 故障排除

### 常见问题

**1. 构建失败**
```bash
# 检查依赖
npm install

# 测试构建
npm run build
```

**2. 环境变量错误**
```bash
# 查看环境变量
vercel env ls

# 重新设置
vercel env add VARIABLE_NAME production
```

**3. 功能异常**
- 检查浏览器控制台
- 验证环境变量值
- 查看Vercel函数日志

## 📊 性能建议

### 优化配置
```env
# 生产环境建议
DEBUG=false
VERBOSE_LOGGING=false
```

### 监控配置
- 启用Vercel Analytics
- 配置错误监控
- 设置性能告警

## 🔐 安全建议

1. **密钥管理**
   - 使用强随机密钥
   - 定期轮换密钥
   - 不要在代码中硬编码

2. **访问控制**
   - 限制数据库访问
   - 配置CORS策略
   - 使用HTTPS

3. **数据保护**
   - 启用数据加密
   - 定期备份数据
   - 监控异常访问

## 🚀 下一步

部署成功后，您可以：
1. 配置自定义域名
2. 设置CI/CD流程
3. 启用监控和分析
4. 优化性能和SEO

**祝部署顺利！** 🎉