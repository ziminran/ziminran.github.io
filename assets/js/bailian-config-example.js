/**
 * 阿里云百炼API配置示例
 * Alibaba Cloud Bailian API Configuration Example
 * 
 * 使用方法：
 * 1. 复制此文件内容到 index.html 的配置部分
 * 2. 将 YOUR_API_KEY_HERE 替换为您的真实API密钥
 * 3. 根据需要调整其他参数
 * 
 * ⚠️ 安全警告：
 * 不要将包含真实API密钥的文件提交到公共代码仓库！
 * 生产环境建议使用后端代理服务。
 */

// 基础配置示例
configureBailianAPI({
  apiKey: 'YOUR_API_KEY_HERE',  // 必填：您的API密钥
  model: 'qwen-turbo'           // 可选：模型选择
});

// 完整配置示例（包含所有可选参数）
configureBailianAPI({
  // API密钥（必填）
  apiKey: 'YOUR_API_KEY_HERE',
  
  // 模型选择（可选）
  // 选项：'qwen-turbo', 'qwen-plus', 'qwen-max', 'qwen-long'
  model: 'qwen-turbo',
  
  // API端点（可选，默认为华东1杭州）
  // 华东1（杭州）: https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation
  // 华北2（北京）: https://dashscope-beijing.aliyuncs.com/api/v1/services/aigc/text-generation/generation
  apiEndpoint: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
  
  // 高级参数（可选）
  parameters: {
    temperature: 0.8,         // 随机性控制 (0-2)
    top_p: 0.9,              // 核采样参数 (0-1)
    max_tokens: 1500,        // 最大生成长度
    result_format: 'message' // 返回格式
  }
});

// 针对不同场景的配置示例

// 1. 事实性问答（更准确、更一致）
configureBailianAPI({
  apiKey: 'YOUR_API_KEY_HERE',
  model: 'qwen-plus',
  parameters: {
    temperature: 0.3,  // 低随机性
    top_p: 0.8,
    max_tokens: 1000
  }
});

// 2. 创意对话（更有趣、更多样）
configureBailianAPI({
  apiKey: 'YOUR_API_KEY_HERE',
  model: 'qwen-plus',
  parameters: {
    temperature: 1.0,  // 高随机性
    top_p: 0.95,
    max_tokens: 2000
  }
});

// 3. 长文本理解
configureBailianAPI({
  apiKey: 'YOUR_API_KEY_HERE',
  model: 'qwen-long',  // 使用长上下文模型
  parameters: {
    temperature: 0.7,
    top_p: 0.9,
    max_tokens: 2000
  }
});

// 4. 最佳性能
configureBailianAPI({
  apiKey: 'YOUR_API_KEY_HERE',
  model: 'qwen-max',   // 使用最强模型
  parameters: {
    temperature: 0.8,
    top_p: 0.9,
    max_tokens: 1500
  }
});

// 5. 使用后端代理（推荐用于生产环境）
configureBailianAPI({
  apiEndpoint: '/api/chat',     // 指向您的后端API
  apiKey: 'dummy-key',          // 不需要真实key，由后端处理
  model: 'qwen-turbo'
});
