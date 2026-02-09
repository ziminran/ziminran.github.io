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

为了安全起见，本项目不再提供前端 API Key 输入框。请使用后端代理（推荐 Cloudflare Workers）在服务端保存密钥并转发请求。

#### 推荐方式：Cloudflare Workers 代理

1. **创建 Worker（复制 `cloudflare-worker.js`）**，并安装/登录 Wrangler：

   ```bash
   npm install -g wrangler
   wrangler login
   ```

2. **部署 Worker 并设置密钥**（也可在 Cloudflare Dashboard 中设置 Secret）：

   ```bash
   wrangler deploy --name my-chat-proxy cloudflare-worker.js
   wrangler secret put DASHSCOPE_API_KEY
   ```

3. **部署后记录 Worker 地址**，例如：
   - `https://my-chat-proxy.workers.dev/chat`

4. **修改前端配置**，将 `apiEndpoint` 指向您的 Worker：

```javascript
configureBailianAPI({
  apiEndpoint: 'https://my-chat-proxy.workers.dev/chat',
  model: 'qwen-plus'
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
  apiEndpoint: 'https://my-chat-proxy.workers.dev/chat',
  model: 'qwen-plus'  // 更改为您想使用的模型
});
```

### 如果对话框无法回复

如果对话框提示“抱歉，我暂时无法回复”，请确认以下配置是否完成：

1. **Worker 已部署并设置 `DASHSCOPE_API_KEY`**  
2. **前端 `apiEndpoint` 已更新为 Worker 地址**  
3. **浏览器控制台中无 CORS 或网络错误**

### 第四步：自定义API参数

您可以调整API参数以获得更好的效果：

```javascript
configureBailianAPI({
  apiEndpoint: 'https://my-chat-proxy.workers.dev/chat',
  model: 'qwen-plus',
  parameters: {
    temperature: 0.8,    // 控制随机性 (0-2)，值越高越随机
    top_p: 0.9,         // 核采样参数 (0-1)
    max_tokens: 1500    // 生成文本的最大长度（后端会限制上限）
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

**原因**：Worker 未设置 `DASHSCOPE_API_KEY` 或密钥无效

**解决方案**：
- 检查 Cloudflare Worker 的环境变量配置
- 确认API密钥在DashScope控制台中处于启用状态

#### 问题2：CORS跨域错误

**原因**：Worker 未允许 `https://ziminran.github.io` 作为跨域来源

**解决方案**：
- 检查 Worker 代码中的 `Access-Control-Allow-Origin` 设置
- 确认请求来源为 `https://ziminran.github.io`

#### 问题3：API返回空响应

**原因**：请求参数不正确或网络问题

**解决方案**：
- 检查浏览器控制台的错误信息
- 验证API端点URL是否正确
- 确认网络连接正常

#### 问题4：提示"API端点未配置"

**原因**：未调用 `configureBailianAPI()` 或配置未生效

**解决方案**：
- 确保在发送消息前调用了 `configureBailianAPI()` 并设置 `apiEndpoint`
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
