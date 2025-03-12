# uni-api-web

[English](README.md) | [简体中文](README_CN.md)

## Project Overview

uni-api-web is the web interface for [uni-api](https://github.com/yym68686/uni-api), providing a user-friendly UI to manage and configure uni-api. Through uni-api-web, you can easily manage configurations for multiple AI model providers, including API key management and model access settings.

## Features

- **Visual Configuration Management**
  - Manage uni-api configuration through web interface
  - Real-time YAML configuration preview and editing
  - Import/export configuration files

- **Multi-provider Management**
  - Support all providers supported by uni-api
  - OpenAI, Anthropic, Gemini, Vertex AI, etc.
  - API key and model configuration management

- **Advanced Settings**
  - Load balancing strategy configuration
  - Timeout and retry mechanism settings
  - Proxy configuration
  - Model alias settings

- **User-friendly Design**
  - Responsive layout for mobile devices
  - Dark theme
  - Multi-language support

## Deployment

### Vercel One-click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyym68686%2Funi-api-web)

### Cloudflare Pages

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy to Cloudflare Pages
wrangler pages deploy . --project-name uni-api-web --branch main
```

### GitHub Pages

1. Fork this repository
2. Enable GitHub Pages in repository settings
3. Select deployment branch and directory

### Local Deployment

1. Clone the repository:
```bash
git clone https://github.com/yym68686/uni-api-web.git
cd uni-api-web
```

2. Start local server:
```bash
python3 -m http.server 8001
```

3. Visit `http://127.0.0.1:8001`

## Configuration Guide

uni-api-web generates YAML configuration files required by uni-api through its visual interface. Main configuration items include:

### Basic Settings
- Provider name and API keys
- Base URL configuration
- Model configuration and aliases

### Advanced Settings
- Load balancing strategies
- Timeout and retry settings
- Proxy configuration
- Permission control

For detailed configuration instructions, please refer to [uni-api documentation](https://github.com/yym68686/uni-api).

## Development Guide

### Project Structure

```
uni-api-web/
├── index.html          # Main page
├── styles.css          # Style definitions
├── src/
│   ├── main.js        # Main program logic
│   ├── services/      # Service layer
│   └── components/    # UI components
├── README.md          # English documentation
└── README_CN.md       # Chinese documentation
```

### Custom Development

1. Modify `index.html` to add new UI elements
2. Add styles in `styles.css`
3. Implement functionality in JavaScript files

## Contributing

Pull Requests and Issues are welcome!

1. Fork this repository
2. Create your feature branch
3. Submit your changes
4. Create Pull Request

## License

This project is licensed under the MIT License

## Contact

- Project Issues
- Telegram Group: [uni_api](https://t.me/uni_api)

---

Thank you for using uni-api-web!