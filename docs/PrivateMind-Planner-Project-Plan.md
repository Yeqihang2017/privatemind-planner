# PrivateMind Planner - 本地隐私优先 AI 生活规划助理

## 项目概述

**项目名称**: PrivateMind Planner  
**赛道**: General Purpose（通用设备）  
**方向**: 本地 AI 个人助理 + 多代理工作流 + 日程/项目/旅游规划  
**技术栈**: Node.js + QVAC SDK + SQLite/WASM + 简单 Web UI  
**核心定位**: 一个完全在本地运行的 AI 生活规划助理，帮助用户把目标、日程、旅行想法、私人笔记和项目资料转化为可执行计划，并在执行过程中持续复盘和调整。所有数据和推理都在本地设备完成，绝不上传云端。

### 一句话介绍

> **PrivateMind Planner 是你的本地 AI 生活管家：它能读取你的私人笔记、目标和日程，帮你规划项目、安排每天、制定旅行路线，并在保证隐私的前提下持续复盘和优化计划。**

英文版：

> **PrivateMind Planner is a local AI life planner that turns your private notes, goals, trips, and schedules into actionable plans — without sending your data to the cloud.**

---

## 核心理念

传统 AI 助理通常需要用户把个人目标、日程、旅行偏好、学习计划、项目资料上传到云端，这对隐私敏感用户来说存在明显顾虑。PrivateMind Planner 的核心理念是：

1. **本地优先**：所有笔记、目标、行程、日程和推理都在本地设备上完成。
2. **规划优先**：不只是回答问题，而是帮助用户制定可执行计划。
3. **多代理协作**：由多个专业代理分别负责记忆、规划、排程、预算、风险检查和复盘。
4. **动态调整**：计划不是一次性生成，而是根据用户完成情况、时间变化和优先级自动调整。
5. **可视化输出**：将 AI 生成内容转成日历、时间线、任务清单、预算表和风险提醒卡片。

---

## 为什么选这个方向

1. **个人规划是真实高频需求**  
   学习、项目、旅行、日程安排都是用户日常会反复遇到的问题，比单纯文档问答更接近真实产品。

2. **隐私痛点更强**  
   日程、旅行、预算、目标、个人笔记都属于高度私人信息，本地运行的价值更明显。

3. **多代理更自然**  
   规划类任务本身就需要不同角色协作：规划师、排程师、预算官、风险官、复盘官等，能自然体现多代理架构。

4. **QVAC SDK 适配度高**  
   可使用 completion 生成计划，RAG 检索用户资料，embeddings 理解个人偏好，tool calling 调用不同规划工具和代理。

5. **演示效果更强**  
   可以展示“输入目标 → 读取私人资料 → 生成计划 → 转成日程 → 发现风险 → 自动调整”的完整闭环。

6. **实现难度可控**  
   第一版可以聚焦项目计划、日程规划、旅游计划三个场景，避免产品范围过大。

---

## 目标用户

- 需要安排学习、项目、比赛或工作计划的学生/开发者
- 想要制定旅行路线、预算和每日行程的用户
- 不想把私人日程、目标和笔记上传到云端的隐私敏感用户
- 想要一个可以持续复盘、自动调整计划的本地 AI 助理

---

## 核心使用场景

### 场景 1：项目规划

用户输入：

> 我 21 天后要提交一个 AI 项目，现在只有一个想法，帮我安排开发计划。

系统输出：

- 项目目标拆解
- 阶段计划
- 每日任务
- 关键路径
- 风险提醒
- 提交材料清单
- Demo 脚本建议

示例输出结构：

```json
{
  "goal": "21 天完成 AI 项目提交",
  "phases": [
    {
      "name": "MVP 搭建",
      "days": "Day 1-5",
      "tasks": ["完成 QVAC hello world", "实现基础 RAG", "搭建最小 Web UI"]
    },
    {
      "name": "多代理与规划能力",
      "days": "Day 6-14",
      "tasks": ["实现 Planner Agent", "实现 Scheduler Agent", "实现 Risk Agent"]
    },
    {
      "name": "打磨与提交",
      "days": "Day 15-21",
      "tasks": ["优化 UI", "录制演示视频", "编写 README"]
    }
  ]
}
```

---

### 场景 2：日程规划

用户输入：

> 我这周要完成项目 demo，还要上课、健身、准备考试，帮我排一下。

系统输出：

- 本周时间块安排
- 每日 Top 3 任务
- 任务优先级
- 时间冲突提醒
- 可延期任务
- 今日计划和晚间复盘问题

示例输出：

| 时间 | 安排 | 类型 | 优先级 |
|---|---|---|---|
| 09:00-10:30 | 完成 RAG 检索模块 | 项目 | 高 |
| 11:00-12:00 | 上课 | 日程 | 固定 |
| 14:00-15:30 | Web UI 初版 | 项目 | 高 |
| 18:00-19:00 | 健身 | 生活 | 中 |
| 20:00-20:30 | 今日复盘 | 复盘 | 中 |

---

### 场景 3：旅游计划

用户输入：

> 我想 10 月去大阪玩 3 天，预算 5 万日元，喜欢美食和拍照，帮我规划。

系统输出：

- 3 天旅行路线
- 每天上午/下午/晚上安排
- 预算拆分
- 交通时间估算
- 餐厅和景点偏好匹配
- 轻松版/省钱版/打卡版路线
- 风险提醒：天气、排队、交通、预算超支

示例输出结构：

```json
{
  "trip": "大阪三日游",
  "budget": "50000 JPY",
  "style": ["美食", "拍照", "轻松"],
  "days": [
    {
      "day": "Day 1",
      "morning": "大阪城公园",
      "afternoon": "心斋桥 / 道顿堀",
      "evening": "道顿堀美食街",
      "estimated_cost": 12000,
      "risk": "道顿堀晚餐时间排队较久，建议提前选择备选餐厅"
    }
  ]
}
```

---

### 场景 4：每日复盘与计划调整

用户输入：

> 昨天没做完 Web UI，今天只有 2 小时，帮我重新安排。

系统输出：

- 保留关键路径任务
- 延后低优先级任务
- 重新生成今日任务
- 提醒截止日期风险
- 给出最小可交付版本建议

示例：

```text
今日建议：
1. 先完成聊天界面输入和输出，不做复杂样式。
2. 代理调用可视化先用简单日志列表替代。
3. 文档管理功能可延后，只保留上传文本入口。
风险提醒：
如果今天 Web UI 仍未完成，后续演示视频和 README 时间会被压缩。
```

---

## 产品功能设计

### 1. 目标输入

用户可以输入自然语言目标，例如：

- “帮我规划 21 天完成 AI 项目”
- “帮我安排这周的学习和健身”
- “帮我制定 3 天东京旅行计划”
- “帮我把今天的任务重新排一下”

系统会识别目标类型，并进入对应工作流。

---

### 2. 本地资料导入

支持用户添加：

- 纯文本笔记
- `.txt` / `.md` 文档
- 项目计划
- 任务清单
- 旅行偏好
- 课程/考试信息
- 个人规则，例如“我不喜欢早起”“每天晚上适合学习”

导入后系统会：

1. 自动分块
2. 生成 embeddings
3. 存入本地 workspace
4. 供 Memory Agent 检索使用

---

### 3. 智能计划生成

系统根据用户目标和本地资料生成：

- 长期计划
- 阶段计划
- 每日任务
- 时间块日程
- 预算规划
- 风险提醒
- 复盘问题

---

### 4. 日程视图

前端提供简单日程展示：

- 今日计划
- 本周计划
- 项目时间线
- 旅行时间线
- 任务状态：待做 / 进行中 / 已完成 / 延期

---

### 5. 旅游规划视图

旅游计划以卡片形式展示：

- 每日路线
- 预计花费
- 交通建议
- 备选方案
- 注意事项
- 可切换风格：轻松版 / 省钱版 / 打卡版

---

### 6. 自适应复盘

用户每天可以输入完成情况：

- “完成了”
- “只完成一半”
- “没做完”
- “今天没时间”
- “我想换目标”

系统根据反馈自动调整：

- 今日计划
- 后续任务顺序
- 风险等级
- 截止日期压力
- 最小可交付版本

---

### 7. 隐私守卫

Privacy Agent 会检查：

- 是否包含手机号、地址、证件号、邮箱等敏感信息
- 是否包含预算、旅行日期、私人日程等隐私内容
- 导出计划时是否需要脱敏

支持一键生成：

- **完整本地版**
- **可分享脱敏版**

---

## 多代理架构设计

```text
用户输入目标 / 日程 / 旅行需求 / 复盘反馈
       ↓
┌─────────────────────────────────────────┐
│           🧠 Chief Agent                │
│  理解用户意图，判断是项目/日程/旅行/复盘 │
└─────────────────────────────────────────┘
       ↓
┌─────────────────────────────────────────┐
│           🗂 Memory Agent               │
│  从本地笔记、历史计划、偏好中检索背景信息 │
└─────────────────────────────────────────┘
       ↓
       ├────────────────┬────────────────┬────────────────┐
       ↓                ↓                ↓                ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 📋 Planner   │  │ 📆 Scheduler │  │ 💰 Budget    │  │ 🧭 Trip      │
│ Agent        │  │ Agent        │  │ Agent        │  │ Agent        │
│ 制定目标计划 │  │ 安排时间块   │  │ 估算预算     │  │ 规划旅行路线 │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
       ↓                ↓                ↓                ↓
┌─────────────────────────────────────────┐
│           ⚠️ Risk Agent                 │
│  检查计划过满、时间冲突、预算超支、遗漏项 │
└─────────────────────────────────────────┘
       ↓
┌─────────────────────────────────────────┐
│           🔁 Review Agent               │
│  根据用户反馈复盘进度，并调整后续计划     │
└─────────────────────────────────────────┘
       ↓
┌─────────────────────────────────────────┐
│           🛡 Privacy Agent              │
│  检查敏感信息，生成本地版/脱敏分享版      │
└─────────────────────────────────────────┘
       ↓
   返回可执行计划 / 日程 / 旅行路线
```

---

## 各代理职责

### 1. Chief Agent（总管家）

- 接收用户输入
- 判断任务类型：项目规划 / 日程规划 / 旅游计划 / 复盘调整
- 决定调用哪些专业代理
- 使用 QVAC completion + tool calling

### 2. Memory Agent（记忆官）

- 从本地文档中检索用户背景信息
- 查找用户偏好、历史计划、任务记录
- 使用 QVAC embeddings + RAG API

### 3. Planner Agent（规划师）

- 将大目标拆成阶段目标
- 生成任务清单和关键路径
- 输出项目/学习/生活计划
- 使用 QVAC completion

### 4. Scheduler Agent（排程师）

- 将任务安排到每日/每周时间块
- 检查时间冲突
- 生成今日 Top 3 任务
- 输出结构化日程 JSON

### 5. Trip Agent（旅行规划师）

- 根据目的地、天数、预算、偏好生成旅行路线
- 生成不同风格方案：轻松版、省钱版、打卡版
- 安排上午/下午/晚上活动
- 提醒交通、排队、天气等风险

### 6. Budget Agent（预算官）

- 估算旅行、项目或生活计划的成本
- 输出预算拆分
- 检查预算是否过紧
- 给出省钱建议

### 7. Risk Agent（风险官）

- 检查计划是否过满
- 检查时间冲突
- 检查预算超支
- 检查截止日期风险
- 提醒用户保留缓冲时间

### 8. Review Agent（复盘官）

- 根据用户完成情况调整计划
- 总结今日进度
- 生成明日建议
- 判断是否需要缩小 MVP 范围

### 9. Privacy Agent（隐私守卫）

- 检查敏感信息
- 提醒隐私风险
- 生成脱敏版计划
- 确保所有数据本地处理

---

## 技术实现方案

### 1. 项目结构

```text
privatemind-planner/
├── package.json
├── src/
│   ├── index.js
│   ├── agents/
│   │   ├── chief.js
│   │   ├── memory.js
│   │   ├── planner.js
│   │   ├── scheduler.js
│   │   ├── trip.js
│   │   ├── budget.js
│   │   ├── risk.js
│   │   ├── review.js
│   │   └── privacy.js
│   ├── services/
│   │   ├── model.js
│   │   ├── rag.js
│   │   ├── storage.js
│   │   ├── planner.js
│   │   └── calendar.js
│   ├── tools/
│   │   ├── index.js
│   │   ├── planTools.js
│   │   ├── scheduleTools.js
│   │   └── tripTools.js
│   └── web/
│       ├── server.js
│       └── public/
│           ├── index.html
│           ├── app.js
│           └── style.css
├── data/
│   ├── notes/
│   ├── plans/
│   ├── trips/
│   └── schedules/
└── README.md
```

---

### 2. 核心依赖

```json
{
  "dependencies": {
    "@qvac/sdk": "latest",
    "express": "^4.18.0",
    "@sqliteai/sqlite-wasm": "latest",
    "dayjs": "^1.11.0"
  }
}
```

---

### 3. 模型选择

- **LLM**: QWEN3_1_7B_INST_Q4  
  用于计划生成、代理推理、复盘和风险分析。
- **Embeddings**: GTE_LARGE_FP16  
  用于本地资料检索、偏好记忆和相似计划搜索。

---

### 4. 数据存储

本地存储以下数据：

- 用户笔记
- 用户目标
- 历史计划
- 每日任务
- 旅行计划
- 用户偏好
- 代理执行日志
- RAG workspace 数据

建议 SQLite 表结构：

```sql
CREATE TABLE goals (
  id TEXT PRIMARY KEY,
  title TEXT,
  type TEXT,
  deadline TEXT,
  priority TEXT,
  status TEXT,
  created_at TEXT
);

CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  goal_id TEXT,
  title TEXT,
  date TEXT,
  start_time TEXT,
  end_time TEXT,
  priority TEXT,
  status TEXT,
  notes TEXT
);

CREATE TABLE trips (
  id TEXT PRIMARY KEY,
  destination TEXT,
  start_date TEXT,
  end_date TEXT,
  budget INTEGER,
  style TEXT,
  plan_json TEXT
);

CREATE TABLE user_preferences (
  id TEXT PRIMARY KEY,
  key TEXT,
  value TEXT,
  source TEXT,
  updated_at TEXT
);
```

---

### 5. 核心功能实现

#### 5.1 文档/偏好导入

- 支持添加笔记和偏好
- 支持导入 `.txt` / `.md`
- 自动分块
- 生成 embeddings
- 存入本地 RAG workspace

#### 5.2 意图识别

Chief Agent 将用户输入分类为：

- `project_plan`
- `daily_schedule`
- `weekly_schedule`
- `trip_plan`
- `progress_review`
- `privacy_export`

#### 5.3 计划生成

Planner Agent 输出结构化 JSON：

```json
{
  "goal": "完成 AI 项目",
  "deadline": "2026-06-21",
  "phases": [],
  "tasks": [],
  "risks": [],
  "next_actions": []
}
```

#### 5.4 日程排布

Scheduler Agent 将任务转换成时间块：

```json
{
  "date": "2026-06-03",
  "blocks": [
    {
      "start": "09:00",
      "end": "10:30",
      "title": "实现基础 RAG 检索",
      "priority": "high",
      "type": "project"
    }
  ]
}
```

#### 5.5 旅游路线生成

Trip Agent 输出：

```json
{
  "destination": "大阪",
  "days": [
    {
      "day": 1,
      "morning": [],
      "afternoon": [],
      "evening": [],
      "estimated_cost": 0,
      "transport_notes": "",
      "risk_notes": ""
    }
  ],
  "alternatives": {
    "relaxed": {},
    "budget": {},
    "photo_spot": {}
  }
}
```

#### 5.6 风险检查

Risk Agent 检查：

- 每天任务是否过多
- 是否缺少缓冲时间
- 是否临近截止日期
- 旅行预算是否超支
- 旅行路线是否过度密集
- 是否存在时间冲突

#### 5.7 复盘调整

Review Agent 根据用户反馈调整计划：

输入：

```text
昨天 Web UI 没做完，今天只有 2 小时。
```

输出：

```json
{
  "updated_today_plan": [],
  "moved_tasks": [],
  "deadline_risk": "medium",
  "suggestion": "优先完成可演示闭环，推迟样式优化。"
}
```

#### 5.8 隐私与脱敏

Privacy Agent 支持：

- 敏感信息检测
- 本地隐私提示
- 脱敏版分享计划

---

## Web UI 设计

### 首页入口

首页提供 4 个主要入口：

1. **Plan My Day**：规划今天
2. **Plan My Project**：规划项目
3. **Plan My Trip**：规划旅行
4. **Review My Progress**：复盘进度

---

### 主要页面

#### 1. Chat + Agent Timeline

左侧聊天，右侧显示代理执行过程：

```text
Chief Agent：识别为 trip_plan
Memory Agent：找到用户偏好「喜欢美食和拍照」
Trip Agent：生成大阪 3 日路线
Budget Agent：估算总预算 48,000 JPY
Risk Agent：发现 Day 2 行程过满
Privacy Agent：未发现敏感信息
```

#### 2. Calendar View

展示每日时间块：

- 上午
- 下午
- 晚上
- 固定日程
- AI 推荐任务

#### 3. Plan Board

类似任务看板：

- To Do
- Doing
- Done
- Delayed

#### 4. Trip View

展示：

- 每日路线
- 预算
- 交通建议
- 风险提醒
- 备选方案

#### 5. Privacy Panel

展示：

- 数据存储位置
- 本地模型状态
- 敏感信息检测结果
- 脱敏导出按钮

---

## 演示流程设计

### Demo 1：项目规划

1. 用户导入 `project-plan.md`
2. 输入：“帮我把这个项目拆成 21 天开发计划”
3. 系统读取文档
4. Planner Agent 生成阶段计划
5. Scheduler Agent 生成每日任务
6. Risk Agent 提醒“UI 不要拖到最后”
7. 前端展示时间线和任务看板

### Demo 2：旅游计划

1. 用户输入：“我想 10 月去大阪玩 3 天，预算 5 万日元，喜欢美食和拍照”
2. Memory Agent 检索用户偏好
3. Trip Agent 生成 3 天路线
4. Budget Agent 估算费用
5. Risk Agent 提醒某一天路线过密
6. 前端展示旅行卡片

### Demo 3：动态复盘

1. 用户输入：“昨天没做完 Web UI，今天只有 2 小时”
2. Review Agent 分析进度
3. Scheduler Agent 重新安排任务
4. Risk Agent 更新截止日期风险
5. 系统输出新的今日计划

---

## 开发计划（21 天）

### 第一阶段：基础搭建（6 月 1 日 - 6 月 3 日）

- [ ] 初始化项目
- [ ] 安装 QVAC SDK
- [ ] 实现模型加载/卸载
- [ ] 测试基础 completion
- [ ] 测试 embeddings 和 RAG
- [ ] 搭建 Express Web 服务

### 第二阶段：核心规划能力（6 月 4 日 - 6 月 8 日）

- [ ] 实现目标输入和任务结构
- [ ] 实现 Chief Agent
- [ ] 实现 Memory Agent
- [ ] 实现 Planner Agent
- [ ] 生成项目计划 JSON
- [ ] 实现基础计划展示页面

### 第三阶段：日程与复盘（6 月 9 日 - 6 月 12 日）

- [ ] 实现 Scheduler Agent
- [ ] 实现时间块生成
- [ ] 实现任务状态更新
- [ ] 实现 Review Agent
- [ ] 支持“没做完/延期/今天只有 X 小时”等反馈
- [ ] 实现计划自动调整

### 第四阶段：旅游规划与预算（6 月 13 日 - 6 月 16 日）

- [ ] 实现 Trip Agent
- [ ] 实现 Budget Agent
- [ ] 支持目的地、天数、预算、偏好输入
- [ ] 生成每日旅行路线
- [ ] 生成轻松版/省钱版/打卡版
- [ ] 实现旅行卡片 UI

### 第五阶段：风险、隐私和可视化（6 月 17 日 - 6 月 19 日）

- [ ] 实现 Risk Agent
- [ ] 实现 Privacy Agent
- [ ] 实现代理调用 Timeline
- [ ] 实现本地数据状态面板
- [ ] 实现脱敏导出

### 第六阶段：优化与提交（6 月 20 日 - 6 月 21 日）

- [ ] 性能优化
- [ ] 错误处理
- [ ] 准备 README
- [ ] 录制 5 分钟以内演示视频
- [ ] 准备硬件规格和审计日志
- [ ] 完成最终提交

---

## MVP 范围

为避免范围过大，第一版只聚焦三个主场景：

1. **项目规划**
2. **日程规划**
3. **旅游计划**

暂不实现：

- 健身计划
- 饮食计划
- 财务管理
- 多人协作
- 真实地图 API
- 真实日历同步

---

## 评判标准对应

| 评判标准 | 如何得分 |
|---|---|
| 技术执行 & 性能 | 本地 LLM + RAG + 多代理工作流 + 结构化计划输出 |
| 创新 & 模型创意 | 将本地 AI 从“问答助手”升级成“生活规划助理”，支持项目、日程、旅游和复盘 |
| QVAC 使用 | 使用 completion、embeddings、RAG、tool calling、多模型加载 |
| 产物质量 | 提供清晰 Web UI、Agent Timeline、计划视图、旅行视图、README 和演示视频 |
| 影响力 | 解决用户真实生活中的规划、日程、旅行和隐私问题 |
| 原创性 | 本地隐私优先 + 自适应生活规划 + 多代理协作，区别于普通 Todo App 和普通 RAG Chatbot |

---

## 项目亮点

### 1. Local-first Life Planning

所有个人目标、旅行偏好、日程信息都留在本地。

### 2. Agent Team as Personal Staff

多个代理像一个私人助理团队一样协作，而不是单一聊天机器人。

### 3. Adaptive Schedule

根据用户完成情况动态调整后续计划。

### 4. Trip + Project + Daily Life Unified

把项目规划、日程安排和旅游计划统一在一个本地 AI 助理中。

### 5. Privacy-aware Export

可以生成可分享的脱敏计划，避免泄露私人信息。

---

## 风险和应对

| 风险 | 应对方案 |
|---|---|
| 功能范围过大 | MVP 只做项目、日程、旅游三类规划 |
| 旅游信息可能不够实时 | 第一版不依赖实时地图/票价，专注生成结构化行程和预算估算 |
| 多代理协作复杂 | 先用串行调用实现，再优化为更灵活的 Router/Tool Calling |
| 性能问题 | 使用小模型，控制上下文长度，RAG 只取 top-K 相关片段 |
| UI 时间不足 | 先做 Agent Timeline + 简单卡片视图，不追求复杂设计 |
| 计划质量不稳定 | 使用结构化 JSON schema 和 Risk Agent 二次检查 |

---

## 提交材料清单

1. **GitHub 仓库**：完整源代码，建议 Apache 2.0 协议
2. **README.md**：项目说明、安装步骤、使用方法、架构图
3. **演示视频**：5 分钟以内，展示项目规划、旅游计划、复盘调整
4. **硬件规格**：CPU/GPU/RAM/存储信息
5. **审计日志**：模型加载/卸载、推理时间、RAG 检索记录
6. **可复现说明**：详细安装与运行步骤
7. **样例数据**：项目计划、旅行偏好、日程样例
8. **隐私说明**：解释所有数据如何本地存储和处理

---

## 下一步行动

1. 将项目名确定为 **PrivateMind Planner**
2. 先完成一个端到端 MVP：输入目标 → 生成计划 → 显示任务 → 复盘调整
3. 优先实现项目规划和日程规划
4. 再加入旅游计划和预算代理
5. 最后补充隐私守卫、代理时间线和演示视频

---

## 附录：QVAC SDK 关键 API

### 模型加载

```javascript
import { loadModel, QWEN3_1_7B_INST_Q4, GTE_LARGE_FP16 } from "@qvac/sdk";

// 加载 LLM
const llmModelId = await loadModel({
  modelSrc: QWEN3_1_7B_INST_Q4,
  modelType: "llm",
  modelConfig: { ctx_size: 4096 },
  onProgress: (p) => console.log(`Loading: ${p.percentage.toFixed(1)}%`),
});

// 加载 Embeddings
const embedModelId = await loadModel({
  modelSrc: GTE_LARGE_FP16,
  modelType: "embeddings",
});
```

### 文本生成

```javascript
import { completion } from "@qvac/sdk";

const result = completion({
  modelId: llmModelId,
  history: [{ role: "user", content: "帮我规划 3 天大阪旅行" }],
  stream: true,
});

for await (const token of result.tokenStream) {
  process.stdout.write(token);
}
```

### RAG 检索

```javascript
import { embed, ragSearch } from "@qvac/sdk";

// 生成查询向量
const { embedding } = await embed({
  modelId: embedModelId,
  text: "用户的旅行偏好和预算习惯",
});

// 检索相关文档
const results = await ragSearch({
  modelId: embedModelId,
  query: "旅行偏好 预算 美食 拍照",
  workspace: "user-memory",
  topK: 5,
});
```

### Tool Calling

```javascript
const tools = [
  {
    type: "function",
    function: {
      name: "create_schedule_blocks",
      description: "Convert a plan into daily schedule blocks",
      parameters: {
        type: "object",
        properties: {
          date: { type: "string", description: "Target date" },
          tasks: {
            type: "array",
            items: { type: "string" },
            description: "Tasks to schedule"
          },
          availableHours: {
            type: "number",
            description: "Available hours for this day"
          }
        },
        required: ["date", "tasks"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "estimate_trip_budget",
      description: "Estimate trip budget by day and category",
      parameters: {
        type: "object",
        properties: {
          destination: { type: "string" },
          days: { type: "number" },
          budget: { type: "number" },
          style: {
            type: "array",
            items: { type: "string" }
          }
        },
        required: ["destination", "days"]
      }
    }
  }
];

const result = completion({
  modelId: llmModelId,
  history: [
    { role: "user", content: "我想去大阪玩 3 天，预算 5 万日元，喜欢美食和拍照" }
  ],
  tools,
  stream: true,
});
```

---

## 参考资源

- **QVAC 官网**: https://qvac.tether.io
- **QVAC SDK 文档**: https://docs.qvac.tether.io
- **QVAC GitHub**: https://github.com/tetherto/qvac
- **Discord 社区**: https://discord.com/invite/tetherdev
- **HuggingFace 模型**: https://huggingface.co/qvac
