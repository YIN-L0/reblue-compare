# 🚀 GitHub Pages 部署指南

## 📋 部署步骤

### 1. 创建GitHub仓库

1. 访问 [GitHub.com](https://github.com) 并登录您的账户
2. 点击右上角的 **"+"** 按钮，选择 **"New repository"**
3. 填写仓库信息：
   - **Repository name**: `rare-compare`
   - **Description**: `RARE AI+ | AI赋能时尚对比平台`
   - **Visibility**: 选择 **Public** (公开仓库)
   - **不要** 勾选 "Add a README file"（我们已经有了）
4. 点击 **"Create repository"**

### 2. 推送代码到GitHub

在终端中执行以下命令（替换YOUR_USERNAME为您的GitHub用户名）：

```bash
# 添加远程仓库地址
git remote add origin https://github.com/YOUR_USERNAME/rare-compare.git

# 推送代码到GitHub
git branch -M main
git push -u origin main
```

### 3. 配置GitHub Pages

1. 在GitHub仓库页面，点击 **"Settings"** 标签
2. 在左侧菜单中找到 **"Pages"**
3. 在 **"Source"** 部分：
   - 选择 **"Deploy from a branch"**
   - **Branch**: 选择 **"main"**
   - **Folder**: 选择 **"/ (root)"**
4. 点击 **"Save"**

### 4. 等待部署完成

- GitHub Pages 通常需要几分钟来构建和部署
- 部署完成后，GitHub会显示网站链接
- 链接格式：`https://YOUR_USERNAME.github.io/rare-compare`

## 🌐 访问网站

部署完成后，您的网站将在以下地址可用：

**🔗 https://YOUR_USERNAME.github.io/rare-compare**

## 🔄 更新网站

当您需要更新网站时，只需：

```bash
# 修改文件后
git add .
git commit -m "✨ 更新网站内容"
git push
```

GitHub Pages 会自动重新部署更新。

## ⚡ 快速部署命令

复制以下命令到终端执行（记得替换YOUR_USERNAME）：

```bash
# 设置Git用户信息（如果还没设置）
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 添加远程仓库并推送
git remote add origin https://github.com/YOUR_USERNAME/rare-compare.git
git branch -M main
git push -u origin main
```

## 🛠️ 故障排除

### 如果推送失败：
```bash
# 如果提示权限问题，可能需要设置Personal Access Token
# 访问: GitHub Settings > Developer settings > Personal access tokens
```

### 如果网站显示404：
1. 检查仓库是否为Public
2. 确认GitHub Pages设置正确
3. 等待几分钟让部署完成

### 如果图片不显示：
1. 确保图片文件已提交到Git
2. 检查文件路径是否正确
3. 确认图片文件不在.gitignore中

## 📱 分享您的网站

部署完成后，您可以分享以下链接：

**🌐 RARE AI+ 时尚对比平台**
**🔗 https://YOUR_USERNAME.github.io/rare-compare**

## 🎯 SEO 优化

网站已包含以下SEO优化：
- ✅ 响应式设计
- ✅ 语义化HTML结构  
- ✅ Meta标签设置
- ✅ 快速加载速度
- ✅ 移动端优化

---

## 🆘 需要帮助？

如果在部署过程中遇到任何问题，请检查：

1. **GitHub仓库设置** - 确保仓库为Public
2. **文件权限** - 确保所有文件都已提交
3. **分支设置** - 确保使用main分支
4. **等待时间** - GitHub Pages部署通常需要5-10分钟

成功部署后，您的RARE AI+网站就可以在全世界范围内访问了！ 🎉
