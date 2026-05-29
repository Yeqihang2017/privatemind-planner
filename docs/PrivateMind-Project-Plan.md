# PrivateMind - 本地隐私优先个人知识助手

## 项目概述

**项目名称**: PrivateMind  
**赛道**: General Purpose（通用设备）  
**方向**: 多代理工作流 + 隐私优先个人助手  
**技术栈**: Node.js + QVAC SDK + 简单 Web UI

### 核心理念
一个完全在本地运行的 AI 个人知识助手，用户可以添加笔记、文档，然后通过多个 AI 代理协作来回答问题、总结内容、分析数据。所有数据和推理都在本地设备上完成，绝不外传。

### 为什么选这个方向
1. **隐私是真实痛点** - 很多人不想把个人数据传到云端
2. **多代理是技术亮点** - 评委看重的技术深度
3. **QVAC SDK 完美适配** - 内置 RAG、tool calling、completion
4. **演示效果好** - 用户可以直观看到"本地 AI"的价值
5. **实现难度可控** - 核心功能 QVAC SDK 都有现成 API

---

## 多代理架构设计

```
用户输入问题
       ↓
┌─────────────────────────────────────────┐
│           🧠 Router Agent               │
│  (分析问题类型，决定调用哪些代理)        │
└─────────────────────────────────────────┘
       ↓                    ↓                    ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 📚 RAG Agent │  │ 📝 Summary   │  │ 🔍 Analysis  │
│ (检索文档    │  │ Agent        │  │ Agent        │
│  回答问题)   │  │ (总结文档)   │  │ (分析数据)   │
└──────────────┘  └──────────────┘  └──────────────┘
       ↓                    ↓                    ↓
┌─────────────────────────────────────────┐
│           ✅ Quality Agent              │
│  (审查答案质量，补充或修正)             │
└─────────────────────────────────────────┘
       ↓
   返回用户
```

### 各代理职责

1. **Router Agent (路由代理)**
   - 接收用户输入
   - 分析问题类型（问答/总结/分析）
   - 决定调用哪个专业代理
   - 使用 QVAC completion + tool calling

2. **RAG Agent (检索问答代理)**
   - 从用户文档中检索相关信息
   - 基于检索结果生成回答
   - 使用 QVAC RAG API (ragSearch + completion)

3. **Summary Agent (总结代理)**
   - 对指定文档或主题生成摘要
   - 使用 QVAC completion

4. **Analysis Agent (分析代理)**
   - 分析文档内容、提取关键信息
   - 使用 QVAC completion

5. **Quality Agent (质量代理)**
   - 审查其他代理的输出
   - 补充遗漏信息或修正错误
   - 使用 QVAC completion

---

## 技术实现方案

### 1. 项目结构

```
privatemind/
├── package.json
├── src/
│   ├── index.js          # 主入口
│   ├── agents/
│   │   ├── router.js     # 路由代理
│   │   ├── rag.js        # RAG 代理
│   │   ├── summary.js    # 总结代理
│   │   ├── analysis.js   # 分析代理
│   │   └── quality.js    # 质量代理
│   ├── services/
│   │   ├── model.js      # 模型管理
│   │   ├── rag.js        # RAG 服务
│   │   └── storage.js    # 数据存储
│   ├── tools/
│   │   └── index.js      # 工具定义
│   └── web/
│       ├── server.js     # Web 服务器
│       └── public/       # 前端文件
│           ├── index.html
│           ├── app.js
│           └── style.css
├── data/                 # 用户数据目录
└── README.md
```

### 2. 核心依赖

```json
{
  "dependencies": {
    "@qvac/sdk": "latest",
    "express": "^4.18.0",
    "@sqliteai/sqlite-wasm": "latest"
  }
}
```

### 3. 模型选择

- **LLM**: QWEN3_1_7B_INST_Q4 (1.7B 参数，平衡性能和质量)
- **Embeddings**: GTE_LARGE_FP16 (1024 维向量)

### 4. 核心功能实现

#### 4.1 文档导入
- 支持添加纯文本笔记
- 支持导入 .txt 文件
- 自动分块 (ragChunk)
- 生成 embeddings 并存储 (ragIngest)

#### 4.2 RAG 检索
- 用户提问时，先用 embeddings 检索相关文档
- 返回 top-K 相关片段
- 传递给 LLM 作为上下文

#### 4.3 多代理协作
- Router Agent 使用 tool calling 决定调用哪个代理
- 各代理独立运行，返回结果
- Quality Agent 审查最终输出

#### 4.4 Web UI
- 简单的聊天界面
- 文档管理（添加/删除/查看）
- 实时显示代理调用过程

---

## 开发计划（21天）

### 第一阶段：基础搭建（6月1日-3日）
- [ ] 初始化项目
- [ ] 安装 QVAC SDK
- [ ] 实现模型加载/卸载
- [ ] 测试基础 completion 功能
- [ ] 测试 RAG 功能

### 第二阶段：核心功能（6月4日-10日）
- [ ] 实现文档导入和分块
- [ ] 实现 RAG 检索服务
- [ ] 实现 Router Agent（带 tool calling）
- [ ] 实现 RAG Agent
- [ ] 实现 Summary Agent

### 第三阶段：多代理系统（6月11日-14日）
- [ ] 实现 Analysis Agent
- [ ] 实现 Quality Agent
- [ ] 实现代理间协作流程
- [ ] 优化代理提示词

### 第四阶段：Web UI（6月15日-18日）
- [ ] 实现 Express 服务器
- [ ] 实现聊天界面
- [ ] 实现文档管理界面
- [ ] 实现代理调用可视化

### 第五阶段：优化和完善（6月19日-21日）
- [ ] 性能优化
- [ ] 错误处理
- [ ] 编写 README
- [ ] 录制演示视频
- [ ] 准备提交材料

---

## 评判标准对应

| 评判标准 | 如何得分 |
|---------|---------|
| **技术执行 & 性能** | 多代理系统 + RAG + tool calling，展示 QVAC 深度使用 |
| **创新 & 模型创意** | 多代理协作模式，Router 智能路由 |
| **QVAC 使用** | 使用 completion、RAG、embeddings、tool calling |
| **产物质量** | 清晰的日志、完整的文档、演示视频 |
| **影响力** | 解决真实痛点（隐私保护） |
| **原创性** | 本地多代理知识助手是新颖的应用场景 |

---

## 提交材料清单

1. **GitHub 仓库** - 完整源代码（Apache 2.0 协议）
2. **README.md** - 项目说明、安装步骤、使用方法
3. **演示视频** (≤5分钟) - 展示完整工作流程
4. **硬件规格** - CPU/GPU/RAM/存储信息
5. **审计日志** - 模型加载/卸载、推理性能记录
6. **可复现说明** - 详细的安装和运行步骤

---

## 风险和应对

| 风险 | 应对方案 |
|------|---------|
| QVAC SDK API 不熟悉 | 参考官方文档和示例代码 |
| 多代理协作复杂 | 先实现简单版本，再逐步优化 |
| 性能问题 | 使用较小模型，优化 RAG 分块策略 |
| 时间不够 | 优先实现核心功能，UI 可以简化 |

---

## 下一步行动

1. 确认项目方向是否满意
2. 开始搭建开发环境
3. 实现第一个 hello world
4. 逐步实现各模块

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
  history: [{ role: "user", content: "Hello" }],
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
const { embedding } = await embed({ modelId: embedModelId, text: "query" });

// 检索相关文档
const results = await ragSearch({
  modelId: embedModelId,
  query: "search query",
  workspace: "my-workspace",
  topK: 5,
});
```

### Tool Calling
```javascript
const tools = [
  {
    type: "function",
    function: {
      name: "search_documents",
      description: "Search user documents",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Search query" },
        },
        required: ["query"],
      },
    },
  },
];

const result = completion({
  modelId: llmModelId,
  history: [...],
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
