-- 示例数据脚本
-- 在 Supabase SQL Editor 中执行此脚本（需要先有用户登录）

-- 注意：这些示例数据需要替换为实际的用户ID
-- 请先登录系统，然后从浏览器控制台获取当前用户ID

-- 示例 PoC 项目数据
INSERT INTO public.poc_projects (
  owner,
  name,
  description,
  status,
  tech_stack,
  tags,
  priority,
  start_date,
  end_date,
  progress,
  notes
) VALUES 
(
  '00000000-0000-0000-0000-000000000001', -- 替换为实际用户ID
  'VB.NET 现代化 Web API',
  '使用 VB.NET 和 ASP.NET Core 构建现代化的 RESTful API，支持 JWT 认证和 Swagger 文档',
  'progress',
  ARRAY['vb.net', 'asp.net-core', 'entity-framework', 'jwt'],
  ARRAY['api', 'web', 'modernization'],
  'P1',
  '2024-01-15',
  '2024-03-15',
  65,
  '已完成基础架构搭建，正在进行业务逻辑开发'
),
(
  '00000000-0000-0000-0000-000000000001', -- 替换为实际用户ID
  'AI 辅助代码生成器',
  '基于 GPT 模型的 VB.NET 代码生成工具，支持智能代码补全和重构建议',
  'new',
  ARRAY['vb.net', 'openai-api', 'winforms', 'nlp'],
  ARRAY['ai', 'code-generation', 'productivity'],
  'P0',
  '2024-02-01',
  '2024-05-01',
  0,
  '项目规划阶段，需要深入研究 OpenAI API 集成方案'
),
(
  '00000000-0000-0000-0000-000000000001', -- 替换为实际用户ID
  '数据库迁移工具',
  '自动化数据库版本管理和迁移工具，支持多种数据库类型',
  'complete',
  ARRAY['vb.net', 'sql-server', 'postgresql', 'migration'],
  ARRAY['database', 'automation', 'devops'],
  'P2',
  '2023-11-01',
  '2024-01-31',
  100,
  '项目已完成，已部署到生产环境，用户反馈良好'
),
(
  '00000000-0000-0000-0000-000000000001', -- 替换为实际用户ID
  '实时协作编辑器',
  '基于 WebSocket 的实时协作代码编辑器，支持多人同时编辑',
  'archived',
  ARRAY['vb.net', 'websocket', 'signalr', 'javascript'],
  ARRAY['collaboration', 'real-time', 'web'],
  'P3',
  '2023-08-01',
  '2023-10-31',
  30,
  '项目暂停，技术难度较大，需要重新评估技术方案'
);

-- 示例 ToDo 项目数据
INSERT INTO public.todo_projects (
  owner,
  name,
  description,
  template,
  start_date,
  weeks,
  idea
) VALUES 
(
  '00000000-0000-0000-0000-000000000001', -- 替换为实际用户ID
  'VB.NET 微服务架构重构',
  '将单体应用重构为微服务架构，提高系统可扩展性和维护性',
  'vibe_ra',
  '2024-02-01',
  8,
  '将现有的 VB.NET 单体应用拆分为多个微服务，使用 Docker 容器化部署'
),
(
  '00000000-0000-0000-0000-000000000001', -- 替换为实际用户ID
  '移动端数据同步应用',
  '开发跨平台移动应用，实现与现有 VB.NET 系统的数据同步',
  'app_ra',
  '2024-03-01',
  6,
  '使用 Flutter 开发移动应用，通过 REST API 与 VB.NET 后端同步数据'
);

-- 获取刚插入的项目ID
DO $$
DECLARE
  project1_id uuid;
  project2_id uuid;
BEGIN
  -- 获取第一个项目的ID
  SELECT id INTO project1_id FROM public.todo_projects 
  WHERE name = 'VB.NET 微服务架构重构' LIMIT 1;
  
  -- 获取第二个项目的ID
  SELECT id INTO project2_id FROM public.todo_projects 
  WHERE name = '移动端数据同步应用' LIMIT 1;

  -- 示例任务数据（项目1）
  INSERT INTO public.todo_tasks (
    project_id,
    owner,
    title,
    description,
    phase,
    priority,
    status,
    tags,
    estimated_hours,
    due_date,
    notes
  ) VALUES 
  (
    project1_id,
    '00000000-0000-0000-0000-000000000001', -- 替换为实际用户ID
    '需求分析和架构设计',
    '深入分析现有系统，设计微服务架构方案，确定服务边界和接口定义',
    'pre',
    'P0',
    'done',
    ARRAY['analysis', 'architecture', 'design'],
    16,
    '2024-02-07',
    '已完成系统分析，确定了5个核心微服务：用户服务、订单服务、产品服务、支付服务、通知服务'
  ),
  (
    project1_id,
    '00000000-0000-0000-0000-000000000001', -- 替换为实际用户ID
    '搭建基础架构',
    '搭建 Docker 环境，配置 CI/CD 流水线，建立开发、测试、生产环境',
    'pre',
    'P1',
    'doing',
    ARRAY['docker', 'cicd', 'infrastructure'],
    24,
    '2024-02-14',
    'Docker 环境已搭建完成，正在配置 GitHub Actions CI/CD 流水线'
  ),
  (
    project1_id,
    '00000000-0000-0000-0000-000000000001', -- 替换为实际用户ID
    '用户服务开发',
    '开发用户认证和授权微服务，包括用户注册、登录、权限管理功能',
    'dev',
    'P0',
    'open',
    ARRAY['authentication', 'authorization', 'user-service'],
    32,
    '2024-02-21',
    '计划使用 ASP.NET Core Identity 和 JWT 实现用户认证'
  ),
  (
    project1_id,
    '00000000-0000-0000-0000-000000000001', -- 替换为实际用户ID
    '订单服务开发',
    '开发订单管理微服务，包括订单创建、状态跟踪、历史记录功能',
    'dev',
    'P1',
    'open',
    ARRAY['order-management', 'business-logic'],
    40,
    '2024-02-28',
    '需要设计订单状态机，支持订单状态流转和事件驱动架构'
  ),
  (
    project1_id,
    '00000000-0000-0000-0000-000000000001', -- 替换为实际用户ID
    '集成测试',
    '编写端到端集成测试，验证微服务间的通信和数据一致性',
    'post',
    'P1',
    'open',
    ARRAY['testing', 'integration', 'e2e'],
    20,
    '2024-03-07',
    '使用 Postman 和 Newman 进行 API 测试，使用 TestContainers 进行集成测试'
  ),
  (
    project1_id,
    '00000000-0000-0000-0000-000000000001', -- 替换为实际用户ID
    '性能优化和监控',
    '优化微服务性能，配置监控和日志系统，设置告警机制',
    'post',
    'P2',
    'open',
    ARRAY['performance', 'monitoring', 'logging'],
    16,
    '2024-03-14',
    '计划使用 Prometheus + Grafana 进行监控，使用 ELK Stack 进行日志管理'
  );

  -- 示例任务数据（项目2）
  INSERT INTO public.todo_tasks (
    project_id,
    owner,
    title,
    description,
    phase,
    priority,
    status,
    tags,
    estimated_hours,
    due_date,
    notes
  ) VALUES 
  (
    project2_id,
    '00000000-0000-0000-0000-000000000001', -- 替换为实际用户ID
    'Flutter 环境搭建',
    '搭建 Flutter 开发环境，配置 Android Studio 和 VS Code',
    'pre',
    'P1',
    'done',
    ARRAY['flutter', 'setup', 'environment'],
    8,
    '2024-03-05',
    'Flutter SDK 已安装，Android Studio 和 VS Code 插件已配置完成'
  ),
  (
    project2_id,
    '00000000-0000-0000-0000-000000000001', -- 替换为实际用户ID
    'UI/UX 设计',
    '设计移动应用的用户界面和用户体验，创建原型和设计规范',
    'pre',
    'P0',
    'doing',
    ARRAY['ui', 'ux', 'design', 'prototype'],
    20,
    '2024-03-12',
    '正在使用 Figma 设计应用界面，重点关注用户体验和易用性'
  ),
  (
    project2_id,
    '00000000-0000-0000-0000-000000000001', -- 替换为实际用户ID
    'API 接口开发',
    '开发移动应用需要的 REST API 接口，确保与现有系统兼容',
    'dev',
    'P0',
    'open',
    ARRAY['api', 'rest', 'backend'],
    24,
    '2024-03-19',
    '需要扩展现有 VB.NET API，添加移动端专用的接口和认证机制'
  ),
  (
    project2_id,
    '00000000-0000-0000-0000-000000000001', -- 替换为实际用户ID
    '移动应用开发',
    '使用 Flutter 开发移动应用，实现数据同步和离线功能',
    'dev',
    'P0',
    'open',
    ARRAY['flutter', 'mobile', 'sync', 'offline'],
    48,
    '2024-04-02',
    '计划使用 Provider 进行状态管理，使用 SQLite 实现本地数据存储'
  ),
  (
    project2_id,
    '00000000-0000-0000-0000-000000000001', -- 替换为实际用户ID
    '测试和发布',
    '进行功能测试、性能测试，准备应用商店发布',
    'post',
    'P1',
    'open',
    ARRAY['testing', 'release', 'app-store'],
    16,
    '2024-04-09',
    '需要准备应用商店所需的截图、描述和隐私政策文档'
  );

END $$;

-- 验证数据插入
SELECT 'PoC Projects' as table_name, count(*) as count FROM public.poc_projects
UNION ALL
SELECT 'Todo Projects' as table_name, count(*) as count FROM public.todo_projects
UNION ALL
SELECT 'Todo Tasks' as table_name, count(*) as count FROM public.todo_tasks;
