# PrivateMind Planner

> **本地隐私优先 AI 生活规划助理** - A local AI life planner that turns your private notes, goals, trips, and schedules into actionable plans — without sending your data to the cloud.

## 🎯 项目简介

PrivateMind Planner 是一个完全在本地运行的 AI 生活规划助理，帮助用户：

- 📋 **项目规划**：将大目标拆解为可执行的阶段计划
- 📅 **日程安排**：智能安排每日时间块和任务优先级
- ✈️ **旅行规划**：根据预算和偏好生成旅行路线
- 🔄 **动态复盘**：根据完成情况自动调整计划

所有数据和 AI 推理都在本地设备完成，**绝不上传云端**。

## 🏆 黑客松信息

- **比赛**: QVAC Hackathon I - Unleash Edge AI
- **赛道**: General Purpose（通用设备）
- **主办**: Tether / QVAC
- **时间**: 2026年6月1日 - 6月21日

## 🤖 多代理架构

```
Chief Agent → Memory Agent → Planner/Scheduler/Trip/Budget Agent → Risk Agent → Review Agent → Privacy Agent
```

| 代理 | 职责 |
|------|------|
| 🧠 Chief Agent | 理解用户意图，路由到对应代理 |
| 🗂 Memory Agent | 检索本地笔记、偏好和历史计划 |
| 📋 Planner Agent | 生成项目/学习/生活计划 |
| 📆 Scheduler Agent | 安排每日时间块 |
| 🧭 Trip Agent | 规划旅行路线 |
| 💰 Budget Agent | 估算预算 |
| ⚠️ Risk Agent | 检查计划风险 |
| 🔁 Review Agent | 复盘和调整计划 |
| 🛡 Privacy Agent | 检查敏感信息，生成脱敏版 |

## 🛠 技术栈

- **AI 推理**: [QVAC SDK](https://qvac.tether.io) (`@qvac/sdk`)
- **LLM**: QWEN3_1_7B_INST_Q4
- **Embeddings**: GTE_LARGE_FP16
- **后端**: Node.js + Express
- **数据库**: SQLite + WASM（向量搜索）
- **前端**: HTML/CSS/JavaScript

## 🚀 快速开始

```bash
# 克隆仓库
git clone https://github.com/YOUR_USERNAME/privatemind-planner.git
cd privatemind-planner

# 安装依赖
npm install

# 启动服务
npm start
```

## 📁 项目结构

```
privatemind-planner/
├── docs/                    # 项目文档
│   ├── PrivateMind-Planner-Project-Plan.md
│   └── PrivateMind-Project-Plan.md
├── src/                     # 源代码
│   ├── agents/              # AI 代理
│   ├── services/            # 服务层
│   ├── tools/               # 工具定义
│   └── web/                 # Web UI
├── data/                    # 用户数据
└── README.md
```

## 📖 文档

- [完整项目方案](docs/PrivateMind-Planner-Project-Plan.md)
- [原版方案](docs/PrivateMind-Project-Plan.md)

## 🔒 隐私承诺

- ✅ 所有数据存储在本地设备
- ✅ 所有 AI 推理在本地完成
- ✅ 无云端 API 调用
- ✅ 支持脱敏导出分享

## 📝 License

Apache License 2.0

## 🔗 相关链接

- [QVAC 官网](https://qvac.tether.io)
- [QVAC SDK 文档](https://docs.qvac.tether.io)
- [比赛页面](https://dorahacks.io/hackathon/qvac-unleach-edge-ai-i)
- [Discord 社区](https://discord.com/invite/tetherdev)
