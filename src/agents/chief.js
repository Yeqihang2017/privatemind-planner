/**
 * Chief Agent - Intent Recognition & Routing
 * Understands user intent and routes to appropriate specialized agents
 */

import modelService from '../services/model.js';

// Intent types
export const INTENTS = {
  PROJECT_PLAN: 'project_plan',
  DAILY_SCHEDULE: 'daily_schedule',
  WEEKLY_SCHEDULE: 'weekly_schedule',
  TRIP_PLAN: 'trip_plan',
  PROGRESS_REVIEW: 'progress_review',
  GENERAL_CHAT: 'general_chat',
};

// Tool definitions for intent classification
const intentTools = [
  {
    type: 'function',
    function: {
      name: 'classify_intent',
      description: 'Classify user intent into one of the predefined categories',
      parameters: {
        type: 'object',
        properties: {
          intent: {
            type: 'string',
            enum: Object.values(INTENTS),
            description: 'The classified intent',
          },
          confidence: {
            type: 'number',
            description: 'Confidence score between 0 and 1',
          },
          summary: {
            type: 'string',
            description: 'Brief summary of what the user wants',
          },
          extracted_info: {
            type: 'object',
            description: 'Key information extracted from user input',
            properties: {
              goal: {type: 'string', description: 'Main goal or objective'},
              deadline: {type: 'string', description: 'Deadline if mentioned'},
              destination: {type: 'string', description: 'Destination for trip planning'},
              duration: {type: 'string', description: 'Duration (e.g., 3 days, 2 weeks)'},
              budget: {type: 'string', description: 'Budget if mentioned'},
              preferences: {
                type: 'array',
                items: {type: 'string'},
                description: 'User preferences',
              },
            },
          },
        },
        required: ['intent', 'confidence', 'summary'],
      },
    },
  },
];

/**
 * Chief Agent class
 */
export class ChiefAgent {
  /**
   * Classify user intent
   */
  async classifyIntent(userInput) {
    const history = [
      {
        role: 'system',
        content: `You are an intent classification agent. Your job is to understand what the user wants and classify their intent.

Intent types:
- project_plan: User wants to plan a project, break down goals, create development timeline
- daily_schedule: User wants to schedule tasks for today or a specific day
- weekly_schedule: User wants to plan their week
- trip_plan: User wants to plan a trip or vacation
- progress_review: User wants to review progress, adjust plans, or discuss what they've completed
- general_chat: General conversation, questions, or requests that don't fit other categories

Analyze the user's input and extract key information like goals, deadlines, destinations, duration, budget, and preferences.

Always use the classify_intent tool to provide structured output.`,
      },
      {
        role: 'user',
        content: userInput,
      },
    ];

    try {
      const result = await modelService.complete(history, {
        tools: intentTools,
        stream: false,
      });

      // Wait for completion
      const final = await result.final;

      // Get tool calls
      const toolCalls = final.toolCalls;

      if (toolCalls && toolCalls.length > 0) {
        const intentCall = toolCalls.find((call) => call.name === 'classify_intent');

        if (intentCall) {
          return {
            success: true,
            intent: intentCall.arguments.intent,
            confidence: intentCall.arguments.confidence,
            summary: intentCall.arguments.summary,
            extractedInfo: intentCall.arguments.extracted_info || {},
          };
        }
      }

      // Fallback: parse from text response
      return {
        success: true,
        intent: INTENTS.GENERAL_CHAT,
        confidence: 0.5,
        summary: final.contentText || 'User request',
        extractedInfo: {},
      };
    } catch (error) {
      console.error('❌ Chief Agent error:', error.message);
      return {
        success: false,
        intent: INTENTS.GENERAL_CHAT,
        confidence: 0,
        summary: 'Failed to classify intent',
        extractedInfo: {},
        error: error.message,
      };
    }
  }

  /**
   * Get welcome message
   */
  getWelcomeMessage() {
    return `👋 你好！我是 PrivateMind Planner，你的本地 AI 生活规划助理。

我可以帮你：
- 📋 **规划项目** - 把大目标拆解成可执行计划
- 📅 **安排日程** - 规划今天或这周的任务
- ✈️ **规划旅行** - 制定旅行路线和预算
- 🔄 **复盘调整** - 根据完成情况调整计划

请告诉我你想做什么？`;
  }
}

// Singleton instance
const chiefAgent = new ChiefAgent();

export default chiefAgent;
