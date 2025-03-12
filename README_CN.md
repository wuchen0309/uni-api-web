# uni-api-web

[English](README.md) | [简体中文](README_CN.md)

## 项目概述

uni-api-web 是 [uni-api](https://github.com/yym68686/uni-api) 的前端管理界面，提供了一个友好的 Web UI 来管理和配置 uni-api。通过 uni-api-web，您可以轻松地管理多个 AI 模型提供商的配置，包括 API 密钥管理、模型访问设置等。

## 主要特性

- **可视化配置管理**
  - 通过 Web 界面可视化管理 uni-api 配置
  - 实时预览和编辑 YAML 配置
  - 支持配置文件的导入导出

- **多提供商管理**
  - 支持所有 uni-api 支持的服务商配置
  - OpenAI、Anthropic、Gemini、Vertex AI 等
  - API 密钥和模型配置管理

- **高级功能配置**
  - 负载均衡策略设置
  - 超时和重试机制配置
  - 代理设置
  - 模型别名配置

- **用户友好设计**
  - 响应式布局，支持移动端
  - 暗色主题
  - 多语言支持

## 部署方式

### Vercel 一键部署

[![使用 Vercel 部署](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyym68686%2Funi-api-web)

### Cloudflare Pages 部署

```bash
# 安装 Wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署到 Cloudflare Pages
wrangler pages deploy . --project-name uni-api-web --branch main
```

### GitHub Pages 部署

1. Fork 本仓库
2. 在仓库设置中启用 GitHub Pages
3. 选择部署分支和目录

### 本地部署

1. 克隆仓库:
```bash
git clone https://github.com/yym68686/uni-api-web.git
cd uni-api-web
```

2. 启动本地服务:
```bash
python3 -m http.server 8001
```

3. 访问 `http://127.0.0.1:8001`

## 配置说明

uni-api-web 通过可视化界面生成 uni-api 所需的 YAML 配置文件。主要配置项包括：

### 基础配置
- 提供商名称和 API 密钥
- Base URL 配置
- 模型配置和别名设置

### 高级配置
- 负载均衡策略
- 超时和重试设置
- 代理配置
- 权限控制

详细配置说明请参考 [uni-api 文档](https://github.com/yym68686/uni-api)。

## 开发指南

### 项目结构

```
uni-api-web/
├── index.html          # 主页面
├── styles.css          # 样式定义
├── src/
│   ├── main.js        # 主程序逻辑
│   ├── services/      # 服务层
│   └── components/    # UI组件
├── README.md          # 英文文档
└── README_CN.md       # 中文文档
```

### 自定义开发

1. 修改 `index.html` 添加新的 UI 元素
2. 在 `styles.css` 中添加样式
3. 在相应的 JavaScript 文件中实现功能

## 贡献指南

欢迎提交 Pull Request 或 Issue！

1. Fork 本仓库
2. 创建特性分支
3. 提交更改
4. 发起 Pull Request

## 许可证

本项目采用 MIT 许可证

## 联系方式

- 项目 Issues
- Telegram 群组: [uni_api](https://t.me/uni_api)

---

感谢使用 uni-api-web！
