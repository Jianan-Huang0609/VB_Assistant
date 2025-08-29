# VB Assistant Hub

> 专业的VB.NET开发辅助平台，提升开发效率

> 最新版本: v1.2.0 | 链接🔗：https://jianan-huang0609.github.io/VB_Assistant/

## 项目简介

VB Assistant Hub 是一个专为VB.NET开发者设计的综合工具平台，集成项目管理、技术验证、代码生成和调试辅助等核心功能，旨在提升VB开发效率和代码质量。

## 核心模块

### 🚀 PoC-Tech_Path
- **功能**: 概念验证与技术路径探索平台
- **特点**: 专为VB和.NET开发提供技术选型、原型验证和可行性分析
- **文件**: `poc-tech-path.html`
- **状态**: ✅ 已完成

### 📋 Vibe Coding To-Do
- **功能**: 全周期VB项目管理工具
- **特点**: 支持多模板、智能调度和设计增强功能，专为VB开发优化
- **文件**: `vibe-todo.html`
- **状态**: ✅ 已完成

### 🛠️ VB Code Generator
- **功能**: 智能VB.NET代码生成器
- **特点**: 支持常用模式、组件生成和代码优化建议
- **状态**: 🚧 开发中

### 🔍 Debug Helper
- **功能**: VB.NET调试辅助工具
- **特点**: 提供错误诊断、性能分析和代码审查功能
- **状态**: 🚧 开发中

## 快速开始

```bash
# 直接打开主页面
open index.html

# 或使用本地服务器
python -m http.server 8000
# 然后访问 http://localhost:8000
```

## 项目结构

```
VB_Assistant/
├── index.html              # 主页面 - 工具集合入口
├── modules/                # 功能模块
│   ├── poctech.html       # PoC-Tech 模块
│   └── vb_todo.html       # VB-ToDo 模块
├── js/                    # JavaScript 文件
│   ├── supabase-api.js    # Supabase API 服务
│   └── auth-component.js  # 认证组件
├── assets/                # 静态资源
│   ├── app.js            # 主应用脚本
│   ├── theme.css         # 主题样式
│   └── sidebar.css       # 侧边栏样式
├── scripts/              # 工具脚本
│   └── update-log.mjs    # 更新日志工具
├── database-schema.sql   # 数据库结构
├── sample-data.sql       # 示例数据
├── deploy-config.md      # 部署配置指南
├── supabase-config.js    # Supabase 配置
├── README.md             # 项目说明
└── update.md             # 更新日志
```

## 技术特性

- ✅ **模块化设计**: 易于扩展和维护
- ✅ **响应式界面**: 支持移动端和桌面端
- ✅ **本地存储**: 无需服务器，数据本地保存
- ✅ **VB.NET优化**: 专为VB.NET开发者定制
- ✅ **现代化UI**: 使用Tailwind CSS构建美观界面

## 主要功能

### PoC-Tech_Path 模块
- 技术可行性验证管理
- 项目概念验证追踪
- 技术选型数据分析
- 原型开发进度管理

### Vibe Todo 模块
- VB.NET项目模板管理
- 智能开发进度调度
- 多格式导出（HTML、JSON、CSV、ICS）
- 任务状态可视化

## 使用场景

1. **技术调研**: 使用PoC-Tech_Path评估新技术可行性
2. **项目管理**: 使用Vibe Todo管理VB.NET项目全生命周期
3. **团队协作**: 导出数据分享给团队成员
4. **进度追踪**: 可视化项目和任务进展

## 数据存储

### 本地模式（当前）
- 所有数据存储在浏览器本地存储中
- 支持数据导出备份
- 无需网络连接，完全离线使用

### 云端模式（新增）
- **Supabase 后端服务** - 数据云端同步
- **用户认证系统** - 安全的用户管理
- **实时数据同步** - 多设备数据同步
- **文件存储** - 支持文件上传和管理
- **行级安全策略** - 确保数据安全

## 🚀 新功能特性

### 🔐 用户认证
- 邮箱魔法链接登录
- Google/GitHub OAuth 登录
- 用户资料管理
- 安全的行级权限控制

### 💾 数据持久化
- Supabase PostgreSQL 数据库
- 实时数据同步
- 文件上传和存储
- 数据备份和恢复

### 🛠️ 开发工具集成
- Supabase MCP 支持
- 数据库管理工具
- 开发期数据操作

## 浏览器兼容性

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## 开发计划

### v1.1 (当前版本)
- [x] 主页面融合设计
- [x] PoC-Tech_Path工具
- [x] Vibe Todo工具集成
- [x] 响应式设计优化

### v1.2 (计划中)
- [x] Supabase 后端集成
- [x] 用户认证系统
- [x] 数据云端同步
- [ ] VB Code Generator工具
- [ ] Debug Helper工具

### v1.3 (远期规划)
- [ ] 插件系统
- [ ] 团队协作功能
- [ ] AI辅助功能
- [ ] 移动端应用

## 🔧 部署指南

详细的部署配置请参考 [deploy-config.md](./deploy-config.md)

### 快速部署步骤
1. 创建 Supabase 项目
2. 执行数据库脚本
3. 更新配置文件
4. 推送代码到 GitHub
5. 配置 GitHub Pages

## 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 版本历史

- **v1.1.7** (2024-12-19) - 当前版本
- **v1.1.6** (2024-12-19) - 不跳转同页切换融合平台
- **v1.1.5** (2024-12-19) - 重新设计Fusion Hub
- **v1.1.4** (2024-12-19) - 重新设计Fusion Hub
- **v1.1.3** (2024-12-19) - 项目脚手架完善
- **v1.1.2** (2024-12-19) - Fusion Hub融合平台
- **v1.1** (2024-12-19) - 融合平台初始版本
- **v1.0** - 独立工具版本

## 许可证

© 2024 VB Assistant Hub - @Jianan-Huang0609

## 联系方式

- **GitHub**: [@Jianan-Huang0609](https://github.com/Jianan-Huang0609)
- **项目仓库**: [VB_Assistant](https://github.com/Jianan-Huang0609/VB_Assistant)

---

**让VB.NET开发更高效！** 🚀
