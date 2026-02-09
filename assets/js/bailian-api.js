/**
 * 阿里云百炼API调用模块
 * Alibaba Cloud Bailian API Module
 * 
 * 使用说明：
 * 1. 在使用前需要配置Cloudflare Worker代理地址
 * 2. 调用 sendMessageToBailian() 函数发送消息
 * 3. 返回的Promise包含AI的回复
 */

// API配置
const BAILIAN_CONFIG = {
  // Cloudflare Worker代理端点
  // 示例: https://<worker-name>.<account>.workers.dev/chat
  apiEndpoint: 'https://ziminran-chat-proxy.ziminran.workers.dev/chat',
  
  // 请求参数
  parameters: {
    temperature: 0.8,     // 控制随机性 (0-2)，较高的值会使输出更加随机
    max_tokens: 500      // 生成文本的最大长度
  }
};

/**
 * 配置阿里云百炼API
 * @param {Object} config - 配置对象
 * @param {string} config.apiEndpoint - API端点（可选）
 */
function configureBailianAPI(config) {
  if (config.apiEndpoint) {
    BAILIAN_CONFIG.apiEndpoint = config.apiEndpoint;
  }
  if (config.parameters) {
    Object.assign(BAILIAN_CONFIG.parameters, config.parameters);
  }
}

/**
 * 发送消息到阿里云百炼API
 * @param {string} userMessage - 用户消息
 * @param {Array} conversationHistory - 对话历史（可选）
 * @returns {Promise<string>} - AI回复
 */
async function sendMessageToBailian(userMessage, conversationHistory = []) {
  // 构建消息列表
  const messages = [
    {
      role: 'system',
      content: '你是Zimin Ran的AI助手。你可以回答关于Zimin Ran的教育背景、研究方向和发表论文的问题。请友好、专业地回答用户的问题。'
    },
    ...conversationHistory,
    {
      role: 'user',
      content: userMessage
    }
  ];
  
  // 构建请求体（OpenAI兼容格式）
  const requestBody = {
    messages: messages,
    max_tokens: BAILIAN_CONFIG.parameters.max_tokens,
    temperature: BAILIAN_CONFIG.parameters.temperature
  };
  
  try {
    // 发送API请求
    const response = await fetch(BAILIAN_CONFIG.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    // 检查响应状态
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `API请求失败: ${response.status} ${response.statusText}\n` +
        `详情: ${JSON.stringify(errorData)}`
      );
    }
    
    // 解析响应
    const data = await response.json();
    
    // 检查API返回的错误
    if (data.error) {
      const errorMessage =
        typeof data.error === 'string'
          ? data.error
          : (data.error.message || 'API返回错误');
      throw new Error(errorMessage);
    }
    
    // 提取AI的回复
    if (data.choices && data.choices.length > 0) {
      const assistantMessage = data.choices[0].message;
      return assistantMessage.content;
    } else {
      throw new Error('API返回的数据格式不正确');
    }
    
  } catch (error) {
    console.error('阿里云百炼API调用失败:', error);
    throw error;
  }
}

/**
 * 使用流式输出发送消息（SSE）
 * @param {string} userMessage - 用户消息
 * @param {Array} conversationHistory - 对话历史（可选）
 * @param {Function} onChunk - 接收到文本片段时的回调函数
 * @param {Function} onComplete - 完成时的回调函数
 * @param {Function} onError - 错误时的回调函数
 */
async function sendMessageToBailianStream(userMessage, conversationHistory = [], onChunk, onComplete, onError) {
  try {
    const responseText = await sendMessageToBailian(userMessage, conversationHistory);
    if (onChunk) onChunk(responseText);
    if (onComplete) onComplete();
  } catch (error) {
    console.error('阿里云百炼API调用失败:', error);
    if (onError) onError(error);
  }
}

// 导出函数供外部使用
if (typeof module !== 'undefined' && module.exports) {
  // Node.js环境
  module.exports = {
    configureBailianAPI,
    sendMessageToBailian,
    sendMessageToBailianStream
  };
}
