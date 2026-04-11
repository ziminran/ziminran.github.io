#!/bin/bash
# 启动本地开发服务器
# 用法: ./dev.sh

cd "$(dirname "$0")"

# 检查端口 8000 是否已占用
if lsof -ti :8000 > /dev/null 2>&1; then
  echo "API server already running on port 8000"
else
  echo "Starting API server on port 8000..."
  /Users/jike/opt/anaconda3/bin/uvicorn api.index:app --host 0.0.0.0 --port 8000 &
  sleep 1
  echo "API server started"
fi

echo "Opening homepage..."
open index.html
