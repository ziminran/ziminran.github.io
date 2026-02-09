# Zimin Ran - Personal Homepage

A clean, Wikipedia-style personal homepage showcasing education background, publications, and professional information.

## Education Background

- **Ph.D.** - Computer Science, University of Technology Sydney
- **Master's Degree** - Data Science, University of Sydney
- **Double Bachelor's Degree** - Accounting and Finance, Liaoning University (211) and De Montfort University, UK

## Publications

1. Zimin Ran, Xingyu Ren, Xiang An, Kaicheng Yang, Ziyong Feng, Jing Yang, Rolandos Alexandros Potamias, Linchao Zhu, Jiankang Deng. "HUST: High-Fidelity Unbiased Skin Tone Estimation via Texture Quantization." In ICCV, 2025.

2. Yin Xie, Kaicheng Yang, Xiang An, Kun Wu, Yongle Zhao, Weimo Deng, Zimin Ran, Yumeng Wang, Ziyong Feng, Roy Miles, Ismail Elezi, Jiankang Deng. "Region-based Cluster Discrimination for Visual Representation Learning." In ICCV, 2025.

3. Feilong Tang, Xiang An, Haolin Yang, Yin Xie, Kaicheng Yang, Ming Hu, Zheng Cheng, Xingyu Zhou, Zimin Ran, Imran Razzak, Ziyong Feng, Behzad Bozorgtabar, Jiankang Deng, Zongyuan Ge. "UniViT: Unifying Image and Video Understanding in One Vision Encoder." In NeurIPS, 2025.

## Deployment Instructions

### Local Deployment

You can deploy this personal homepage locally using any of the following methods:

#### Method 1: Python HTTP Server (Recommended)

1. Open a terminal and navigate to the project directory:
   ```bash
   cd aha_rabbit.github.io
   ```

2. Start a simple HTTP server:
   
   **Python 3:**
   ```bash
   python3 -m http.server 8000
   ```
   
   **Python 2:**
   ```bash
   python -m SimpleHTTPServer 8000
   ```

3. Open your browser and visit: `http://localhost:8000`

#### Method 2: Node.js HTTP Server

1. Install `http-server` globally (one-time setup):
   ```bash
   npm install -g http-server
   ```

2. Navigate to the project directory and start the server:
   ```bash
   cd aha_rabbit.github.io
   http-server -p 8000
   ```

3. Open your browser and visit: `http://localhost:8000`

#### Method 3: PHP Built-in Server

1. Navigate to the project directory:
   ```bash
   cd aha_rabbit.github.io
   ```

2. Start PHP's built-in server:
   ```bash
   php -S localhost:8000
   ```

3. Open your browser and visit: `http://localhost:8000`

#### Method 4: VS Code Live Server

1. Install the "Live Server" extension in VS Code
2. Open the project folder in VS Code
3. Right-click on `index.html` and select "Open with Live Server"
4. The page will automatically open in your default browser

### GitHub Pages Deployment

Deploy your personal homepage to GitHub Pages for free hosting:

#### Step 1: Prepare Your Repository

1. Make sure your repository is named `username.github.io` (where `username` is your GitHub username)
   - For example: `ziminran.github.io`

2. Ensure all files are committed and pushed to GitHub:
   ```bash
   git add .
   git commit -m "Update personal homepage"
   git push origin main
   ```

#### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/username/username.github.io`
2. Click on **Settings** tab
3. Scroll down to the **Pages** section in the left sidebar
4. Under **Source**, select:
   - **Branch:** `main` (or `master`)
   - **Folder:** `/ (root)`
5. Click **Save**

#### Step 3: Access Your Website

- Your website will be available at: `https://username.github.io`
- For example: `https://ziminran.github.io`
- It may take a few minutes for the site to be published initially

#### Using a Custom Domain (Optional)

1. Purchase a domain from any domain registrar
2. In your repository, create a file named `CNAME` in the root directory with your domain:
   ```
   yourdomain.com
   ```
3. Configure your domain's DNS settings:
   - Add an `A` record pointing to GitHub Pages IP addresses:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - Or add a `CNAME` record pointing to `username.github.io`
4. In GitHub repository settings under Pages, enter your custom domain and enable HTTPS

## 阿里云百炼API集成教程

本项目集成了阿里云百炼（Bailian）API，为个人主页添加了智能对话功能。以下是详细的配置和使用教程。

### 什么是阿里云百炼？

阿里云百炼（DashScope）是阿里云推出的大模型服务平台，提供了通义千问（Qwen）等先进的大语言模型API。通过百炼API，您可以轻松地将AI对话功能集成到您的网站中。

### 第一步：获取API密钥

1. **注册阿里云账号**
   - 访问 [阿里云官网](https://www.aliyun.com/) 注册账号
   - 如果已有账号，直接登录

2. **开通DashScope服务**
   - 访问 [DashScope控制台](https://dashscope.console.aliyun.com/)
   - 首次使用需要开通服务（提供免费额度）

3. **创建API Key**
   - 在DashScope控制台，进入"API-KEY管理"页面
   - 点击"创建新的API-KEY"
   - 复制生成的API Key并妥善保管（不要分享给他人）
   - 详细步骤参考：[官方文档](https://help.aliyun.com/zh/dashscope/developer-reference/activate-dashscope-and-create-an-api-key)

### 第二步：配置API密钥

有三种方式配置API密钥：

#### 方式一：在页面内配置（推荐）

1. 打开主页，找到“Ask Zimin Ran anything”对话框
2. 点击右上角 **API Key** 按钮
3. 在弹窗中输入您的API Key（仅保存在本地浏览器）

#### 方式二：直接在代码中配置（仅用于测试）

**⚠️ 警告：不建议在生产环境中将API密钥硬编码在前端代码中，这会导致安全风险。**

编辑 `index.html` 文件，找到以下代码段：

```javascript
// 配置阿里云百炼API
// configureBailianAPI({
//   apiKey: 'YOUR_API_KEY_HERE',
//   model: 'qwen-turbo'
// });
```

取消注释并填入您的API密钥：

```javascript
// 配置阿里云百炼API
configureBailianAPI({
  apiKey: 'sk-your-actual-api-key-here',  // 替换为您的真实API Key
  model: 'qwen-turbo'  // 可选：qwen-turbo, qwen-plus, qwen-max
});
```

#### 方式三：使用后端代理（推荐用于生产环境）

为了安全起见，建议创建一个后端服务来代理API调用：

1. **创建后端API端点**（例如使用Node.js + Express）：

```javascript
// server.js
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const response = await axios.post(
      'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DASHSCOPE_API_KEY}`,
          'X-DashScope-SSE': 'disable'
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

2. **修改前端配置**，将 `apiEndpoint` 指向您的后端：

```javascript
configureBailianAPI({
  apiEndpoint: '/api/chat',  // 指向您的后端API
  apiKey: 'dummy'  // 不需要真实的key，后端会处理
});
```

### 第三步：选择合适的模型

阿里云百炼提供多个模型选项：

| 模型名称 | 特点 | 适用场景 |
|---------|------|---------|
| `qwen-flash` | 极速响应 | 低延迟对话、快速问答 |
| `qwen-turbo` | 快速响应，成本低 | 一般对话、快速问答 |
| `qwen-plus` | 性能均衡 | 复杂对话、专业问答 |
| `qwen-max` | 最强性能 | 高难度任务、创意生成 |
| `qwen-long` | 超长上下文 | 长文档理解 |

修改模型配置：

```javascript
configureBailianAPI({
  apiKey: 'your-api-key',
  model: 'qwen-plus'  // 更改为您想使用的模型
});
```

### 使用 qwen-flash 让对话框正常回复

如果对话框提示“抱歉，我暂时无法回复”，请确认以下配置是否完成（本项目默认使用 `qwen-flash`）：

1. **在页面内配置 API Key**  
   打开页面后点击右上角 **API Key** 按钮输入密钥，刷新页面后再次发送消息。

2. **在代码中显式指定 qwen-flash**（仅用于测试，生产环境请避免硬编码）：

```javascript
// 配置阿里云百炼API（qwen-flash）
configureBailianAPI({
  apiKey: 'sk-YOUR-API-KEY-HERE',
  model: 'qwen-flash',
  parameters: {
    result_format: 'message'
  }
});
```

3. **使用后端代理时**，确保请求体包含 `model: 'qwen-flash'` 且 `parameters.result_format` 为 `message`。

### 第四步：自定义API参数

您可以调整API参数以获得更好的效果：

```javascript
configureBailianAPI({
  apiKey: 'your-api-key',
  model: 'qwen-turbo',
  parameters: {
    temperature: 0.8,    // 控制随机性 (0-2)，值越高越随机
    top_p: 0.9,         // 核采样参数 (0-1)
    max_tokens: 1500,   // 生成文本的最大长度
    result_format: 'message'
  }
});
```

**参数说明：**

- **temperature**: 控制输出的随机性
  - 0.1-0.5: 更确定、更一致的输出（适合事实性问答）
  - 0.6-0.9: 平衡创造性和一致性
  - 1.0-2.0: 更有创意、更多样化的输出（适合创意写作）

- **top_p**: 核采样，控制词汇选择范围
  - 0.1-0.5: 更保守的词汇选择
  - 0.7-0.95: 平衡的词汇选择（推荐）
  - 0.95-1.0: 更广泛的词汇选择

- **max_tokens**: 限制生成文本的长度
  - 建议范围：500-2000

### 第五步：测试对话功能

1. 在浏览器中打开您的个人主页
2. 找到"Ask Zimin Ran anything"对话框
3. 输入一条消息，例如："你好"
4. 点击"发送"按钮
5. 系统会调用阿里云百炼API并返回AI的回复

### 新教程：一步一步排查并修正 API 调用（确保正确输出对话）

如果对话没有正常返回内容，请按以下步骤定位问题并修正，直到能看到 AI 回复：

1. **确认脚本已加载**
   - 打开浏览器控制台（F12 → Console），输入 `typeof sendMessageToBailian`。
   - 结果应为 `function`；若为 `undefined`，检查 `index.html` 中是否已加载 `assets/js/bailian-api.js`。

2. **确认 API Key 已保存**
   - 点击对话框右上角 **API Key** 按钮，输入并保存密钥。
   - 刷新页面后发送一条消息；若仍提示未配置，说明密钥未保存，请重新输入。

3. **确认配置与模型**
   - 先通过页面 **API Key** 按钮完成密钥配置，再在控制台执行（仅用于本地测试）：
     ```javascript
     configureBailianAPI({
       model: 'qwen-flash',
       parameters: { result_format: 'message' }
     });
     ```
   - ⚠️ 建议优先使用页面内 **API Key** 按钮配置；如需在控制台测试，请勿在公共设备操作，测试后刷新页面清理记录，并避免分享包含密钥的截图或日志。
   - 再次发送消息，确保返回的是 `output.choices[0].message.content`。

4. **检查 API 端点是否正确**
   - 默认端点为华东 1 (杭州)，如在北京区请改为（可在已配置 API Key 后单独执行）：
     ```javascript
     configureBailianAPI({
       apiEndpoint: 'https://dashscope-beijing.aliyuncs.com/api/v1/services/aigc/text-generation/generation'
     });
     ```

5. **检查网络请求与返回数据**
   - 打开 DevTools → Network，发送一条消息，查看请求状态应为 `200`。
   - 点击该请求，在 **Response/Preview** 中查看 JSON；返回数据需包含 `output.choices[0].message.content`，否则说明参数或模型配置不正确。

6. **如果仍失败**
   - 401/403：API Key 无效或权限未开通。
   - CORS：使用后端代理方式（见上文“方式三”）。
   - 其它错误：查看 Console 的错误信息并对应修复。

### 高级功能：流式输出

如果您想使用流式输出（逐字显示），可以使用 `sendMessageToBailianStream` 函数：

```javascript
sendMessageToBailianStream(
  userMessage,
  conversationHistory,
  // 接收到文本片段时的回调
  (chunk) => {
    console.log('收到文本片段:', chunk);
    // 在这里更新UI显示文本
  },
  // 完成时的回调
  () => {
    console.log('AI回复完成');
  },
  // 错误时的回调
  (error) => {
    console.error('出错:', error);
  }
);
```

### API费用说明

阿里云百炼提供：
- **免费额度**：新用户可获得一定量的免费调用额度
- **按量计费**：超出免费额度后按实际使用量计费
- **定价**：不同模型价格不同，详见[官方定价页面](https://help.aliyun.com/zh/dashscope/developer-reference/tongyi-thousand-questions-metering-and-billing)

### 故障排查

#### 问题1：API调用失败，返回401错误

**原因**：API密钥无效或未配置

**解决方案**：
- 检查API密钥是否正确复制
- 确认API密钥在DashScope控制台中处于启用状态
- 验证 `configureBailianAPI()` 是否正确调用

#### 问题2：CORS跨域错误

**原因**：前端直接调用API时可能遇到跨域问题

**解决方案**：
- 使用后端代理（推荐方式三）
- 或在本地开发时使用CORS代理

#### 问题3：API返回空响应

**原因**：请求参数不正确或网络问题

**解决方案**：
- 检查浏览器控制台的错误信息
- 验证API端点URL是否正确
- 确认网络连接正常

#### 问题4：提示"API密钥未配置"

**原因**：未调用 `configureBailianAPI()` 或配置未生效

**解决方案**：
- 确保在发送消息前调用了 `configureBailianAPI()`
- 检查脚本加载顺序，确保 `bailian-api.js` 先加载

### 安全建议

1. **不要在前端硬编码API密钥**
   - 使用环境变量或配置文件
   - 通过后端代理调用API

2. **设置API密钥使用限制**
   - 在DashScope控制台设置调用频率限制
   - 设置每日/每月使用上限

3. **监控API使用情况**
   - 定期检查API调用日志
   - 设置用量告警

4. **使用HTTPS**
   - 确保网站使用HTTPS协议
   - 保护API通信安全

### 相关资源

- [阿里云百炼官方文档](https://help.aliyun.com/zh/dashscope/)
- [API参考文档](https://help.aliyun.com/zh/dashscope/developer-reference/api-details)
- [通义千问模型介绍](https://help.aliyun.com/zh/dashscope/developer-reference/model-introduction)
- [SDK和示例代码](https://help.aliyun.com/zh/dashscope/developer-reference/sdk-overview)

## Features

- 📱 Responsive design (mobile-friendly)
- 🎨 Wikipedia-style clean interface
- 📚 Dedicated sections for education and publications
- 🔗 Social media links (GitHub, Email)
- 🌐 Multi-language support (Chinese)
- 💬 AI-powered chat using Alibaba Cloud Bailian API

## Customization

To customize this homepage for your own use:

1. **Edit `index.html`:**
   - Update personal information in the main content area
   - Modify the infobox with your details
   - Update links to your GitHub and email

2. **Replace profile picture:**
   - Replace `assets/img/profile_pic.svg` with your own image (supports .jpg, .png, or .svg formats)
   - Update the image reference in `index.html` if you change the filename or format

3. **Update `README.md`:**
   - Replace education and publication information with your own

## License

This project is open source and available for personal use.
