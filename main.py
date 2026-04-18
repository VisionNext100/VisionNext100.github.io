import os
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# 加载当前目录下的 .env 文件
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"],  
    allow_headers=["*"],  
    allow_credentials=False, 
)

class ColorData(BaseModel):
    colors_str: str

@app.post("/api/analyze-colors")
async def analyze_colors(data: ColorData):
    
    api_key = os.getenv("OPENAI_API_KEY")
    
    if not api_key or api_key == "sk-your_api_key_here":
        raise HTTPException(status_code=500, detail="未配置 API Key，请检查 .env 文件。")

    url = "https://api.openai-proxy.org/v1/chat/completions"
    
    prompt = f"我通过 K-means 算法对一张图片提取了多个颜色聚类中心，颜色值如下：{data.colors_str}。你作为一名色彩学专家，请判断这几个颜色搭配在一起是否和谐，并简要给出分析理由（150字以内）。\n注意：在回复中提到某个颜色时，请务必用直观的文字描述该颜色（例如：'c1的浅蓝色'或'c3的暗红色'），不要只写代号。"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {"role": "system", "content": "你是一个专业的视觉设计和色彩搭配专家。"},
            {"role": "user", "content": prompt}
        ]
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        
        if not response.ok:
            print("====== 代理平台报错详情 =====")
            print(f"状态码: {response.status_code}")
            print(f"错误信息: {response.text}")
            
        response.raise_for_status() 
        result = response.json()
        reply_text = result["choices"][0]["message"]["content"]
        return {"success": True, "reply": reply_text}
        
    except Exception as e:
        print(f"请求代码执行失败: {e}")
        raise HTTPException(status_code=500, detail="大模型接口调用失败，请查看后端控制台的报错详情。")