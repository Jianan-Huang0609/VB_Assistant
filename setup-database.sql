-- VB Assistant 数据库设置脚本
-- 在 Supabase SQL Editor 中执行此脚本

-- 1. 用户扩展资料表
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. PoC-Tech 项目表
create table if not exists public.poc_projects (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  status text default 'new' check (status in ('new', 'progress', 'complete', 'archived')),
  tech_stack text[],
  tags text[],
  priority text default 'P2' check (priority in ('P0', 'P1', 'P2', 'P3')),
  start_date date,
  end_date date,
  progress integer default 0 check (progress >= 0 and progress <= 100),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. VB-ToDo 项目表
create table if not exists public.todo_projects (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  template text default 'vibe_ra',
  start_date date,
  weeks integer default 4,
  idea text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. VB-ToDo 任务表
create table if not exists public.todo_tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.todo_projects(id) on delete cascade,
  owner uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  phase text check (phase in ('pre', 'dev', 'post')),
  priority text default 'P2' check (priority in ('P0', 'P1', 'P2', 'P3')),
  status text default 'open' check (status in ('open', 'doing', 'done')),
  tags text[],
  estimated_hours integer,
  actual_hours integer,
  due_date date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. 文件存储记录表
create table if not exists public.file_uploads (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references auth.users(id) on delete cascade,
  project_id uuid,
  project_type text check (project_type in ('poc', 'todo')),
  file_name text not null,
  file_path text not null,
  file_size integer,
  mime_type text,
  created_at timestamptz default now()
);

-- 开启 RLS（行级安全）
alter table public.profiles enable row level security;
alter table public.poc_projects enable row level security;
alter table public.todo_projects enable row level security;
alter table public.todo_tasks enable row level security;
alter table public.file_uploads enable row level security;

-- 创建 RLS 策略
DO $$
BEGIN
    -- profiles 表策略
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'profiles self read/write') THEN
        create policy "profiles self read/write"
        on public.profiles
        for all
        using (auth.uid() = id)
        with check (auth.uid() = id);
    END IF;

    -- poc_projects 表策略
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'poc_projects' AND policyname = 'poc_projects owner read') THEN
        create policy "poc_projects owner read"
        on public.poc_projects
        for select
        using (auth.uid() = owner);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'poc_projects' AND policyname = 'poc_projects owner insert') THEN
        create policy "poc_projects owner insert"
        on public.poc_projects
        for insert
        with check (auth.uid() = owner);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'poc_projects' AND policyname = 'poc_projects owner update') THEN
        create policy "poc_projects owner update"
        on public.poc_projects
        for update
        using (auth.uid() = owner)
        with check (auth.uid() = owner);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'poc_projects' AND policyname = 'poc_projects owner delete') THEN
        create policy "poc_projects owner delete"
        on public.poc_projects
        for delete
        using (auth.uid() = owner);
    END IF;

    -- todo_projects 表策略
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'todo_projects' AND policyname = 'todo_projects owner read') THEN
        create policy "todo_projects owner read"
        on public.todo_projects
        for select
        using (auth.uid() = owner);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'todo_projects' AND policyname = 'todo_projects owner insert') THEN
        create policy "todo_projects owner insert"
        on public.todo_projects
        for insert
        with check (auth.uid() = owner);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'todo_projects' AND policyname = 'todo_projects owner update') THEN
        create policy "todo_projects owner update"
        on public.todo_projects
        for update
        using (auth.uid() = owner)
        with check (auth.uid() = owner);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'todo_projects' AND policyname = 'todo_projects owner delete') THEN
        create policy "todo_projects owner delete"
        on public.todo_projects
        for delete
        using (auth.uid() = owner);
    END IF;

    -- todo_tasks 表策略
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'todo_tasks' AND policyname = 'todo_tasks owner read') THEN
        create policy "todo_tasks owner read"
        on public.todo_tasks
        for select
        using (auth.uid() = owner);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'todo_tasks' AND policyname = 'todo_tasks owner insert') THEN
        create policy "todo_tasks owner insert"
        on public.todo_tasks
        for insert
        with check (auth.uid() = owner);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'todo_tasks' AND policyname = 'todo_tasks owner update') THEN
        create policy "todo_tasks owner update"
        on public.todo_tasks
        for update
        using (auth.uid() = owner)
        with check (auth.uid() = owner);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'todo_tasks' AND policyname = 'todo_tasks owner delete') THEN
        create policy "todo_tasks owner delete"
        on public.todo_tasks
        for delete
        using (auth.uid() = owner);
    END IF;

    -- file_uploads 表策略
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'file_uploads' AND policyname = 'file_uploads owner read') THEN
        create policy "file_uploads owner read"
        on public.file_uploads
        for select
        using (auth.uid() = owner);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'file_uploads' AND policyname = 'file_uploads owner insert') THEN
        create policy "file_uploads owner insert"
        on public.file_uploads
        for insert
        with check (auth.uid() = owner);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'file_uploads' AND policyname = 'file_uploads owner delete') THEN
        create policy "file_uploads owner delete"
        on public.file_uploads
        for delete
        using (auth.uid() = owner);
    END IF;

END $$;

-- 创建索引
create index if not exists idx_poc_projects_owner on public.poc_projects(owner);
create index if not exists idx_poc_projects_status on public.poc_projects(status);
create index if not exists idx_todo_projects_owner on public.todo_projects(owner);
create index if not exists idx_todo_tasks_project_id on public.todo_tasks(project_id);
create index if not exists idx_todo_tasks_owner on public.todo_tasks(owner);
create index if not exists idx_todo_tasks_status on public.todo_tasks(status);
create index if not exists idx_file_uploads_owner on public.file_uploads(owner);

-- 创建触发器函数
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 添加触发器
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at') THEN
        create trigger update_profiles_updated_at before update on public.profiles
          for each row execute function update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_poc_projects_updated_at') THEN
        create trigger update_poc_projects_updated_at before update on public.poc_projects
          for each row execute function update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_todo_projects_updated_at') THEN
        create trigger update_todo_projects_updated_at before update on public.todo_projects
          for each row execute function update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_todo_tasks_updated_at') THEN
        create trigger update_todo_tasks_updated_at before update on public.todo_tasks
          for each row execute function update_updated_at_column();
    END IF;
END $$;
