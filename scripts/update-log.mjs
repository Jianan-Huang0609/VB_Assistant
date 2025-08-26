#!/usr/bin/env node

/**
 * VB Assistant Hub - 更新日志自动化脚本
 * 用于自动更新项目更新日志和版本信息
 */

import fs from 'fs';
import path from 'path';

const UPDATE_LOG_PATH = './update.md';
const GIT_UPDATE_PATH = './git_Update.md';

class UpdateLogger {
  constructor() {
    this.date = new Date().toISOString().split('T')[0];
    this.version = 'v1.1.2';
  }

  /**
   * 添加新的更新条目到update.md
   */
  addUpdateEntry(message, type = 'feat') {
    const entry = `${this.date} | ${this.version} | main | ${this.getShortHash()} | ${message} (@Jianan-Huang0609)`;
    
    try {
      const content = fs.readFileSync(UPDATE_LOG_PATH, 'utf8');
      const lines = content.split('\n');
      
      // 在文件开头插入新条目
      lines.splice(1, 0, entry);
      
      fs.writeFileSync(UPDATE_LOG_PATH, lines.join('\n'));
      console.log(`✅ 已添加更新条目: ${message}`);
    } catch (error) {
      console.error('❌ 更新日志写入失败:', error.message);
    }
  }

  /**
   * 更新git_Update.md文件
   */
  updateGitLog(version, changes) {
    const gitLogEntry = `## ${version} - ${this.date}
${changes.map(change => `* ${change}`).join('\n')}

`;

    try {
      const content = fs.readFileSync(GIT_UPDATE_PATH, 'utf8');
      const lines = content.split('\n');
      
      // 在第一个版本条目之前插入新条目
      const insertIndex = lines.findIndex(line => line.startsWith('## v'));
      if (insertIndex !== -1) {
        lines.splice(insertIndex, 0, gitLogEntry);
      } else {
        lines.splice(1, 0, gitLogEntry);
      }
      
      fs.writeFileSync(GIT_UPDATE_PATH, lines.join('\n'));
      console.log(`✅ 已更新Git更新日志: ${version}`);
    } catch (error) {
      console.error('❌ Git更新日志写入失败:', error.message);
    }
  }

  /**
   * 获取当前Git短哈希
   */
  getShortHash() {
    try {
      const { execSync } = require('child_process');
      return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
    } catch {
      return 'unknown';
    }
  }

  /**
   * 更新README.md中的版本信息
   */
  updateReadmeVersion(version) {
    try {
      const readmePath = './README.md';
      let content = fs.readFileSync(readmePath, 'utf8');
      
      // 更新版本历史部分
      content = content.replace(
        /- \*\*v\d+\.\d+\*\* \([\d-]+\) - .*/,
        `- **${version}** (${this.date}) - 当前版本`
      );
      
      fs.writeFileSync(readmePath, content);
      console.log(`✅ 已更新README版本信息: ${version}`);
    } catch (error) {
      console.error('❌ README更新失败:', error.message);
    }
  }
}

// 命令行接口
const logger = new UpdateLogger();

const command = process.argv[2];
const args = process.argv.slice(3);

switch (command) {
  case 'add':
    if (args.length > 0) {
      logger.addUpdateEntry(args.join(' '));
    } else {
      console.log('❌ 请提供更新消息');
    }
    break;
    
  case 'git':
    if (args.length >= 2) {
      const version = args[0];
      const changes = args.slice(1);
      logger.updateGitLog(version, changes);
    } else {
      console.log('❌ 请提供版本号和更新内容');
    }
    break;
    
  case 'readme':
    if (args.length > 0) {
      logger.updateReadmeVersion(args[0]);
    } else {
      console.log('❌ 请提供版本号');
    }
    break;
    
  default:
    console.log(`
VB Assistant Hub - 更新日志工具

用法:
  node scripts/update-log.mjs add <更新消息>
  node scripts/update-log.mjs git <版本号> <更新内容...>
  node scripts/update-log.mjs readme <版本号>

示例:
  node scripts/update-log.mjs add "修复侧边栏导航bug"
  node scripts/update-log.mjs git v1.1.3 "新增功能" "修复bug"
  node scripts/update-log.mjs readme v1.1.3
`);
    break;
}
