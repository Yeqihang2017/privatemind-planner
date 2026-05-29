/**
 * PrivateMind Planner - Frontend Application
 */

// DOM Elements
const messagesContainer = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const statusText = document.getElementById('statusText');
const connectionStatus = document.getElementById('connectionStatus');

// State
let isLoading = false;

/**
 * Initialize the application
 */
async function init() {
  // Load welcome message
  await loadWelcomeMessage();

  // Check health status
  await checkHealth();

  // Setup event listeners
  setupEventListeners();
}

/**
 * Load welcome message from server
 */
async function loadWelcomeMessage() {
  try {
    const response = await fetch('/api/welcome');
    const data = await response.json();
    addMessage(data.message, 'assistant');
  } catch (error) {
    console.error('Failed to load welcome message:', error);
    addMessage('欢迎使用 PrivateMind Planner！请告诉我你想做什么。', 'assistant');
  }
}

/**
 * Check server health
 */
async function checkHealth() {
  try {
    const response = await fetch('/api/health');
    const data = await response.json();

    if (data.models.isReady) {
      statusText.textContent = '模型已就绪';
      connectionStatus.className = 'status-dot online';
    } else if (data.models.isLoading) {
      statusText.textContent = '模型加载中...';
      connectionStatus.className = 'status-dot loading';
    } else {
      statusText.textContent = '模型未加载';
      connectionStatus.className = 'status-dot offline';
    }
  } catch (error) {
    statusText.textContent = '无法连接服务器';
    connectionStatus.className = 'status-dot offline';
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Enter key to send (Shift+Enter for new line)
  userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Auto-resize textarea
  userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = Math.min(userInput.scrollHeight, 150) + 'px';
  });
}

/**
 * Send message to server
 */
async function sendMessage() {
  const message = userInput.value.trim();

  if (!message || isLoading) {
    return;
  }

  // Add user message to chat
  addMessage(message, 'user');

  // Clear input
  userInput.value = '';
  userInput.style.height = 'auto';

  // Show loading state
  setLoading(true);

  // Show typing indicator
  const typingIndicator = addTypingIndicator();

  try {
    // Send to server
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({message}),
    });

    const data = await response.json();

    // Remove typing indicator
    typingIndicator.remove();

    // Handle response
    if (data.error) {
      addMessage(`❌ 错误: ${data.error}`, 'assistant');
    } else if (data.type === 'plan') {
      // Display plan
      addPlanMessage(data);
    } else {
      // Display regular message
      addMessage(data.message, 'assistant', data.intent);
    }
  } catch (error) {
    console.error('Failed to send message:', error);
    typingIndicator.remove();
    addMessage('❌ 发送失败，请检查网络连接。', 'assistant');
  } finally {
    setLoading(false);
  }
}

/**
 * Add message to chat
 */
function addMessage(content, type, intent = null) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;

  if (type === 'assistant' && intent) {
    const intentBadge = document.createElement('span');
    intentBadge.className = 'intent-badge';
    intentBadge.textContent = getIntentLabel(intent);
    messageDiv.appendChild(intentBadge);
    messageDiv.appendChild(document.createElement('br'));
  }

  const textNode = document.createElement('span');
  textNode.textContent = content;
  messageDiv.appendChild(textNode);

  messagesContainer.appendChild(messageDiv);
  scrollToBottom();

  return messageDiv;
}

/**
 * Add plan message to chat
 */
function addPlanMessage(data) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message assistant';

  // Intent badge
  const intentBadge = document.createElement('span');
  intentBadge.className = 'intent-badge';
  intentBadge.textContent = '📋 项目计划';
  messageDiv.appendChild(intentBadge);
  messageDiv.appendChild(document.createElement('br'));

  // Summary
  if (data.summary) {
    const summary = document.createElement('div');
    summary.style.marginBottom = '10px';
    summary.style.fontWeight = 'bold';
    summary.textContent = data.summary;
    messageDiv.appendChild(summary);
  }

  // Plan content
  const planContent = document.createElement('div');
  planContent.className = 'plan-content';
  planContent.textContent = data.display;
  messageDiv.appendChild(planContent);

  messagesContainer.appendChild(messageDiv);
  scrollToBottom();
}

/**
 * Add typing indicator
 */
function addTypingIndicator() {
  const indicator = document.createElement('div');
  indicator.className = 'typing-indicator';
  indicator.innerHTML = '<span></span><span></span><span></span>';
  messagesContainer.appendChild(indicator);
  scrollToBottom();
  return indicator;
}

/**
 * Get intent label in Chinese
 */
function getIntentLabel(intent) {
  const labels = {
    project_plan: '📋 项目规划',
    daily_schedule: '📅 日程规划',
    weekly_schedule: '📅 周计划',
    trip_plan: '✈️ 旅行规划',
    progress_review: '🔄 进度复盘',
    general_chat: '💬 普通对话',
  };
  return labels[intent] || '💬 对话';
}

/**
 * Set loading state
 */
function setLoading(loading) {
  isLoading = loading;
  sendBtn.disabled = loading;
  userInput.disabled = loading;

  if (loading) {
    sendBtn.textContent = '处理中...';
    statusText.textContent = 'AI 思考中...';
    connectionStatus.className = 'status-dot loading';
  } else {
    sendBtn.textContent = '发送';
    statusText.textContent = '模型已就绪';
    connectionStatus.className = 'status-dot online';
  }
}

/**
 * Scroll to bottom of messages
 */
function scrollToBottom() {
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
