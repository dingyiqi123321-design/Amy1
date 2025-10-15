-- AI笔记本项目 Supabase 数据库建表SQL
-- 请在Supabase控制台的SQL编辑器中执行以下SQL语句

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. 笔记表 (notes)
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    summary TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 项目表 (projects)
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 项目任务表 (project_tasks)
CREATE TABLE IF NOT EXISTS project_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES project_tasks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    due_date TIMESTAMP WITH TIME ZONE,
    priority TEXT CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
    assignee TEXT DEFAULT '',
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 待办事项列表表 (todo_lists)
CREATE TABLE IF NOT EXISTS todo_lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT '待办事项',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 待办事项表 (todo_items)
CREATE TABLE IF NOT EXISTS todo_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    todo_list_id UUID NOT NULL REFERENCES todo_lists(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 日报表 (daily_reports)
CREATE TABLE IF NOT EXISTS daily_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    tasks TEXT[] DEFAULT '{}',
    progress TEXT DEFAULT '',
    issues TEXT DEFAULT '',
    plans TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, date)
);

-- 7. 周报表 (weekly_reports)
CREATE TABLE IF NOT EXISTS weekly_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    week_start DATE NOT NULL,
    week_end DATE NOT NULL,
    summary TEXT DEFAULT '',
    achievements TEXT[] DEFAULT '{}',
    challenges TEXT[] DEFAULT '{}',
    next_week_plans TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, week_start)
);

-- 8. 报告模板表 (report_templates)
CREATE TABLE IF NOT EXISTS report_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('daily', 'weekly')) NOT NULL,
    content TEXT NOT NULL,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_title ON notes USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_notes_content ON notes USING gin(to_tsvector('english', content));

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_name ON projects(name);

CREATE INDEX IF NOT EXISTS idx_project_tasks_project_id ON project_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_project_tasks_parent_id ON project_tasks(parent_id);
CREATE INDEX IF NOT EXISTS idx_project_tasks_due_date ON project_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_project_tasks_priority ON project_tasks(priority);
CREATE INDEX IF NOT EXISTS idx_project_tasks_completed ON project_tasks(is_completed);

CREATE INDEX IF NOT EXISTS idx_todo_lists_user_id ON todo_lists(user_id);
CREATE INDEX IF NOT EXISTS idx_todo_lists_created_at ON todo_lists(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_todo_items_list_id ON todo_items(todo_list_id);
CREATE INDEX IF NOT EXISTS idx_todo_items_completed ON todo_items(completed);

CREATE INDEX IF NOT EXISTS idx_daily_reports_project_date ON daily_reports(project_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_reports_date ON daily_reports(date DESC);

CREATE INDEX IF NOT EXISTS idx_weekly_reports_project_week ON weekly_reports(project_id, week_start DESC);
CREATE INDEX IF NOT EXISTS idx_weekly_reports_week_start ON weekly_reports(week_start DESC);

CREATE INDEX IF NOT EXISTS idx_report_templates_project_type ON report_templates(project_id, type);

-- 创建更新时间自动更新的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为所有表添加更新时间触发器
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_tasks_updated_at BEFORE UPDATE ON project_tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_todo_lists_updated_at BEFORE UPDATE ON todo_lists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_todo_items_updated_at BEFORE UPDATE ON todo_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_reports_updated_at BEFORE UPDATE ON daily_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weekly_reports_updated_at BEFORE UPDATE ON weekly_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_report_templates_updated_at BEFORE UPDATE ON report_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 启用行级安全策略 (RLS)
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE todo_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE todo_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_templates ENABLE ROW LEVEL SECURITY;

-- 创建基于用户的RLS策略，实现数据隔离
-- 用户只能访问自己的数据

-- 笔记表策略
CREATE POLICY "Users can only access their own notes" ON notes FOR ALL USING (auth.uid() = user_id);

-- 项目表策略
CREATE POLICY "Users can only access their own projects" ON projects FOR ALL USING (auth.uid() = user_id);

-- 项目任务表策略 - 通过项目关联检查用户权限
CREATE POLICY "Users can only access tasks from their own projects" ON project_tasks FOR ALL 
USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = project_tasks.project_id AND projects.user_id = auth.uid()));

-- 待办事项列表策略
CREATE POLICY "Users can only access their own todo lists" ON todo_lists FOR ALL USING (auth.uid() = user_id);

-- 待办事项策略 - 通过待办列表关联检查用户权限
CREATE POLICY "Users can only access items from their own todo lists" ON todo_items FOR ALL 
USING (EXISTS (SELECT 1 FROM todo_lists WHERE todo_lists.id = todo_items.todo_list_id AND todo_lists.user_id = auth.uid()));

-- 日报策略 - 通过项目关联检查用户权限
CREATE POLICY "Users can only access reports from their own projects" ON daily_reports FOR ALL 
USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = daily_reports.project_id AND projects.user_id = auth.uid()));

-- 周报策略 - 通过项目关联检查用户权限
CREATE POLICY "Users can only access weekly reports from their own projects" ON weekly_reports FOR ALL 
USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = weekly_reports.project_id AND projects.user_id = auth.uid()));

-- 报告模板策略 - 通过项目关联检查用户权限
CREATE POLICY "Users can only access templates from their own projects" ON report_templates FOR ALL 
USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = report_templates.project_id AND projects.user_id = auth.uid()));

-- 插入一些示例数据（可选）
INSERT INTO projects (name) VALUES 
    ('AI笔记本项目'),
    ('个人学习计划'),
    ('工作任务管理')
ON CONFLICT DO NOTHING;

INSERT INTO todo_lists (title) VALUES 
    ('日常待办'),
    ('学习计划'),
    ('工作任务')
ON CONFLICT DO NOTHING;

-- 完成建表脚本
-- 请在Supabase控制台中执行以上SQL语句来创建所有必要的表和索引