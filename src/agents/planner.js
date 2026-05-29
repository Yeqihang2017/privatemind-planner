/**
 * Planner Agent - Project Planning
 * Generates structured plans from user goals
 */

import modelService from '../services/model.js';

// Tool definitions for plan generation
const planTools = [
  {
    type: 'function',
    function: {
      name: 'generate_project_plan',
      description: 'Generate a structured project plan with phases and tasks',
      parameters: {
        type: 'object',
        properties: {
          goal: {
            type: 'string',
            description: 'The main project goal',
          },
          deadline: {
            type: 'string',
            description: 'Project deadline (ISO date or relative like "21 days")',
          },
          phases: {
            type: 'array',
            description: 'Project phases',
            items: {
              type: 'object',
              properties: {
                name: {type: 'string', description: 'Phase name'},
                duration: {type: 'string', description: 'Phase duration (e.g., "Day 1-3")'},
                tasks: {
                  type: 'array',
                  items: {type: 'string'},
                  description: 'Tasks in this phase',
                },
                deliverables: {
                  type: 'array',
                  items: {type: 'string'},
                  description: 'Deliverables for this phase',
                },
              },
              required: ['name', 'duration', 'tasks'],
            },
          },
          risks: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                risk: {type: 'string', description: 'Risk description'},
                mitigation: {type: 'string', description: 'Mitigation strategy'},
                severity: {
                  type: 'string',
                  enum: ['low', 'medium', 'high'],
                  description: 'Risk severity',
                },
              },
              required: ['risk', 'mitigation', 'severity'],
            },
            description: 'Potential risks and mitigations',
          },
          success_criteria: {
            type: 'array',
            items: {type: 'string'},
            description: 'Criteria for project success',
          },
        },
        required: ['goal', 'phases'],
      },
    },
  },
];

/**
 * Planner Agent class
 */
export class PlannerAgent {
  /**
   * Generate project plan from goal and extracted info
   */
  async generatePlan(userInput, extractedInfo = {}) {
    const {goal, deadline, duration, preferences} = extractedInfo;

    const systemPrompt = `You are a project planning expert. Your job is to create detailed, actionable project plans.

When given a goal, break it down into:
1. Clear phases with specific durations
2. Concrete tasks for each phase
3. Deliverables for each phase
4. Potential risks and mitigation strategies
5. Success criteria

Guidelines:
- Be specific and actionable (not vague)
- Consider dependencies between tasks
- Include buffer time for unexpected issues
- Prioritize critical path items
- Make tasks small enough to complete in 1-4 hours

Always use the generate_project_plan tool to provide structured output.`;

    const userPrompt = this._buildUserPrompt(userInput, extractedInfo);

    const history = [
      {role: 'system', content: systemPrompt},
      {role: 'user', content: userPrompt},
    ];

    try {
      const result = await modelService.complete(history, {
        tools: planTools,
        stream: false,
      });

      // Wait for completion
      const final = await result.final;

      // Get tool calls
      const toolCalls = final.toolCalls;

      if (toolCalls && toolCalls.length > 0) {
        const planCall = toolCalls.find((call) => call.name === 'generate_project_plan');

        if (planCall) {
          return {
            success: true,
            plan: {
              goal: planCall.arguments.goal || goal || 'Project Goal',
              deadline: planCall.arguments.deadline || deadline,
              phases: planCall.arguments.phases || [],
              risks: planCall.arguments.risks || [],
              successCriteria: planCall.arguments.success_criteria || [],
              createdAt: new Date().toISOString(),
            },
          };
        }
      }

      // Fallback: return basic plan structure
      return {
        success: true,
        plan: {
          goal: goal || 'Project Goal',
          deadline: deadline,
          phases: [
            {
              name: 'Planning',
              duration: 'Day 1',
              tasks: ['Define requirements', 'Create task list'],
            },
            {
              name: 'Execution',
              duration: 'Day 2-N',
              tasks: ['Implement features', 'Test and iterate'],
            },
            {
              name: 'Finalization',
              duration: 'Last Day',
              tasks: ['Final testing', 'Documentation', 'Deployment'],
            },
          ],
          risks: [],
          successCriteria: ['Project completed on time', 'All features working'],
          createdAt: new Date().toISOString(),
        },
        message: final.contentText,
      };
    } catch (error) {
      console.error('❌ Planner Agent error:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Build user prompt with context
   */
  _buildUserPrompt(userInput, extractedInfo) {
    let prompt = `Please create a detailed project plan for the following request:

"${userInput}"`;

    if (extractedInfo.goal) {
      prompt += `\n\nMain Goal: ${extractedInfo.goal}`;
    }

    if (extractedInfo.deadline) {
      prompt += `\nDeadline: ${extractedInfo.deadline}`;
    }

    if (extractedInfo.duration) {
      prompt += `\nDuration: ${extractedInfo.duration}`;
    }

    if (extractedInfo.preferences && extractedInfo.preferences.length > 0) {
      prompt += `\nPreferences: ${extractedInfo.preferences.join(', ')}`;
    }

    return prompt;
  }

  /**
   * Format plan for display
   */
  formatPlanForDisplay(plan) {
    let output = `📋 **项目计划: ${plan.goal}**\n`;

    if (plan.deadline) {
      output += `📅 截止日期: ${plan.deadline}\n`;
    }

    output += `\n---\n\n`;

    // Phases
    plan.phases.forEach((phase, index) => {
      output += `### 阶段 ${index + 1}: ${phase.name}\n`;
      output += `⏱️ 时间: ${phase.duration}\n\n`;
      output += `**任务:**\n`;
      phase.tasks.forEach((task) => {
        output += `- [ ] ${task}\n`;
      });

      if (phase.deliverables && phase.deliverables.length > 0) {
        output += `\n**交付物:**\n`;
        phase.deliverables.forEach((d) => {
          output += `- 📦 ${d}\n`;
        });
      }

      output += `\n`;
    });

    // Risks
    if (plan.risks && plan.risks.length > 0) {
      output += `---\n\n⚠️ **风险提醒:**\n\n`;
      plan.risks.forEach((risk) => {
        const icon = risk.severity === 'high' ? '🔴' : risk.severity === 'medium' ? '🟡' : '🟢';
        output += `${icon} **${risk.risk}**\n`;
        output += `   缓解策略: ${risk.mitigation}\n\n`;
      });
    }

    // Success criteria
    if (plan.successCriteria && plan.successCriteria.length > 0) {
      output += `---\n\n✅ **成功标准:**\n\n`;
      plan.successCriteria.forEach((criteria) => {
        output += `- ${criteria}\n`;
      });
    }

    return output;
  }
}

// Singleton instance
const plannerAgent = new PlannerAgent();

export default plannerAgent;
