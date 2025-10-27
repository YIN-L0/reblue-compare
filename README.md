# RARE Compare - 时尚对比网站

一个现代化的时尚单品对比网站，用于比较单品图、虚拟试穿效果和官方lookbook大片。

## ✨ 特性

- 🎨 **现代时尚设计** - 简约配色，优雅字体
- 📱 **响应式布局** - 支持桌面端和移动端
- 🖼️ **三列对比视图** - 单品图 | 虚拟试穿 | 官方大片
- ⚡ **快速切换** - 点击缩略图或使用键盘导航
- 🔍 **图片预览** - 高质量图片展示
- 📊 **套装管理** - 清晰的套装组织和选择

## 🚀 快速开始

### 方法一：一键启动（推荐）

```bash
cd /Users/a12345/Desktop/rare-compare
./start_server.sh
```

### 方法二：Python命令行

```bash
cd /Users/a12345/Desktop/rare-compare
python3 -m http.server 8000
```

### 方法三：自定义脚本

```bash
cd /Users/a12345/Desktop/rare-compare
python3 server.py        # 功能丰富版本
# 或
python3 simple_server.py # 简化版本
```

启动后浏览器会自动打开，或手动访问 `http://localhost:8000`

### 🔧 故障排除

如果遇到"ERR_EMPTY_RESPONSE"错误：

1. **检查Python版本**：
   ```bash
   python3 --version
   ```

2. **使用最简单的方法**：
   ```bash
   python3 -m http.server 8000
   ```

3. **检查端口占用**：
   ```bash
   lsof -i :8000
   ```

4. **换个端口**：
   ```bash
   python3 -m http.server 8001
   ```

## 📁 项目结构

```
rare-compare/
├── index.html          # 主页面
├── styles.css          # 样式文件
├── script.js           # JavaScript逻辑
├── server.py           # Python本地服务器
├── README.md           # 说明文档
└── data/               # 图片数据文件夹
    ├── RR2256120200/   # 套装文件夹
    │   ├── RR2256120200.jpg     # 单品图 (RR开头)
    │   ├── 250618RARE0477.jpg   # 官方大片 (2506开头)
    │   └── ...
    └── ...
```

## 🎯 使用说明

### 图片分类规则

- **单品图**：文件名以 `RR` 开头的图片，显示在左侧
- **官方大片**：文件名以 `2506` 开头的图片，显示在右侧  
- **虚拟试穿**：中间区域预留，暂时显示占位符

### 操作方法

1. **选择套装**：点击顶部的套装卡片
2. **切换图片**：点击缩略图或使用左右箭头键
3. **键盘快捷键**：
   - `←/→` 切换图片
   - `Esc` 取消选择

### 数据格式

每个套装文件夹应包含：
- 至少一张单品图（RR开头）或官方大片（2506开头）
- 支持 `.jpg`、`.jpeg`、`.png` 格式
- 文件夹名称作为套装标识

## 🎨 设计特色

### 配色方案
- **主色调**：纯黑 (#000000) 
- **背景色**：浅灰 (#fafafa)
- **强调色**：现代红 (#ff4757)
- **文字色**：深灰渐变

### 字体选择
- **标题字体**：Playfair Display (优雅衬线)
- **正文字体**：Inter (现代无衬线)

### 交互效果
- 悬停动画和转换效果
- 卡片阴影和3D效果
- 平滑的图片切换
- 响应式缩略图

## 🔧 自定义配置

### 添加新套装

1. 在 `data/` 文件夹创建新的套装文件夹
2. 按命名规则添加图片文件
3. 更新 `script.js` 中的 `folderContents` 对象

### 修改样式

编辑 `styles.css` 文件中的 CSS 变量：

```css
:root {
    --color-primary: #000000;     /* 主色调 */
    --color-accent: #ff4757;      /* 强调色 */
    --color-background: #fafafa;  /* 背景色 */
    /* ... 更多变量 */
}
```

### 功能扩展

- 在 `script.js` 中添加新的图片处理逻辑
- 修改 `index.html` 添加新的UI组件
- 集成后端API实现动态数据加载

## 📱 浏览器支持

- ✅ Chrome 60+
- ✅ Firefox 55+  
- ✅ Safari 12+
- ✅ Edge 79+

## 🤝 技术栈

- **前端**：HTML5, CSS3, Vanilla JavaScript
- **字体**：Google Fonts (Inter, Playfair Display)
- **服务器**：Python HTTP Server
- **图片格式**：JPG, JPEG, PNG

## 📄 许可证

MIT License - 自由使用和修改

---

## 🆘 常见问题

**Q: 图片无法显示？**
A: 确保使用本地服务器运行，浏览器不允许直接访问文件系统

**Q: 如何添加虚拟试穿图片？**
A: 修改 `script.js` 中的图片分类逻辑，添加虚拟试穿图片的识别规则

**Q: 可以修改配色方案吗？**
A: 可以，编辑 `styles.css` 中的 CSS 变量即可

**Q: 支持视频文件吗？**
A: 当前版本仅支持图片，可以扩展支持视频格式

---

💡 **提示**：建议使用Chrome或Firefox浏览器以获得最佳体验
