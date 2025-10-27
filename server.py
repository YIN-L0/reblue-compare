#!/usr/bin/env python3
"""
简单的本地HTTP服务器，用于运行RARE Compare网站
"""

import http.server
import socketserver
import os
import sys
import webbrowser
import threading
import time

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # 允许跨域请求
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def log_message(self, format, *args):
        # 简化日志输出
        pass

def find_free_port(start_port=8000, max_port=8010):
    """找到可用端口"""
    for port in range(start_port, max_port + 1):
        try:
            with socketserver.TCPServer(("", port), None) as test_server:
                return port
        except OSError:
            continue
    return None

def open_browser_delayed(url, delay=2):
    """延迟打开浏览器"""
    def delayed_open():
        time.sleep(delay)
        try:
            webbrowser.open(url)
        except Exception:
            pass
    
    thread = threading.Thread(target=delayed_open)
    thread.daemon = True
    thread.start()

def main():
    # 确保在项目根目录运行
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    # 检查必要文件
    if not os.path.exists('index.html'):
        print("❌ 错误: 未找到 index.html 文件")
        print("请确保在项目根目录运行此脚本")
        sys.exit(1)
    
    # 找到可用端口
    PORT = find_free_port()
    if PORT is None:
        print("❌ 无法找到可用端口 (8000-8010)")
        sys.exit(1)
    
    try:
        # 启动服务器
        with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
            print(f"🎨 RARE Compare 服务器启动成功!")
            print(f"📁 服务目录: {os.getcwd()}")
            print(f"🌐 访问地址: http://localhost:{PORT}")
            print(f"📱 移动端访问: http://0.0.0.0:{PORT}")
            
            if os.path.exists('data'):
                print(f"✅ 找到 data 文件夹")
            else:
                print(f"⚠️  警告: 未找到 data 文件夹")
            
            print("\n💡 使用说明:")
            print("   - 按 Ctrl+C 停止服务器")
            print("   - 确保图片文件在 data/ 文件夹中")
            
            # 延迟打开浏览器
            open_browser_delayed(f'http://localhost:{PORT}')
            
            print(f"\n✅ 服务器运行在端口 {PORT}")
            print("🚀 浏览器将在2秒后自动打开...")
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n\n👋 服务器已停止")
        sys.exit(0)
    except Exception as e:
        print(f"❌ 启动服务器失败: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
