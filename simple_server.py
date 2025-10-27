#!/usr/bin/env python3
"""
最简单的HTTP服务器启动脚本
如果server.py不工作，请使用这个
"""

import http.server
import socketserver
import os

def main():
    # 切换到脚本目录
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    PORT = 8000
    
    print("🎨 启动 RARE Compare...")
    print(f"📁 目录: {os.getcwd()}")
    
    try:
        handler = http.server.SimpleHTTPRequestHandler
        with socketserver.TCPServer(("", PORT), handler) as httpd:
            print(f"✅ 服务器运行在: http://localhost:{PORT}")
            print("按 Ctrl+C 停止服务器")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n服务器已停止")
    except Exception as e:
        print(f"错误: {e}")

if __name__ == "__main__":
    main()
