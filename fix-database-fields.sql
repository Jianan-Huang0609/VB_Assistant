-- 修复数据库字段不匹配问题
-- 在 Supabase SQL Editor 中执行此脚本

-- 1. 为 poc_projects 表添加 last_updated 字段（如果不存在）
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'poc_projects' AND column_name = 'last_updated') THEN
        ALTER TABLE public.poc_projects ADD COLUMN last_updated timestamptz DEFAULT now();
    END IF;
END $$;

-- 2. 为 todo_projects 表添加 last_updated 字段（如果不存在）
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'todo_projects' AND column_name = 'last_updated') THEN
        ALTER TABLE public.todo_projects ADD COLUMN last_updated timestamptz DEFAULT now();
    END IF;
END $$;

-- 3. 为 todo_tasks 表添加 last_updated 字段（如果不存在）
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'todo_tasks' AND column_name = 'last_updated') THEN
        ALTER TABLE public.todo_tasks ADD COLUMN last_updated timestamptz DEFAULT now();
    END IF;
END $$;

-- 4. 创建触发器函数来更新 last_updated 字段
CREATE OR REPLACE FUNCTION update_last_updated_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. 为 poc_projects 表添加触发器
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_poc_projects_last_updated') THEN
        CREATE TRIGGER update_poc_projects_last_updated 
            BEFORE UPDATE ON public.poc_projects 
            FOR EACH ROW EXECUTE FUNCTION update_last_updated_column();
    END IF;
END $$;

-- 6. 为 todo_projects 表添加触发器
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_todo_projects_last_updated') THEN
        CREATE TRIGGER update_todo_projects_last_updated 
            BEFORE UPDATE ON public.todo_projects 
            FOR EACH ROW EXECUTE FUNCTION update_last_updated_column();
    END IF;
END $$;

-- 7. 为 todo_tasks 表添加触发器
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_todo_tasks_last_updated') THEN
        CREATE TRIGGER update_todo_tasks_last_updated 
            BEFORE UPDATE ON public.todo_tasks 
            FOR EACH ROW EXECUTE FUNCTION update_last_updated_column();
    END IF;
END $$;

-- 8. 创建索引
CREATE INDEX IF NOT EXISTS idx_poc_projects_last_updated ON public.poc_projects(last_updated);
CREATE INDEX IF NOT EXISTS idx_todo_projects_last_updated ON public.todo_projects(last_updated);
CREATE INDEX IF NOT EXISTS idx_todo_tasks_last_updated ON public.todo_tasks(last_updated);
