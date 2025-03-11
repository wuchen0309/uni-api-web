# uni-api-web

## 项目简介

uni-api-web 是一个轻量级的 API 提供商管理工具，允许用户集中管理多个 AI 模型提供商的配置，简化 API 密钥管理和模型访问设置。通过友好的用户界面，您可以轻松配置、更新和维护各种 AI 服务提供商的设置。

## 功能特点

- **多提供商管理**：支持添加、编辑和删除多个 API 提供商
- **API 密钥管理**：安全管理多个 API 密钥
- **模型配置**：为每个提供商配置可用模型及别名
- **部署方式**：
  - 本地部署
  - 远程部署：vercel，GitHub Pages，cloudflare pages
- **高级设置**：
  - 工具支持设置
  - 自定义代理配置
  - 详细备注功能
- **响应式设计**：
  - 适配桌面和移动设备
  - 可折叠侧边栏
  - 暗色主题界面

## 安装与使用

### 安装要求

- 现代网页浏览器
- 本地或远程服务器用于托管后端服务

### 快速开始

远程部署：

1. 你可以一键将 uni-api-web 部署到 Vercel：

[![使用 Vercel 部署](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyym68686%2Funi-api-web)

2. 你可以部署到 Cloudflare Pages：

```bash
# 安装 Wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署到 Cloudflare Pages（带 SSL 配置）
wrangler pages deploy . --project-name cerebr --branch main
```

3. 你也可以部署到 GitHub Pages：

```bash
# Fork 这个仓库
# 然后进入你的仓库的 Settings -> Pages
# 在"构建和部署"部分：
# - 将"Source"选择为"Deploy from a branch"
# - 选择你的分支（main/master）和根目录（/）
# - 点击保存
```

本地部署：

1. 克隆仓库到本地：
   ```bash
   git clone https://github.com/yym68686/uni-api-web.git
   cd uni-api-web
   ```

2. 启动后端服务：
   ```bash
   # 根据项目后端实际启动命令
   python3 -m http.server 8001
   ```

3. 在浏览器中打开 `127.0.0.1:8001` 或通过 Web 服务器访问

## 配置说明

### 提供商设置

每个 API 提供商可以配置以下信息：

- **提供商名称**：用于标识不同的服务提供商
- **API 密钥**：支持单个或多个 API 密钥配置
- **Base URL**：API 服务的基础 URL
- **模型配置**：
  - 原始模型名称
  - 可选的模型别名

### 高级设置

- **工具支持**：启用对函数调用等工具的支持
- **代理设置**：通过偏好设置 JSON 配置代理服务
- **备注功能**：添加提供商相关的备注信息

## 开发指南

### 项目结构

- `index.html` - 主页面结构
- `styles.css` - 样式表定义
- `script.js` - 前端交互逻辑
- `README_CN.md` - 中文文档

### 自定义开发

如需修改或扩展功能：

1. 编辑 `index.html` 添加新的 UI 元素
2. 在 `styles.css` 中添加相应样式
3. 在 `script.js` 中实现交互逻辑

## 贡献指南

我们欢迎社区贡献！如果您希望参与项目开发：

1. Fork 本仓库
2. 创建您的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m '添加某某功能'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件

## 联系方式

如有问题或建议，请通过以下方式联系我们：

- 项目 Issues 页面
- 电子邮件：your-email@example.com

---

感谢使用 uni-api！我们期待您的反馈和建议。
