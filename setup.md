# VB Assistant 快速启动指南

## 🚀 5分钟快速部署

### 第一步：创建 Supabase 项目

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 点击 "New Project"
3. 填写项目信息：
   - 项目名称：`vb-assistant`
   - 数据库密码：设置一个强密码
   - 地区：选择离你最近的地区
4. 等待项目创建完成

### 第二步：获取配置信息

在项目仪表板中，进入 **Settings → API**，记录：
- **Project URL**: `https://your-project-ref.supabase.co`
- **anon public key**: `your-anon-key-here`

### 第三步：配置前端

编辑 `supabase-config.js`，替换配置：
```javascript
const SUPABASE_CONFIG = {
  url: 'https://your-project-ref.supabase.co',        // 你的 Project URL
  anonKey: 'your-anon-key-here'                       // 你的 anon key
};
```

### 第四步：设置数据库

1. 进入 **SQL Editor**
2. 复制 `database-schema.sql` 的全部内容
3. 点击 "Run" 执行脚本

### 第五步：测试本地运行

```bash
# 启动本地服务器
python -m http.server 8000

# 访问 http://localhost:8000
# 测试登录功能
```

### 第六步：部署到 GitHub Pages

```bash
# 提交代码
git add .
git commit -m "feat: 集成 Supabase 后端服务"
git push origin main

# 配置 GitHub Pages
# 1. 进入仓库设置
# 2. 找到 Pages 设置
# 3. Source 选择 "Deploy from a branch"
# 4. Branch 选择 "main"
# 5. 保存设置
```

### 第七步：更新 Supabase 重定向 URL

部署完成后，更新 Supabase 的认证设置：
1. 进入 **Authentication → Settings**
2. 更新 Site URL 为你的 GitHub Pages URL
3. 更新 Redirect URLs 为你的 GitHub Pages URL

## ✅ 验证部署

### 功能测试清单
- [ ] 用户注册/登录
- [ ] PoC 项目创建、编辑、删除
- [ ] ToDo 项目创建、编辑、删除
- [ ] 任务管理
- [ ] 数据导出
- [ ] 文件上传

### 安全检查
- [ ] RLS 策略生效
- [ ] 用户只能访问自己的数据
- [ ] 未登录用户无法访问数据

## 🛠️ 开发期 MCP 配置

### 安装 Supabase MCP
```bash
npm install -g supabase-mcp-server
```

### 配置 MCP
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

## 🔧 故障排除

### 常见问题

1. **CORS 错误**
   - 检查 Supabase 的 Site URL 配置
   - 确保重定向 URL 正确

2. **认证失败**
   - 验证 anon key 和项目 URL
   - 检查 Supabase 项目状态

3. **RLS 拒绝访问**
   - 确保用户已登录
   - 检查 RLS 策略配置

4. **文件上传失败**
   - 检查存储桶权限
   - 验证 RLS 策略

### 调试工具
- Supabase Dashboard → Logs
- 浏览器开发者工具 → Network
- Supabase MCP 查询工具

## 📞 获取帮助

- [Supabase 文档](https://supabase.com/docs)
- [项目 Issues](https://github.com/Jianan-Huang0609/VB_Assistant/issues)
- [GitHub 讨论](https://github.com/Jianan-Huang0609/VB_Assistant/discussions)

---

**恭喜！你的 VB Assistant 已经成功部署并集成了 Supabase 后端服务！** 🎉
