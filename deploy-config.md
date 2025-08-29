# VB Assistant 部署配置指南

## 1. Supabase 项目设置

### 1.1 创建 Supabase 项目
1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 点击 "New Project"
3. 填写项目信息：
   - 项目名称：`vb-assistant`
   - 数据库密码：设置一个强密码
   - 地区：选择离你最近的地区
4. 等待项目创建完成

### 1.2 获取项目配置
在项目仪表板中，进入 Settings → API，记录以下信息：
- **Project URL**: `https://your-project-ref.supabase.co`
- **anon public key**: `your-anon-key-here`
- **service_role key**: `your-service-role-key-here` (仅用于MCP)

### 1.3 配置认证
1. 进入 Authentication → Settings
2. 配置 Site URL: `https://your-github-username.github.io/VB_Assistant/`
3. 配置 Redirect URLs: `https://your-github-username.github.io/VB_Assistant/`
4. 启用 Email 认证
5. 可选：配置 Google/GitHub OAuth

### 1.4 创建存储桶
1. 进入 Storage
2. 创建新桶：`vb-assistant`
3. 设置为公开访问
4. 配置 RLS 策略（见数据库设置）

## 2. 数据库设置

### 2.1 执行数据库脚本
1. 进入 SQL Editor
2. 复制 `database-schema.sql` 的内容
3. 执行脚本创建表和RLS策略

### 2.2 验证表结构
执行以下查询验证表是否创建成功：
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'poc_projects', 'todo_projects', 'todo_tasks', 'file_uploads');
```

## 3. 前端配置

### 3.1 更新 Supabase 配置
编辑 `supabase-config.js`，替换为你的实际配置：
```javascript
const SUPABASE_CONFIG = {
  url: 'https://your-project-ref.supabase.co',
  anonKey: 'your-anon-key-here'
};
```

### 3.2 测试配置
1. 本地运行项目：`python -m http.server 8000`
2. 访问 `http://localhost:8000`
3. 测试登录功能

## 4. GitHub Pages 部署

### 4.1 推送代码到 GitHub
```bash
git add .
git commit -m "feat: 集成 Supabase 后端服务"
git push origin main
```

### 4.2 配置 GitHub Pages
1. 进入 GitHub 仓库设置
2. 找到 Pages 设置
3. Source 选择 "Deploy from a branch"
4. Branch 选择 "main"
5. 保存设置

### 4.3 更新 Supabase 重定向 URL
部署完成后，更新 Supabase 的 Site URL 和 Redirect URLs 为实际的 GitHub Pages URL。

## 5. MCP 配置（开发期使用）

### 5.1 安装 Supabase MCP
```bash
npm install -g supabase-mcp-server
```

### 5.2 配置 MCP
在 Cursor 的 MCP 配置中添加：
```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "supabase-mcp-server@latest"],
      "env": {
        "SUPABASE_URL": "https://your-project-ref.supabase.co",
        "SUPABASE_ANON_KEY": "your-anon-key-here",
        "SUPABASE_SERVICE_ROLE_KEY": "your-service-role-key-here"
      }
    }
  }
}
```

## 6. 验证部署

### 6.1 功能测试清单
- [ ] 用户注册/登录
- [ ] PoC 项目创建、编辑、删除
- [ ] ToDo 项目创建、编辑、删除
- [ ] 任务管理
- [ ] 数据导出
- [ ] 文件上传

### 6.2 安全检查
- [ ] RLS 策略生效
- [ ] 用户只能访问自己的数据
- [ ] 未登录用户无法访问数据
- [ ] 文件上传权限正确

## 7. 故障排除

### 7.1 常见问题
1. **CORS 错误**: 检查 Supabase 的 Site URL 配置
2. **认证失败**: 验证 anon key 和项目 URL
3. **RLS 拒绝访问**: 检查用户是否已登录
4. **文件上传失败**: 检查存储桶权限和 RLS 策略

### 7.2 调试工具
- Supabase Dashboard → Logs
- 浏览器开发者工具 → Network
- Supabase MCP 查询工具

## 8. 生产环境优化

### 8.1 性能优化
- 启用 Supabase 缓存
- 配置 CDN
- 优化查询性能

### 8.2 监控
- 设置 Supabase 监控
- 配置错误报警
- 监控用户活动

### 8.3 备份
- 定期备份数据库
- 配置自动备份
- 测试恢复流程
