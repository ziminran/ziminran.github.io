"""
Qwen Flash API 推理演示
这个脚本展示如何使用 Qwen Flash 模型进行文本推理
"""

import requests
import json

# API 配置
API_KEY = "sk-0b8ef38f991c450ca9e56a45f9c1b324"
API_URL = "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation"

def chat_with_qwen(prompt, model="qwen-turbo", stream=False):
    """
    与 Qwen Flash 模型进行对话
    
    参数:
        prompt (str): 用户输入的提示词
        model (str): 模型名称，默认 "qwen-turbo"
        stream (bool): 是否使用流式输出
    
    返回:
        str: 模型的回复
    """
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": model,
        "input": {
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        },
        "parameters": {
            "result_format": "message"
        }
    }
    
    try:
        response = requests.post(API_URL, headers=headers, json=payload)
        response.raise_for_status()
        
        result = response.json()
        
        # 提取回复内容
        if "output" in result and "choices" in result["output"]:
            return result["output"]["choices"][0]["message"]["content"]
        else:
            return f"错误: {result}"
            
    except requests.exceptions.RequestException as e:
        return f"请求失败: {str(e)}"
    except Exception as e:
        return f"发生错误: {str(e)}"


def chat_with_qwen_stream(prompt, model="qwen-turbo"):
    """
    与 Qwen Flash 模型进行流式对话
    
    参数:
        prompt (str): 用户输入的提示词
        model (str): 模型名称
    """
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "X-DashScope-SSE": "enable"
    }
    
    payload = {
        "model": model,
        "input": {
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        },
        "parameters": {
            "result_format": "message",
            "incremental_output": True
        }
    }
    
    try:
        response = requests.post(API_URL, headers=headers, json=payload, stream=True)
        response.raise_for_status()
        
        print("模型回复: ", end="", flush=True)
        
        for line in response.iter_lines():
            if line:
                line = line.decode('utf-8')
                if line.startswith('data:'):
                    data = json.loads(line[5:])
                    if "output" in data and "choices" in data["output"]:
                        content = data["output"]["choices"][0]["message"]["content"]
                        print(content, end="", flush=True)
        
        print("\n")
        
    except Exception as e:
        print(f"流式请求失败: {str(e)}")


def main():
    """主函数：展示不同的使用方式"""
    
    print("=" * 60)
    print("Qwen Flash API 推理演示")
    print("=" * 60)
    
    # 示例 1: 简单问答
    print("\n【示例 1: 简单问答】")
    question1 = "什么是人工智能？请用一句话简单解释。"
    print(f"问题: {question1}")
    answer1 = chat_with_qwen(question1)
    print(f"回答: {answer1}\n")
    
    # 示例 2: 代码生成
    print("\n【示例 2: 代码生成】")
    question2 = "用 Python 写一个快速排序算法"
    print(f"问题: {question2}")
    answer2 = chat_with_qwen(question2)
    print(f"回答: {answer2}\n")
    
    # 示例 3: 流式输出
    print("\n【示例 3: 流式输出】")
    question3 = "介绍一下量子计算的基本原理"
    print(f"问题: {question3}")
    chat_with_qwen_stream(question3)
    
    # 示例 4: 交互式对话
    print("\n【示例 4: 交互式对话】")
    print("输入 'quit' 或 'exit' 退出")
    print("-" * 60)
    
    while True:
        user_input = input("\n你: ").strip()
        
        if user_input.lower() in ['quit', 'exit', '退出']:
            print("再见！")
            break
        
        if not user_input:
            continue
        
        response = chat_with_qwen(user_input)
        print(f"Qwen: {response}")


if __name__ == "__main__":
    main()