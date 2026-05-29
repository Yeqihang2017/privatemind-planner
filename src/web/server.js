/**
 * Web Server - Express server with API endpoints
 */

import express from 'express';
import {fileURLToPath} from 'url';
import {dirname, join} from 'path';
import modelService from '../services/model.js';
import chiefAgent from '../agents/chief.js';
import plannerAgent from '../agents/planner.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

/**
 * Chat endpoint - Main interaction point
 */
app.post('/api/chat', async (req, res) => {
  const {message} = req.body;

  if (!message) {
    return res.status(400).json({error: 'Message is required'});
  }

  try {
    console.log(`\n💬 User: ${message}`);

    // Step 1: Classify intent
    console.log('🧠 Chief Agent: Classifying intent...');
    const intentResult = await chiefAgent.classifyIntent(message);

    if (!intentResult.success) {
      return res.json({
        response: '抱歉，我无法理解你的请求。请再试一次。',
        intent: 'error',
      });
    }

    console.log(`✅ Intent: ${intentResult.intent} (confidence: ${intentResult.confidence})`);
    console.log(`📝 Summary: ${intentResult.summary}`);

    // Step 2: Route to appropriate agent
    let response;

    switch (intentResult.intent) {
      case 'project_plan':
        console.log('📋 Routing to Planner Agent...');
        const planResult = await plannerAgent.generatePlan(message, intentResult.extractedInfo);

        if (planResult.success) {
          response = {
            type: 'plan',
            intent: intentResult.intent,
            summary: intentResult.summary,
            plan: planResult.plan,
            display: plannerAgent.formatPlanForDisplay(planResult.plan),
          };
        } else {
          response = {
            type: 'error',
            intent: intentResult.intent,
            message: '生成计划时出错，请重试。',
          };
        }
        break;

      case 'daily_schedule':
      case 'weekly_schedule':
        // TODO: Implement Scheduler Agent
        response = {
          type: 'message',
          intent: intentResult.intent,
          message: `📅 日程规划功能即将上线！\n\n你想要：\n- 安排今天的任务\n- 规划这周的日程\n\n请告诉我你的具体需求。`,
        };
        break;

      case 'trip_plan':
        // TODO: Implement Trip Agent
        response = {
          type: 'message',
          intent: intentResult.intent,
          message: `✈️ 旅行规划功能即将上线！\n\n请告诉我：\n- 目的地\n- 天数\n- 预算\n- 偏好（美食/拍照/购物等）`,
        };
        break;

      case 'progress_review':
        // TODO: Implement Review Agent
        response = {
          type: 'message',
          intent: intentResult.intent,
          message: `🔄 复盘功能即将上线！\n\n请告诉我：\n- 昨天完成了什么\n- 今天有什么计划\n- 遇到了什么问题`,
        };
        break;

      default:
        // General chat
        const chatHistory = [
          {
            role: 'system',
            content: `You are PrivateMind Planner, a friendly AI life planning assistant. You help users plan projects, schedule tasks, and organize their lives. Be helpful, concise, and friendly. Respond in the same language as the user (Chinese or English).`,
          },
          {role: 'user', content: message},
        ];

        const chatResult = await modelService.complete(chatHistory, {stream: false});
        const chatFinal = await chatResult.final;

        response = {
          type: 'message',
          intent: intentResult.intent,
          message: chatFinal.contentText,
        };
    }

    console.log('✅ Response ready');
    res.json(response);
  } catch (error) {
    console.error('❌ Chat error:', error);
    res.status(500).json({
      error: '处理请求时出错',
      details: error.message,
    });
  }
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  const status = modelService.getStatus();
  res.json({
    status: 'ok',
    models: status,
  });
});

/**
 * Welcome message endpoint
 */
app.get('/api/welcome', (req, res) => {
  res.json({
    message: chiefAgent.getWelcomeMessage(),
  });
});

/**
 * Start server
 */
export async function startServer() {
  return new Promise((resolve) => {
    const server = app.listen(PORT, () => {
      console.log(`\n🌐 Web server running at http://localhost:${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}/api`);
      resolve(server);
    });
  });
}

export default app;
