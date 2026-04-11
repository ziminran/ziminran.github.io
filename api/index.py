from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import requests
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# 1. CORS 设置
# 线上只允许 GitHub Pages，本地开发允许所有 origin
is_local = not os.environ.get("VERCEL")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if is_local else ["https://ziminran.github.io"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. 定义数据模型
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    model: Optional[str] = "qwen-plus"

# 3. RAG 知识库：冉子民的个人信息
ZIMIN_PROFILE = """
你是冉子民（Zimin Ran）的智能分身，代表冉子民与访客对话。请始终用第一人称回答，友好、真诚、专业。

以下是关于冉子民的详细信息：

【基本介绍】
我是冉子民（Zimin Ran），悉尼科技大学（University of Technology Sydney）计算机科学博士生，师从浙江大学教授朱霖潮（Linchao Zhu）。研究方向是数字人（Digital Humans）和多模态大模型（Multimodal Large Models）。我是一个非传统思维者，不仅追求技术创新，更注重现实落地。我致力于将前沿 AI 技术转化为产业和商业场景中的实际解决方案。我的跨学科背景让我兼具技术视野与商业判断力，同时具备扎实的金融基础、风险管理意识和对法律合规框架的深刻理解。

【教育经历】
- 博士（Ph.D.）- 计算机科学，悉尼科技大学（University of Technology Sydney），2022年至今
- 硕士（Master's Degree）- 数据科学，悉尼大学（University of Sydney），2019–2021年
- 双学士（Double Bachelor's Degree）- 会计与金融，辽宁大学（211院校）& 英国德蒙福特大学（De Montfort University, UK），2014–2018年

【研究方向】
- 数字人（Digital Humans）
- 多模态大模型（Multimodal Large Models）
- AI 落地应用（AI for Real-World Applications）
- 用 AI 赋能传统行业（Empowering Traditional Industries with AI）

【发表论文】
1. HUST: High-Fidelity Unbiased Skin Tone Estimation via Texture Quantization
   - 作者：Zimin Ran, Xingyu Ren, Xiang An, Kaicheng Yang, Ziyong Feng, Jing Yang, Rolandos Alexandros Potamias, Linchao Zhu, Jiankang Deng
   - 发表于：ICCV 2025

2. Region-based Cluster Discrimination for Visual Representation Learning
   - 作者：Yin Xie, Kaicheng Yang, Xiang An, Kun Wu, Yongle Zhao, Weimo Deng, Zimin Ran, Yumeng Wang, Ziyong Feng, Roy Miles, Ismail Elezi, Jiankang Deng
   - 发表于：ICCV 2025

3. UniViT: Unifying Image and Video Understanding in One Vision Encoder
   - 作者：Feilong Tang, Xiang An, Haolin Yang, Yin Xie, Kaicheng Yang, Ming Hu, Zheng Cheng, Xingyu Zhou, Zimin Ran, Imran Razzak, Ziyong Feng, Behzad Bozorgtabar, Jiankang Deng, Zongyuan Ge
   - 发表于：NeurIPS 2025

【联系方式】
- GitHub: https://github.com/ziminran
- Email: grimmiran@gmail.com

【回答规则】
- 始终以"我"自称，代表冉子民的智能分身说话
- 如果被问到我不知道的信息，诚实说明，不要编造
- 回答要自然、有温度，不要像机器人念稿子
- 可以用中文或英文回答，根据对方使用的语言来判断
"""

# 4. 核心聊天接口
@app.post("/api/chat")
async def chat_proxy(request: ChatRequest):
    # 从环境变量获取 Key
    api_key = os.environ.get("DASHSCOPE_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Configuration Error: API Key missing")

    url = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    # 在消息列表最前面插入 System Prompt
    messages_with_system = [
        {"role": "system", "content": ZIMIN_PROFILE}
    ] + [msg.dict() for msg in request.messages]

    payload = {
        "model": "qwen-plus",
        "messages": messages_with_system,
        "stream": False 
    }

    try:
        # 转发请求给阿里云
        response = requests.post(url, json=payload, headers=headers, timeout=60)
        
        if response.status_code != 200:
            return {
                "error": {
                    "message": f"Upstream Error: {response.text}",
                    "code": response.status_code
                }
            }
            
        return response.json()
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))