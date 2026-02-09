/**
 * Cloudflare Worker代理配置示例
 *
 * 使用方法：
 * 1. 将 WORKER_CHAT_ENDPOINT 改为你的Worker地址
 * 2. 可按需调整 temperature 与 max_tokens
 */

configureBailianAPI({
  // 请将占位符替换为你的 Worker 地址
  apiEndpoint: 'https://your-worker-name.your-account.workers.dev/chat',
  parameters: {
    temperature: 0.8,
    max_tokens: 500
  }
});
