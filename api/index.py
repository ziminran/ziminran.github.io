from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import requests

app = FastAPI()

# 1. CORS 设置：允许你的 GitHub Pages 访问
# 必须包含你的具体域名，不要用 "*"
origins = [
    "https://ziminran.github.io",
    "http://localhost:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
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

# 3. 核心聊天接口
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
    
    # 强制指定模型
    payload = {
        "model": "qwen-plus",
        "messages": [msg.dict() for msg in request.messages],
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