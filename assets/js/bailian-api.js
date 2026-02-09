/**
 * 阿里云百炼API调用模块
 * Alibaba Cloud Bailian API Module
 * 
 * 使用说明：
 * 1. 在使用前需要配置API密钥和应用ID
 * 2. 调用 sendMessageToBailian() 函数发送消息
 * 3. 返回的Promise包含AI的回复
 */

// API配置
const BAILIAN_CONFIG = {
  // API端点 - 根据您的区域选择正确的endpoint
  // 华东1（杭州）: https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation
  // 华北2（北京）: https://dashscope-beijing.aliyuncs.com/api/v1/services/aigc/text-generation/generation
  apiEndpoint: '',
  
  // API密钥 - 从环境变量或配置文件中获取，不要直接硬编码
  // 获取方式：https://help.aliyun.com/zh/dashscope/developer-reference/activate-dashscope-and-create-an-api-key
  apiKey: '',  // 使用后端代理时无需填写API key
  
  // 模型名称 - 可选的模型包括:
  // - qwen-flash: 通义千问极速版，低延迟输出
  // - qwen-turbo: 通义千问超大规模语言模型，适用于广泛的自然语言理解和生成任务
  // - qwen-plus: 通义千问增强版，平衡了响应速度与性能
  // - qwen-max: 通义千问最强版本，适用于复杂任务
  model: 'qwen-plus',
  
  // 请求参数
  parameters: {
    temperature: 0.8,     // 控制随机性 (0-2)，较高的值会使输出更加随机
    top_p: 0.9,          // 核采样参数 (0-1)
    max_tokens: 1500,    // 生成文本的最大长度
    result_format: 'message'  // 返回格式
  }
};

/**
 * 配置阿里云百炼API
 * @param {Object} config - 配置对象
 * @param {string} config.apiKey - API密钥
 * @param {string} config.model - 模型名称（可选）
 * @param {string} config.apiEndpoint - API端点（可选）
 */
function configureBailianAPI(config) {
  if (config.apiKey !== undefined) {
    BAILIAN_CONFIG.apiKey = config.apiKey;
  }
  if (config.model) {
    BAILIAN_CONFIG.model = config.model;
  }
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
  if (!BAILIAN_CONFIG.apiEndpoint) {
    throw new Error('API端点未配置。请先调用 configureBailianAPI() 设置API端点。');
  }
  
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
  
  // 构建请求体
  const requestBody = {
    messages: messages,
    temperature: BAILIAN_CONFIG.parameters.temperature,
    top_p: BAILIAN_CONFIG.parameters.top_p,
    max_tokens: BAILIAN_CONFIG.parameters.max_tokens
  };
  
  try {
    // 发送API请求
    const response = await fetch(BAILIAN_CONFIG.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(BAILIAN_CONFIG.apiKey ? { 'Authorization': `Bearer ${BAILIAN_CONFIG.apiKey}` } : {})
      },
      body: JSON.stringify(requestBody)
    });
    
    // 检查响应状态
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || errorData.message || response.statusText;
      throw new Error(`API请求失败: ${response.status} ${errorMessage}`);
    }
    
    // 解析响应
    const data = await response.json();
    
    // 检查API返回的错误
    if (data.error) {
      throw new Error(`API错误: ${data.error.message || data.error}`);
    }

    const responseContent = data.choices?.[0]?.message?.content;
    if (responseContent) {
      return responseContent;
    }

    throw new Error('API返回的数据格式不正确');
    
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
  if (!BAILIAN_CONFIG.apiEndpoint) {
    const error = new Error('API端点未配置。请先调用 configureBailianAPI() 设置API端点。');
    if (onError) onError(error);
    return;
  }
  
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
  
  // 构建请求体
  const requestBody = {
    messages: messages,
    temperature: BAILIAN_CONFIG.parameters.temperature,
    top_p: BAILIAN_CONFIG.parameters.top_p,
    max_tokens: BAILIAN_CONFIG.parameters.max_tokens,
    stream: true
  };
  
  try {
    // 发送API请求
    const response = await fetch(BAILIAN_CONFIG.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(BAILIAN_CONFIG.apiKey ? { 'Authorization': `Bearer ${BAILIAN_CONFIG.apiKey}` } : {})
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
    
    // 处理流式响应
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        if (onComplete) onComplete();
        break;
      }
      
      // 解码数据
      buffer += decoder.decode(value, { stream: true });
      
      // 处理SSE事件
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // 保留不完整的行
      
      for (const line of lines) {
        if (line.startsWith('data:')) {
          const jsonStr = line.substring(5).trim();
          
          if (jsonStr === '[DONE]') {
            if (onComplete) onComplete();
            return;
          }
          
          try {
            const data = JSON.parse(jsonStr);
            
            // 检查错误
            if (data.error) {
              throw new Error(`API错误: ${data.error.message || data.error}`);
            }

            const chunkContent = data.choices?.[0]?.delta?.content;
            if (chunkContent && onChunk) {
              onChunk(chunkContent);
            }
          } catch (parseError) {
            console.warn('解析SSE数据失败:', parseError, jsonStr);
          }
        }
      }
    }
    
  } catch (error) {
    console.error('阿里云百炼API流式调用失败:', error);
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
