#!/bin/bash

echo "🎨 启动 RARE Compare 时尚对比网站"
echo ""

# 检查Python
if command -v python3 &> /dev/null; then
    PYTHON="python3"
elif command -v python &> /dev/null; then
    PYTHON="python"
else
    echo "❌ 错误: 请先安装Python"
    exit 1
fi

echo "🐍 使用Python: $PYTHON"

# 检查文件
if [ ! -f "index.html" ]; then
    echo "❌ 错误: 请在项目目录运行此脚本"
    exit 1
fi

# 停止已有的服务器
echo "🛑 停止旧的服务器进程..."
pkill -f "http.server" 2>/dev/null || true

# 启动新服务器
echo "🚀 启动服务器..."
echo "📁 目录: $(pwd)"
echo "🌐 地址: http://localhost:8000"
echo ""
echo "💡 提示:"
echo "   - 浏览器打开 http://localhost:8000"
echo "   - 按 Ctrl+C 停止服务器"
echo "   - 确保 data/ 文件夹包含图片"
echo ""


# 启动服务器
PORT=8000
while lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null; do
    PORT=$((PORT + 1))
done

echo "🚀 在端口 $PORT 启动服务器..."
(sleep 3 && open "http://localhost:$PORT" 2>/dev/null) &
$PYTHON -m http.server $PORT
