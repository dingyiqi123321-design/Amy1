// 数据恢复脚本
// 在浏览器控制台中运行此脚本来恢复示例数据

// 示例笔记数据
const sampleNotes = [
  {
    id: 'note-1',
    title: '我的第一篇笔记',
    content: '# 欢迎使用AI笔记本\n\n这是一个功能强大的笔记应用，支持：\n- Markdown编辑\n- AI问答\n- 待办事项管理\n\n开始记录你的想法吧！',
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-01').toISOString()
  },
  {
    id: 'note-2',
    title: '学习计划',
    content: '# 2024年学习计划\n\n## 技术学习\n- React 18新特性\n- TypeScript进阶\n- Node.js后端开发\n\n## 读书计划\n- 《代码整洁之道》\n- 《设计模式》\n- 《算法导论》',
    createdAt: new Date('2024-01-02').toISOString(),
    updatedAt: new Date('2024-01-02').toISOString()
  },
  {
    id: 'note-3',
    title: '项目想法',
    content: '# 项目想法收集\n\n## Web应用\n1. 个人博客系统\n2. 在线代码编辑器\n3. 任务管理工具\n\n## 移动应用\n1. 习惯追踪器\n2. 记账应用\n3. 学习打卡应用',
    createdAt: new Date('2024-01-03').toISOString(),
    updatedAt: new Date('2024-01-03').toISOString()
  }
];

// 示例待办事项数据
const sampleTodos = [
  {
    id: 'todo-list-1',
    title: '工作任务',
    items: [
      {
        id: 'todo-1',
        text: '完成项目文档',
        completed: false,
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date('2024-01-01').toISOString()
      },
      {
        id: 'todo-2',
        text: '代码审查',
        completed: true,
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date('2024-01-01').toISOString()
      },
      {
        id: 'todo-3',
        text: '团队会议准备',
        completed: false,
        createdAt: new Date('2024-01-02').toISOString(),
        updatedAt: new Date('2024-01-02').toISOString()
      }
    ],
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-02').toISOString()
  },
  {
    id: 'todo-list-2',
    title: '个人事务',
    items: [
      {
        id: 'todo-4',
        text: '买菜',
        completed: true,
        createdAt: new Date('2024-01-03').toISOString(),
        updatedAt: new Date('2024-01-03').toISOString()
      },
      {
        id: 'todo-5',
        text: '健身',
        completed: false,
        createdAt: new Date('2024-01-03').toISOString(),
        updatedAt: new Date('2024-01-03').toISOString()
      },
      {
        id: 'todo-6',
        text: '读书30分钟',
        completed: false,
        createdAt: new Date('2024-01-03').toISOString(),
        updatedAt: new Date('2024-01-03').toISOString()
      }
    ],
    createdAt: new Date('2024-01-03').toISOString(),
    updatedAt: new Date('2024-01-03').toISOString()
  }
];

// 恢复数据函数
function restoreData() {
  try {
    // 保存笔记数据
    localStorage.setItem('ai-notebook-notes', JSON.stringify(sampleNotes));
    console.log('✅ 笔记数据已恢复');
    
    // 保存待办事项数据
    localStorage.setItem('ai-notebook-todos', JSON.stringify(sampleTodos));
    console.log('✅ 待办事项数据已恢复');
    
    console.log('🎉 所有数据恢复完成！请刷新页面查看。');
    
    // 自动刷新页面
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    
  } catch (error) {
    console.error('❌ 数据恢复失败:', error);
  }
}

// 检查当前数据函数
function checkCurrentData() {
  const notes = localStorage.getItem('ai-notebook-notes');
  const todos = localStorage.getItem('ai-notebook-todos');
  
  console.log('📝 当前笔记数据:', notes ? JSON.parse(notes) : '无数据');
  console.log('📋 当前待办数据:', todos ? JSON.parse(todos) : '无数据');
}

// 清空数据函数（谨慎使用）
function clearAllData() {
  localStorage.removeItem('ai-notebook-notes');
  localStorage.removeItem('ai-notebook-todos');
  console.log('🗑️ 所有数据已清空');
}

// 导出函数到全局
window.restoreData = restoreData;
window.checkCurrentData = checkCurrentData;
window.clearAllData = clearAllData;

console.log('📚 数据恢复脚本已加载！');
console.log('🔧 可用命令：');
console.log('  - restoreData()     : 恢复示例数据');
console.log('  - checkCurrentData(): 检查当前数据');
console.log('  - clearAllData()    : 清空所有数据（谨慎使用）');
console.log('');
console.log('💡 建议先运行 checkCurrentData() 查看当前状态');
console.log('   然后运行 restoreData() 恢复数据');