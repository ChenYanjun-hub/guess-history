# 猜历史人物 - 项目进度

**更新时间**: 2026-04-05

---

## 一、项目概述

**产品名称**: 猜历史人物

**类型**: 多人实时问答游戏

**核心玩法**: AI 随机生成中国古代历史人物，玩家通过提问逐步缩小范围，最终猜出人物名称。AI 只能回复：是 / 不是 / 不确定 / 无关 / 猜对了。

**设计风格**: 黑神话悟空风格，宣纸暖色调，对话气泡式交互。

---

## 二、已完成工作

### ✅ Phase 1: 基础搭建

| 任务 | 状态 | 说明 |
|------|------|------|
| 创建 Next.js 项目 | ✅ 完成 | TypeScript + Tailwind CSS + App Router |
| 安装依赖 | ✅ 完成 | openai, drizzle-orm, postgres |
| 目录结构 | ✅ 完成 | components, lib, types, styles |
| 自定义主题 | ✅ 完成 | 宣纸色系、墨色系、暖色点缀 |
| 类型定义 | ✅ 完成 | User, Game, Question, AnswerType 等 |
| 数据库 Schema | ✅ 完成 | users, games, questions, characters 表 |
| CCS API 封装 | ✅ 完成 | 延迟初始化，支持 OpenAI 兼容格式 |
| 游戏状态存储 | ✅ 完成 | 内存存储 + 订阅通知机制 |

### ✅ Phase 2: 核心功能

| 任务 | 状态 | 说明 |
|------|------|------|
| 用户身份 API | ✅ 完成 | POST /api/user |
| 游戏状态 API | ✅ 完成 | GET /api/game |
| 提问 API | ✅ 完成 | POST /api/game/ask（含竞态控制） |
| 新游戏 API | ✅ 完成 | POST /api/game/new |
| 历史记录 API | ✅ 完成 | GET /api/history |
| SSE 事件流 | ✅ 完成 | GET /api/events（实时推送） |

### ✅ Phase 3: UI 组件

| 组件 | 状态 | 说明 |
|------|------|------|
| EntryPopup | ✅ 完成 | 入场弹窗（emoji 选择 + 昵称输入） |
| MainContent | ✅ 完成 | 主页内容（统计 + 卡片 + 历史列表） |
| GameCard | ✅ 完成 | 中央猜谜卡片 |
| ChatBubble | ✅ 完成 | 对话气泡（用户问题 + AI 判定） |
| ChatTimeline | - | 整合到 qa/page.tsx |
| HistoryList | ✅ 完成 | 已猜出人物列表 |
| HistoryPopup | ✅ 完成 | 历史问答弹窗 |
| ResultPopup | ✅ 完成 | 猜对结果弹窗 |
| InputArea | - | 整合到 qa/page.tsx |
| 主页 (page.tsx) | ✅ 完成 | 入场检测 + 主内容展示 |
| 问答页 (qa/page.tsx) | ✅ 完成 | 时间线 + 输入区 + SSE 连接 |

### ✅ Phase 4: 构建验证

| 任务 | 状态 | 说明 |
|------|------|------|
| TypeScript 类型检查 | ✅ 通过 | 无类型错误 |
| Next.js 构建 | ✅ 通过 | 所有路由正常生成 |
| ESLint | ⚠️ 待检查 | 未运行 |

---

## 三、未完成工作

### 🔲 数据库配置

- [ ] 创建 Neon Postgres 数据库实例
- [ ] 运行数据库迁移脚本（创建表结构）
- [ ] 配置 DATABASE_URL 环境变量

### 🔲 CCS API 配置

- [ ] 获取 CCS API Key
- [ ] 配置 CCS_API_KEY 环境变量
- [ ] 配置 CCS_API_ENDPOINT（如需自定义端点）
- [ ] 配置 CCS_MODEL（模型名称）

### 🔲 功能完善

- [ ] 断线重连恢复逻辑优化
- [ ] AI 超时处理（当前无超时机制）
- [ ] 用户输入长度限制（前端 100 字）
- [ ] 历史人物重复检测优化

### 🔲 UI 打磨

- [ ] 动画效果优化（气泡出现、弹窗动画）
- [ ] 加载状态美化
- [ ] 移动端响应式适配测试
- [ ] 字体加载优化（使用 next/font）

### 🔲 测试与部署

- [ ] 编写单元测试
- [ ] 编写集成测试
- [ ] 本地功能测试（多窗口实时同步）
- [ ] 部署到 Vercel 预览环境
- [ ] 端到端测试
- [ ] 部署到生产环境

### 🔲 文档

- [ ] 编写 README.md
- [ ] 编写 API 文档
- [ ] 编写部署指南

---

## 四、技术决策记录

| 决策 | 选择 | 理由 |
|------|------|------|
| 框架 | Next.js 16 App Router | 前后端统一，Vercel 原生支持 |
| 数据库 | Neon Postgres | 免费额度，Vercel 集成 |
| ORM | Drizzle ORM | 类型安全，轻量级 |
| AI API | CCS API（OpenAI 兼容） | 用户自提供，成本可控 |
| 实时同步 | SSE | 比 WebSocket 简单，适合单向推送 |
| 状态管理 | 内存存储（单例） | 简单直接，适合单实例部署 |
| 样式 | Tailwind CSS + 自定义主题 | 快速开发，宣纸风格定制 |

---

## 五、文件清单

```
guess-history/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 根布局
│   │   ├── page.tsx                # 主页
│   │   ├── qa/page.tsx             # 问答页
│   │   └── api/
│   │       ├── user/route.ts       # 用户身份 API
│   │       ├── game/route.ts       # 游戏状态 API
│   │       ├── game/ask/route.ts   # 提问 API
│   │       ├── game/new/route.ts   # 新游戏 API
│   │       ├── events/route.ts     # SSE 事件流
│   │       └── history/route.ts    # 历史记录 API
│   ├── components/
│   │   ├── EntryPopup.tsx          # 入场弹窗
│   │   ├── MainContent.tsx         # 主页内容
│   │   ├── GameCard.tsx            # 猜谜卡片
│   │   ├── ChatBubble.tsx          # 对话气泡
│   │   ├── HistoryList.tsx         # 历史列表
│   │   ├── HistoryPopup.tsx        # 历史弹窗
│   │   └── ResultPopup.tsx         # 结果弹窗
│   ├── lib/
│   │   ├── schema.ts               # 数据库 Schema
│   │   ├── db.ts                   # 数据库操作
│   │   ├── ccs.ts                  # CCS API 封装
│   │   └── store.ts                # 游戏状态存储
│   ├── styles/
│   │   └── theme.css               # 宣纸风格主题
│   └── types/
│       └── index.ts                # 类型定义
├── .env.example                    # 环境变量模板
├── Progress.md                     # 本文件
└── package.json                    # 依赖配置
```

---

## 六、启动指南

### 本地开发

```bash
# 1. 进入项目目录
cd ~/Documents/projects/guess-history

# 2. 复制环境变量模板
cp .env.example .env.local

# 3. 编辑 .env.local，填入配置
# DATABASE_URL=postgresql://...
# CCS_API_KEY=your-key
# CCS_API_ENDPOINT=https://api.ccs.ai/v1

# 4. 启动开发服务器
npm run dev
```

### 数据库初始化

```sql
-- 在 Neon Postgres 中执行以下 SQL

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  emoji VARCHAR(4) NOT NULL,
  nickname VARCHAR(8) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE games (
  id SERIAL PRIMARY KEY,
  character_name VARCHAR(50) NOT NULL,
  character_desc TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  winner_id UUID REFERENCES users(id)
);

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  game_id INTEGER REFERENCES games(id),
  user_id UUID REFERENCES users(id),
  question_text TEXT NOT NULL,
  answer VARCHAR(10) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE characters (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 七、已知问题

1. **内存存储限制**: 当前使用内存存储游戏状态，多实例部署时状态不共享。生产环境需考虑使用 Redis 或数据库存储。

2. **SSE 连接稳定性**: 长时间连接可能断开，客户端有重连逻辑但未处理断线期间丢失的事件。

3. **字体加载**: 当前使用 Google Fonts 外链，应改用 next/font 优化。

4. **无测试覆盖**: 尚未编写任何测试代码。

---

## 八、下一步优先级

1. **高优先级**
   - 配置环境变量
   - 创建数据库表
   - 本地功能测试

2. **中优先级**
   - 字体加载优化
   - 动画效果完善
   - 错误处理完善

3. **低优先级**
   - 编写测试
   - 编写文档
   - 部署上线
