AI Native 个人记事本 - 产品需求与技术方案文档
1. 项目/功能概述 (Overview)
本项目旨在开发一个现代、简洁、AI 赋能的个人记事本 Web 应用。它将提供一个清爽的 Markdown 写作环境，核心特色是利用 AI（通过 OpenRouter）实现笔记的自动标题生成、内容总结，以及基于全部笔记内容的智能问答。应用将采用纯前端实现，所有数据存储在用户的浏览器本地，确保极致的简洁和隐私性。

2. 核心功能点 (Core Features)
笔记管理 (CRUD): 支持笔记的创建、阅读、更新和删除。
Markdown 编辑器: 右侧核心编辑区域支持 Markdown 语法，提供良好的写作体验。
三栏式布局:
左侧边栏: 展示所有笔记的列表。每个列表项包含 AI 生成的标题、更新日期 和 AI 生成的内容摘要。
右侧主区域: 用于撰写和展示当前選中笔记的完整 Markdown 内容。
自动保存: 用户在编辑器中停止输入后，笔记内容将自动保存，无需手动操作。
便捷交互: 鼠标悬浮在左侧笔记列表项上时，显示删除按钮。
AI 功能 1 - 自动生成: 在创建或修改笔记后，自动调用 AI 生成笔记的 标题 和 摘要。
AI 功能 2 - 智能问答: 提供一个独立的对话入口，用户可以就自己记录的所有笔记内容向 AI 进行提问，AI 会整合信息后给出回答。
3. 技术规格 (Technical Specifications)
前端 (Frontend)

由于我们选择将数据存储在浏览器本地，这个项目将是一个纯前端应用，不需要独立的后端服务器来存储笔记数据。

页面/组件 (Pages/Components):

MainLayout.tsx: 主布局文件，使用 Shadcn/UI 的 Resizable 组件构建左侧栏和右侧内容区的可调整布局。
NoteList.tsx: 左侧边栏组件，负责获取并展示所有笔记的列表。
NoteListItem.tsx: 笔记列表中的单个条目，包含标题、摘要、日期，并处理鼠标悬浮显示删除按钮的逻辑。
Editor.tsx: 右侧的 Markdown 编辑器组件。可以由一个 Textarea（用于输入）和一个 Markdown 渲染库（如 react-markdown，用于实时预览）组成。
AIChatModal.tsx: AI 智能问答的对话框组件。通过一个悬浮按钮触发，打开后提供对话界面。
ApiKeyInput.tsx: 一个简单的组件，允许你在应用界面中输入并临时保存你的 OpenRouter API 密钥到浏览器本地存储中，以避免硬编码在代码里。
用户流程 (User Flow):

启动应用: 页面加载，脚本从浏览器 localStorage 读取所有已保存的笔记并展示在左侧列表。
新建笔记: 用户点击“新建”按钮，一个新的空白笔记被创建并出现在列表顶部，右侧编辑器进入可编辑状态。
编辑笔记: 用户在右侧 Editor 中输入内容。在他停止输入（例如 2 秒后），autosave 逻辑触发。
自动保存与 AI 处理:
笔记内容被保存到 localStorage。
应用检查内容是否有显著变化。若有，则触发对 OpenRouter 的 API 调用，为当前笔记生成新的标题和摘要，并更新到笔记数据中。
删除笔记: 用户鼠标悬浮到左侧某个笔记上，点击出现的删除图标，确认后该笔记从 localStorage 中移除。
AI 问答:
用户点击“与笔记对话”按钮，打开 AIChatModal。
用户输入问题，点击发送。
应用从 localStorage 读取 所有笔记 的内容，整合成一个大的上下文文本。
应用调用 OpenRouter API，将上下文和用户问题一同发送。
AI 返回的答案流式显示在对话框中。
数据交互 (Data Interaction):

本地存储: 所有笔记数据以一个 JSON 数组的形式存储在浏览器的 localStorage 中。
localStorage.setItem('notes', JSON.stringify(notesArray))
localStorage.getItem('notes')
外部 API - OpenRouter:
安全提示: 如前所述，在纯前端应用中直接调用需要密钥的 API 会将密钥暴露给浏览器，这是不安全的。对于这个个人项目，我们采取一个折衷方案：你在应用中提供一个输入框来设置密钥，它只保存在你自己的浏览器 localStorage 里，绝不要将密钥写入代码并上传到 GitHub 等公共平台。
请求格式:
Endpoint: POST https://openrouter.ai/api/v1/chat/completions
Headers:
Authorization: Bearer YOUR_OPENROUTER_API_KEY
Content-Type: application/json
Body (JSON):
<JSON>
{
  "model": "deepseek/deepseek-chat-v3.1",
  "messages": [
    { "role": "system", "content": "You are a helpful assistant." },
    { "role": "user", "content": "这是我的笔记内容：[...笔记内容...]。请为它生成一个不超过10个字的标题和一段50字以内的摘要，并以JSON格式返回：{\"title\": \"...\", \"summary\": \"...\"}" }
  ]
}
后端 (Backend)

在此项目中，由于我们选择了纯浏览器本地存储方案，因此不需要专门的后端服务来存储笔记数据。
数据模型 (Data Models)

我们将在前端代码中定义一个清晰的笔记对象结构：

<TYPESCRIPT>
// 定义一个 Note 对象的结构
interface Note {
  id: string;          // 唯一标识符，例如 crypto.randomUUID()
  title: string;         // 笔记标题 (可由AI生成)
  content: string;       // 完整的 Markdown 内容
  summary: string;       // 笔记摘要 (可由AI生成)
  createdAt: string;     // 创建时间 (ISO 8601 格式)
  updatedAt: string;     // 最后更新时间 (ISO 8601 格式)
}
4. 技术栈建议 (Tech Stack Suggestion)
框架 (Framework): Next.js (一个强大的 React 框架，内置了最佳实践，与 Shadcn/UI 完美集成)。
UI 组件库 (UI Library): Shadcn/UI + Tailwind CSS (按照你的审美偏好，可以快速构建出现代、简洁的界面)。
Markdown 处理:
react-markdown: 用于将 Markdown 文本渲染成 HTML 页面。
remark-gfm: react-markdown 的一个插件，用于支持 GitHub Flavored Markdown（如表格、删除线等）。
状态管理 (State Management): 使用 React 自带的 useState, useContext 就足够管理笔记状态和 API 密钥。
图标 (Icons): lucide-react (Shadcn/UI 默认集成的图标库)。
语言 (Language): TypeScript (提供类型安全，能更好地定义我们的 Note 数据模型)。
5. 开发步骤建议 (Development Steps)
我为你将整个项目拆解成了可以一步步完成的小任务，非常适合初学者上手：

步骤 0：项目初始化

使用 create-next-app 创建一个新的 Next.js 项目（选择 TypeScript 和 Tailwind CSS）。
根据 Shadcn/UI 官网的指引，完成初始化配置。
步骤 1：构建静态布局

使用 Shadcn/UI 的 Resizable 组件搭建出左/右分栏的基本布局。
在左侧放置一个临时的笔记列表，右侧放置一个 <textarea> 作为编辑器。此时界面是静态的，没有功能。
步骤 2：实现核心笔记管理 (无 AI)

使用 useState 创建一个 notes 数组来保存所有笔记。
实现“新建笔记”功能：点击按钮向 notes 数组中添加一个新的 Note 对象。
实现笔记列表的渲染：遍历 notes 数组，将每个笔记的标题显示在左侧。
实现笔记切换：点击左侧的笔记项，将其内容显示在右侧的编辑器中。
实现笔记删除功能。
步骤 3：集成 localStorage 和自动保存

编写两个辅助函数：saveNotesToLocalStorage(notes) 和 loadNotesFromLocalStorage()。
使用 useEffect Hook，在 notes 状态发生变化时，调用 saveNotesToLocalStorage。
在应用首次加载时，调用 loadNotesFromLocalStorage 初始化 notes 状态。
为 <textarea> 添加 onChange 事件，使用 setTimeout 实现一个简单的防抖（debounce）函数，实现停止输入后自动保存。
步骤 4：集成 Markdown 预览

安装 react-markdown。
在编辑器旁边或下方开辟一块区域，使用 <ReactMarkdown> 组件实时渲染编辑器中的文本，提供预览。
步骤 5：集成 AI 功能（标题/摘要生成）

创建一个安全的 ApiKeyInput 组件，让你可以输入并保存 API 密钥到 localStorage。
封装一个 callOpenRouter 函数，负责发送网络请求到 OpenRouter API。
修改自动保存逻辑：当笔记内容更新后，调用 callOpenRouter，并附上特定指令（Prompt）来获取标题和摘要，然后更新对应的 Note 对象。
步骤 6：实现 AI 智能问答

创建 AIChatModal 组件和触发它的按钮。
在用户提问时，从 localStorage 拿到所有笔记内容，拼接成一个大的上下文。
调用 callOpenRouter，将上下文和问题一起发送给 AI。
将 AI 返回的结果显示在聊天界面中。
步骤 7：UI 优化与收尾

完善样式，使其更接近苹果风格（增加留白、调整字体、使用柔和的边框和阴影）。
处理各种边缘情况，例如：没有笔记时的空状态显示。
优化交互细节，如悬浮效果、点击动画等。