#!/bin/bash

# RARE Compare 启动脚本
echo "🎨 启动 RARE Compare 时尚对比网站..."
echo ""

# 检查Python是否安装
if ! command -v python3 &> /dev/null; then
    if ! command -v python &> /dev/null; then
        echo "❌ 错误: 未找到Python"
        echo "请安装Python 3.x后重试"
        exit 1
    else
        PYTHON_CMD="python"
    fi
else
    PYTHON_CMD="python3"
fi

# 检查是否在正确的目录
if [ ! -f "index.html" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

# 检查data文件夹
if [ ! -d "data" ]; then
    echo "⚠️  警告: 未找到data文件夹"
    echo "请确保图片文件在data/文件夹中"
fi

echo "📁 工作目录: $(pwd)"
echo "🐍 Python版本: $($PYTHON_CMD --version)"
echo ""

# 启动服务器
exec $PYTHON_CMD server.py
