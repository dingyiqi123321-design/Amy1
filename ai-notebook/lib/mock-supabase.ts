// 模拟Supabase服务 - 用于演示和测试
// 在没有真实Supabase项目时提供基本的认证和数据存储功能

interface MockUser {
  id: string;
  email: string;
  user_metadata: {
    display_name?: string;
    avatar_url?: string;
  };
  created_at: string;
}

interface MockSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: number;
  user: MockUser;
}

interface MockAuthResponse {
  data: {
    user: MockUser | null;
    session: MockSession | null;
  };
  error: any;
}

class MockSupabaseAuth {
  private currentUser: MockUser | null = null;
  private currentSession: MockSession | null = null;
  private users: Map<string, { user: MockUser; password: string }> = new Map();
  private listeners: ((event: string, session: MockSession | null) => void)[] = [];

  constructor() {
    // 从localStorage恢复会话
    this.restoreSession();
  }

  private restoreSession() {
    try {
      const savedSession = localStorage.getItem('mock_supabase_session');
      if (savedSession) {
        const session = JSON.parse(savedSession);
        if (session.expires_at > Date.now()) {
          this.currentSession = session;
          this.currentUser = session.user;
        } else {
          localStorage.removeItem('mock_supabase_session');
        }
      }
    } catch (error) {
      console.warn('Failed to restore session:', error);
    }
  }

  private saveSession() {
    if (this.currentSession) {
      localStorage.setItem('mock_supabase_session', JSON.stringify(this.currentSession));
    } else {
      localStorage.removeItem('mock_supabase_session');
    }
  }

  private generateId(): string {
    return 'mock_' + Math.random().toString(36).substr(2, 9);
  }

  private createSession(user: MockUser): MockSession {
    const now = Date.now();
    return {
      access_token: 'mock_access_token_' + this.generateId(),
      refresh_token: 'mock_refresh_token_' + this.generateId(),
      expires_in: 3600,
      expires_at: now + 3600 * 1000,
      user
    };
  }

  async signUp(email: string, password: string, options?: { data?: any }): Promise<MockAuthResponse> {
    try {
      // 检查用户是否已存在
      if (this.users.has(email)) {
        return {
          data: { user: null, session: null },
          error: { message: '用户已存在' }
        };
      }

      // 创建新用户
      const user: MockUser = {
        id: this.generateId(),
        email,
        user_metadata: {
          display_name: options?.data?.display_name || email.split('@')[0],
          avatar_url: options?.data?.avatar_url
        },
        created_at: new Date().toISOString()
      };

      // 保存用户
      this.users.set(email, { user, password });

      // 创建会话
      const session = this.createSession(user);
      this.currentUser = user;
      this.currentSession = session;
      this.saveSession();

      // 通知监听器
      this.listeners.forEach(listener => listener('SIGNED_IN', session));

      return {
        data: { user, session },
        error: null
      };
    } catch (error) {
      return {
        data: { user: null, session: null },
        error: { message: '注册失败' }
      };
    }
  }

  async signInWithPassword(email: string, password: string): Promise<MockAuthResponse> {
    try {
      const userData = this.users.get(email);
      if (!userData || userData.password !== password) {
        return {
          data: { user: null, session: null },
          error: { message: '邮箱或密码错误' }
        };
      }

      // 创建会话
      const session = this.createSession(userData.user);
      this.currentUser = userData.user;
      this.currentSession = session;
      this.saveSession();

      // 通知监听器
      this.listeners.forEach(listener => listener('SIGNED_IN', session));

      return {
        data: { user: userData.user, session },
        error: null
      };
    } catch (error) {
      return {
        data: { user: null, session: null },
        error: { message: '登录失败' }
      };
    }
  }

  async signOut(): Promise<{ error: any }> {
    try {
      this.currentUser = null;
      this.currentSession = null;
      this.saveSession();

      // 通知监听器
      this.listeners.forEach(listener => listener('SIGNED_OUT', null));

      return { error: null };
    } catch (error) {
      return { error: { message: '登出失败' } };
    }
  }

  async getUser(): Promise<{ data: { user: MockUser | null }; error: any }> {
    return {
      data: { user: this.currentUser },
      error: null
    };
  }

  async getSession(): Promise<{ data: { session: MockSession | null }; error: any }> {
    return {
      data: { session: this.currentSession },
      error: null
    };
  }

  onAuthStateChange(callback: (event: string, session: MockSession | null) => void) {
    this.listeners.push(callback);
    
    // 立即触发当前状态
    if (this.currentSession) {
      callback('SIGNED_IN', this.currentSession);
    } else {
      callback('SIGNED_OUT', null);
    }

    // 返回取消订阅函数
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            const index = this.listeners.indexOf(callback);
            if (index > -1) {
              this.listeners.splice(index, 1);
            }
          }
        }
      }
    };
  }

  async resetPasswordForEmail(email: string): Promise<{ error: any }> {
    // 模拟重置密码
    console.log('模拟发送重置密码邮件到:', email);
    return { error: null };
  }

  async updateUser(updates: any): Promise<MockAuthResponse> {
    if (!this.currentUser) {
      return {
        data: { user: null, session: null },
        error: { message: '用户未登录' }
      };
    }

    // 更新用户信息
    this.currentUser = {
      ...this.currentUser,
      user_metadata: {
        ...this.currentUser.user_metadata,
        ...updates.data
      }
    };

    // 更新存储的用户数据
    const userData = this.users.get(this.currentUser.email);
    if (userData) {
      userData.user = this.currentUser;
      this.users.set(this.currentUser.email, userData);
    }

    // 更新会话
    if (this.currentSession) {
      this.currentSession.user = this.currentUser;
      this.saveSession();
    }

    return {
      data: { user: this.currentUser, session: this.currentSession },
      error: null
    };
  }
}

class MockSupabaseClient {
  auth: MockSupabaseAuth;
  private data: Map<string, any[]> = new Map();

  constructor() {
    this.auth = new MockSupabaseAuth();
    
    // 初始化表
    this.data.set('notes', []);
    this.data.set('projects', []);
    this.data.set('project_tasks', []);
    this.data.set('todo_lists', []);
    this.data.set('daily_reports', []);
    this.data.set('weekly_reports', []);
  }

  from(table: string) {
    return new MockSupabaseTable(table, this.data, this.auth);
  }
}

class MockSupabaseTable {
  constructor(
    private table: string,
    private data: Map<string, any[]>,
    private auth: MockSupabaseAuth
  ) {}

  private getCurrentUserId(): string | null {
    return this.auth['currentUser']?.id || null;
  }

  private getTableData(): any[] {
    return this.data.get(this.table) || [];
  }

  private setTableData(data: any[]): void {
    this.data.set(this.table, data);
  }

  async select(columns?: string): Promise<{ data: any[]; error: any }> {
    try {
      const userId = this.getCurrentUserId();
      if (!userId) {
        return { data: [], error: { message: '用户未登录' } };
      }

      const tableData = this.getTableData();
      const userdata = tableData.filter(item => item.user_id === userId);
      
      return { data: userdata, error: null };
    } catch (error) {
      return { data: [], error };
    }
  }

  eq(column: string, value: any) {
    return {
      select: async (columns?: string) => {
        try {
          const userId = this.getCurrentUserId();
          if (!userId) {
            return { data: [], error: { message: '用户未登录' } };
          }

          const tableData = this.getTableData();
          const filtered = tableData.filter(item => 
            item.user_id === userId && item[column] === value
          );
          
          return { data: filtered, error: null };
        } catch (error) {
          return { data: [], error };
        }
      },
      delete: async () => {
        try {
          const userId = this.getCurrentUserId();
          if (!userId) {
            return { error: { message: '用户未登录' } };
          }

          const tableData = this.getTableData();
          const filteredData = tableData.filter(item => 
            !(item.user_id === userId && item[column] === value)
          );
          
          this.setTableData(filteredData);
          return { error: null };
        } catch (error) {
          return { error };
        }
      }
    };
  }

  async insert(data: any): Promise<{ data: any[]; error: any }> {
    try {
      const userId = this.getCurrentUserId();
      if (!userId) {
        return { data: [], error: { message: '用户未登录' } };
      }

      const newItem = {
        ...data,
        id: 'mock_' + Math.random().toString(36).substr(2, 9),
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const tableData = this.getTableData();
      tableData.push(newItem);
      this.setTableData(tableData);

      return { data: [newItem], error: null };
    } catch (error) {
      return { data: [], error };
    }
  }

  async update(updates: any): Promise<{ data: any[]; error: any }> {
    try {
      const userId = this.getCurrentUserId();
      if (!userId) {
        return { data: [], error: { message: '用户未登录' } };
      }

      const tableData = this.getTableData();
      const updatedData = tableData.map(item => {
        if (item.user_id === userId && item.id === updates.id) {
          return {
            ...item,
            ...updates,
            updated_at: new Date().toISOString()
          };
        }
        return item;
      });

      this.setTableData(updatedData);
      const updatedItem = updatedData.find(item => item.id === updates.id);

      return { data: updatedItem ? [updatedItem] : [], error: null };
    } catch (error) {
      return { data: [], error };
    }
  }

  async delete(): Promise<{ error: any }> {
    try {
      const userId = this.getCurrentUserId();
      if (!userId) {
        return { error: { message: '用户未登录' } };
      }

      // 这个方法需要配合 eq 使用
      return { error: null };
    } catch (error) {
      return { error };
    }
  }
}

// 创建模拟客户端实例
export const mockSupabase = new MockSupabaseClient();

// 导出类型
export type { MockUser, MockSession, MockAuthResponse };