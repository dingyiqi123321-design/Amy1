// Supabase 连接测试脚本
// 在浏览器控制台中运行此脚本来测试数据库连接

import { supabase } from './supabase';
import { noteService, projectService, todoService } from './supabase-storage';

export async function testSupabaseConnection() {
  console.log('🔍 开始测试 Supabase 连接...');

  try {
    // 1. 测试基本连接
    console.log('1️⃣ 测试基本连接...');
    const { data, error } = await supabase.from('notes').select('count', { count: 'exact' });
    
    if (error) {
      console.error('❌ 连接失败:', error);
      return false;
    }
    
    console.log('✅ 基本连接成功');

    // 2. 测试笔记服务
    console.log('2️⃣ 测试笔记服务...');
    const notes = await noteService.loadNotes();
    console.log(`✅ 成功加载 ${notes.length} 条笔记`);

    // 3. 测试项目服务
    console.log('3️⃣ 测试项目服务...');
    const projects = await projectService.loadProjects();
    console.log(`✅ 成功加载 ${projects.length} 个项目`);

    // 4. 测试待办事项服务
    console.log('4️⃣ 测试待办事项服务...');
    const todoLists = await todoService.loadTodoLists();
    console.log(`✅ 成功加载 ${todoLists.length} 个待办事项列表`);

    // 5. 测试创建操作
    console.log('5️⃣ 测试创建操作...');
    
    // 创建测试笔记
    const testNote = await noteService.saveNote({
      title: '测试笔记',
      content: '这是一个测试笔记内容',
      summary: '测试摘要'
    });
    
    if (testNote) {
      console.log('✅ 成功创建测试笔记:', testNote.id);
      
      // 删除测试笔记
      const deleted = await noteService.deleteNote(testNote.id);
      if (deleted) {
        console.log('✅ 成功删除测试笔记');
      }
    }

    console.log('🎉 所有测试通过！Supabase 集成成功！');
    return true;

  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error);
    return false;
  }
}

export async function testEnvironmentVariables() {
  console.log('🔍 检查环境变量配置...');

  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];

  const missingVars = [];

  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (!value) {
      missingVars.push(varName);
      console.error(`❌ 缺少环境变量: ${varName}`);
    } else {
      console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
    }
  }

  if (missingVars.length > 0) {
    console.error('❌ 请在 .env.local 文件中配置缺少的环境变量');
    return false;
  }

  console.log('✅ 所有必需的环境变量都已配置');
  return true;
}

export async function runAllTests() {
  console.log('🚀 开始完整的 Supabase 集成测试...');
  
  const envTest = await testEnvironmentVariables();
  if (!envTest) {
    console.log('❌ 环境变量测试失败，请先配置环境变量');
    return;
  }

  const connectionTest = await testSupabaseConnection();
  if (connectionTest) {
    console.log('🎉 Supabase 集成测试全部通过！');
    console.log('📝 你现在可以开始使用 Supabase 存储服务了');
  } else {
    console.log('❌ 集成测试失败，请检查配置');
  }
}

// 在浏览器控制台中运行测试
if (typeof window !== 'undefined') {
  (window as any).testSupabase = {
    runAllTests,
    testConnection: testSupabaseConnection,
    testEnvVars: testEnvironmentVariables
  };
  
  console.log('🔧 Supabase 测试工具已加载');
  console.log('💡 在控制台中运行: testSupabase.runAllTests()');
}