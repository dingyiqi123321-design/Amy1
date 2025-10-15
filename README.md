# 🤖 AI智能笔记本

一个功能强大的智能笔记管理应用，集成了AI助手、项目管理、待办事项和多用户认证系统。

![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20Database-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0-blue)

## ✨ 主要功能

### 📝 智能笔记管理
- **富文本编辑器**：支持Markdown语法的现代化编辑体验
- **AI智能助手**：集成OpenRouter API，提供智能写作建议
- **笔记搜索**：快速查找和定位笔记内容
- **自动保存**：实时保存，永不丢失数据

### 👥 多用户认证系统
- **安全登录注册**：基于Supabase Auth的用户认证
- **数据隔离**：每个用户拥有独立的数据空间
- **会话管理**：自动处理登录状态和令牌刷新
- **密码重置**：支持邮箱验证的密码重置功能

### 📊 项目管理
- **项目创建**：组织和管理多个项目
- **任务跟踪**：详细的任务管理和进度跟踪
- **AI项目拆分**：智能将大项目拆分为可管理的任务
- **项目报告**：自动生成项目进度报告

### ✅ 待办事项
- **多列表管理**：创建和管理多个待办清单
- **任务优先级**：设置任务优先级和截止日期
- **完成跟踪**：直观的任务完成状态管理
- **批量操作**：高效的批量任务处理

### 📈 数据分析与报告
- **日报生成**：自动生成每日工作报告
- **周报统计**：汇总一周的工作成果
- **数据可视化**：图表展示工作效率和进度
- **导出功能**：支持多种格式的数据导出

### 🍅 番茄钟计时器
- **专注时间管理**：25分钟专注 + 5分钟休息的经典番茄工作法
- **自定义时长**：可调整工作和休息时间
- **统计跟踪**：记录每日专注时长和番茄数量

## 🚀 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器
- 现代浏览器（Chrome、Firefox、Safari、Edge）

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/your-username/ai-notebook.git
   cd ai-notebook
   ```

2. **安装依赖**
   ```bash
   npm install
   # 或
   yarn install
   ```

3. **配置环境变量**
   
   复制环境变量示例文件：
   ```bash
   cp .env.example .env.local
   ```
   
   编辑 `.env.local` 文件，配置您的Supabase项目信息：
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   # 或
   yarn dev
   ```

5. **访问应用**
   
   打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 🛠️ 配置说明

### Supabase 配置

应用支持两种运行模式：

#### 生产模式（推荐）
配置真实的Supabase项目，享受完整的云端数据库和认证服务。

1. 在 [Supabase](https://supabase.com) 创建新项目
2. 获取项目URL和API密钥
3. 运行数据库初始化脚本（见 `supabase-database-setup.sql`）
4. 配置环境变量

#### 演示模式
如果没有Supabase配置，应用会自动使用内置的模拟服务：
- 数据存储在浏览器本地存储
- 支持完整的认证流程
- 适合快速体验和开发测试

### AI功能配置

要使用AI助手功能，需要配置OpenRouter API：

1. 在应用中点击设置按钮
2. 输入您的OpenRouter API密钥
3. 选择合适的AI模型（推荐：GPT-4或Claude）

## 📁 项目结构

```
ai-notebook/
├── app/                    # Next.js 应用路由
│   ├── auth/              # 认证相关页面
│   ├── dashboard/         # 主仪表板
│   ├── login/            # 登录页面
│   └── layout.tsx        # 根布局
├── components/            # React 组件
│   ├── auth/             # 认证组件
│   ├── ui/               # UI 基础组件
│   └── providers/        # 上下文提供者
├── hooks/                # 自定义 React Hooks
├── lib/                  # 工具库和服务
│   ├── auth-service.ts   # 认证服务
│   ├── auth-storage.ts   # 认证存储服务
│   ├── supabase.ts       # Supabase 客户端
│   └── mock-supabase.ts  # 模拟服务
├── types/                # TypeScript 类型定义
└── public/               # 静态资源
```

## 🔧 开发指南

### 核心技术栈

- **前端框架**：Next.js 15.5.2 (App Router)
- **开发语言**：TypeScript
- **样式方案**：Tailwind CSS + shadcn/ui
- **状态管理**：React Hooks + Context
- **数据库**：Supabase (PostgreSQL)
- **认证系统**：Supabase Auth
- **AI集成**：OpenRouter API

### 开发命令

```bash
# 开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint

# 运行测试
npm run test
```

### 测试

应用包含完整的认证集成测试：

```javascript
// 在浏览器控制台运行
runAuthTests()
```

## 🔒 安全特性

- **行级安全 (RLS)**：数据库级别的用户数据隔离
- **JWT认证**：安全的用户会话管理
- **环境变量保护**：敏感信息通过环境变量管理
- **HTTPS支持**：生产环境强制使用HTTPS
- **XSS防护**：内置的跨站脚本攻击防护

## 📚 使用指南

详细的使用说明请参考：
- [认证系统使用指南](./AUTHENTICATION_GUIDE.md)
- [Supabase集成指南](./SUPABASE-INTEGRATION-GUIDE.md)

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。详情请见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React 全栈框架
- [Supabase](https://supabase.com/) - 开源的 Firebase 替代方案
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [shadcn/ui](https://ui.shadcn.com/) - 精美的 React 组件库
- [OpenRouter](https://openrouter.ai/) - AI 模型 API 聚合服务

## 📞 支持

如果您遇到问题或有建议，请：

1. 查看 [Issues](https://github.com/your-username/ai-notebook/issues)
2. 创建新的 Issue
3. 联系维护者

---

**让AI助力您的知识管理之旅！** 🚀✨
