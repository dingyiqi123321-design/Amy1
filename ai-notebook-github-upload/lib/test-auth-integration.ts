// 认证集成测试脚本
// 在浏览器控制台中运行此脚本来测试多用户认证和数据隔离功能

import { supabase } from './supabase';
import { authNoteService, authProjectService, authTodoService } from './auth-storage';
import { AuthService } from './auth-service';

// 测试用户数据
const testUsers = [
  {
    email: 'user1@test.com',
    password: 'TestPassword123!',
    displayName: '测试用户1'
  },
  {
    email: 'user2@test.com', 
    password: 'TestPassword456!',
    displayName: '测试用户2'
  }
];

// 测试数据
const testData = {
  notes: [
    { title: '用户1的笔记', content: '这是用户1的私人笔记内容', summary: '用户1的笔记摘要' },
    { title: '工作计划', content: '今天的工作安排和计划', summary: '工作计划摘要' }
  ],
  projects: [
    { name: '用户1的项目A' },
    { name: '个人学习项目' }
  ],
  todos: [
    { title: '用户1的待办清单' }
  ]
};

class AuthIntegrationTest {
  private authService: AuthService;
  private testResults: any[] = [];

  constructor() {
    this.authService = new AuthService();
  }

  // 记录测试结果
  private log(message: string, success: boolean = true, data?: any) {
    const result = {
      timestamp: new Date().toISOString(),
      message,
      success,
      data
    };
    this.testResults.push(result);
    console.log(`${success ? '✅' : '❌'} ${message}`, data || '');
  }

  // 清理测试数据
  private async cleanup() {
    try {
      // 登出当前用户
      await this.authService.signOut();
      this.log('清理：用户已登出');
    } catch (error) {
      this.log('清理失败', false, error);
    }
  }

  // 测试用户注册
  async testUserRegistration() {
    this.log('开始测试用户注册...');
    
    for (const user of testUsers) {
      try {
        const result = await this.authService.signUp(
          user.email, 
          user.password, 
          user.displayName
        );
        
        if (result.success) {
          this.log(`用户注册成功: ${user.email}`);
        } else {
          this.log(`用户注册失败: ${user.email}`, false, result.error);
        }
      } catch (error) {
        this.log(`用户注册异常: ${user.email}`, false, error);
      }
    }
  }

  // 测试用户登录
  async testUserLogin() {
    this.log('开始测试用户登录...');
    
    for (const user of testUsers) {
      try {
        const result = await this.authService.signIn(user.email, user.password);
        
        if (result.success) {
          this.log(`用户登录成功: ${user.email}`);
          
          // 验证用户信息
          const currentUser = await supabase.auth.getUser();
          if (currentUser.data.user?.email === user.email) {
            this.log(`用户信息验证成功: ${user.email}`);
          } else {
            this.log(`用户信息验证失败: ${user.email}`, false);
          }
          
          // 登出以便测试下一个用户
          await this.authService.signOut();
        } else {
          this.log(`用户登录失败: ${user.email}`, false, result.error);
        }
      } catch (error) {
        this.log(`用户登录异常: ${user.email}`, false, error);
      }
    }
  }

  // 测试数据隔离
  async testDataIsolation() {
    this.log('开始测试数据隔离...');
    
    // 用户1登录并创建数据
    try {
      const user1 = testUsers[0];
      await this.authService.signIn(user1.email, user1.password);
      this.log(`用户1登录成功: ${user1.email}`);
      
      // 创建用户1的数据
      const user1Note = await authNoteService.saveNote(testData.notes[0]);
      const user1Project = await authProjectService.saveProject(testData.projects[0]);
      const user1Todo = await authTodoService.saveTodoList(testData.todos[0]);
      
      if (user1Note && user1Project && user1Todo) {
        this.log('用户1数据创建成功');
      } else {
        this.log('用户1数据创建失败', false);
      }
      
      // 登出用户1
      await this.authService.signOut();
      
      // 用户2登录
      const user2 = testUsers[1];
      await this.authService.signIn(user2.email, user2.password);
      this.log(`用户2登录成功: ${user2.email}`);
      
      // 检查用户2是否能看到用户1的数据
      const user2Notes = await authNoteService.loadNotes();
      const user2Projects = await authProjectService.loadProjects();
      const user2Todos = await authTodoService.loadTodoLists();
      
      if (user2Notes.length === 0 && user2Projects.length === 0 && user2Todos.length === 0) {
        this.log('数据隔离测试成功：用户2无法看到用户1的数据');
      } else {
        this.log('数据隔离测试失败：用户2能看到其他用户的数据', false, {
          notes: user2Notes.length,
          projects: user2Projects.length,
          todos: user2Todos.length
        });
      }
      
      // 创建用户2的数据
      const user2Note = await authNoteService.saveNote(testData.notes[1]);
      const user2Project = await authProjectService.saveProject(testData.projects[1]);
      
      if (user2Note && user2Project) {
        this.log('用户2数据创建成功');
        
        // 验证用户2只能看到自己的数据
        const user2NotesAfter = await authNoteService.loadNotes();
        const user2ProjectsAfter = await authProjectService.loadProjects();
        
        if (user2NotesAfter.length === 1 && user2ProjectsAfter.length === 1) {
          this.log('用户2数据验证成功：只能看到自己的数据');
        } else {
          this.log('用户2数据验证失败', false, {
            notes: user2NotesAfter.length,
            projects: user2ProjectsAfter.length
          });
        }
      }
      
      await this.authService.signOut();
      
    } catch (error) {
      this.log('数据隔离测试异常', false, error);
    }
  }

  // 测试数据CRUD操作
  async testDataCRUD() {
    this.log('开始测试数据CRUD操作...');
    
    try {
      const user1 = testUsers[0];
      await this.authService.signIn(user1.email, user1.password);
      
      // 测试笔记CRUD
      const note = await authNoteService.saveNote({
        title: 'CRUD测试笔记',
        content: '这是一个CRUD测试笔记',
        summary: 'CRUD测试'
      });
      
      if (note) {
        this.log('笔记创建成功');
        
        // 更新笔记
        const updatedNote = await authNoteService.updateNote({
          ...note,
          title: 'CRUD测试笔记（已更新）',
          content: '这是一个更新后的CRUD测试笔记'
        });
        
        if (updatedNote) {
          this.log('笔记更新成功');
          
          // 删除笔记
          const deleteSuccess = await authNoteService.deleteNote(note.id);
          if (deleteSuccess) {
            this.log('笔记删除成功');
          } else {
            this.log('笔记删除失败', false);
          }
        } else {
          this.log('笔记更新失败', false);
        }
      } else {
        this.log('笔记创建失败', false);
      }
      
      await this.authService.signOut();
      
    } catch (error) {
      this.log('数据CRUD测试异常', false, error);
    }
  }

  // 运行所有测试
  async runAllTests() {
    this.log('🚀 开始认证集成测试');
    
    await this.cleanup();
    await this.testUserRegistration();
    await this.testUserLogin();
    await this.testDataIsolation();
    await this.testDataCRUD();
    await this.cleanup();
    
    this.log('🏁 认证集成测试完成');
    
    // 输出测试报告
    const successCount = this.testResults.filter(r => r.success).length;
    const totalCount = this.testResults.length;
    
    console.log('\n📊 测试报告:');
    console.log(`总测试数: ${totalCount}`);
    console.log(`成功: ${successCount}`);
    console.log(`失败: ${totalCount - successCount}`);
    console.log(`成功率: ${((successCount / totalCount) * 100).toFixed(2)}%`);
    
    // 输出失败的测试
    const failedTests = this.testResults.filter(r => !r.success);
    if (failedTests.length > 0) {
      console.log('\n❌ 失败的测试:');
      failedTests.forEach(test => {
        console.log(`- ${test.message}`, test.data);
      });
    }
    
    return {
      total: totalCount,
      success: successCount,
      failed: totalCount - successCount,
      successRate: (successCount / totalCount) * 100,
      results: this.testResults
    };
  }
}

// 导出测试类和便捷函数
export { AuthIntegrationTest };

// 便捷的测试运行函数
export async function runAuthTests() {
  const tester = new AuthIntegrationTest();
  return await tester.runAllTests();
}

// 在浏览器控制台中使用的全局函数
if (typeof window !== 'undefined') {
  (window as any).runAuthTests = runAuthTests;
  (window as any).AuthIntegrationTest = AuthIntegrationTest;
}

console.log('认证集成测试脚本已加载');
console.log('在浏览器控制台中运行 runAuthTests() 来开始测试');