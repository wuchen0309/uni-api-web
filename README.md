# uni-api-web

## Project Overview

uni-api-web is a lightweight API provider management tool that allows users to centrally manage configurations for multiple AI model providers, simplifying API key management and model access settings. Through a user-friendly interface, you can easily configure, update, and maintain settings for various AI service providers.

## Features

- **Multi-provider Management**: Support for adding, editing, and deleting multiple API providers
- **API Key Management**: Securely manage multiple API keys
- **Model Configuration**: Configure available models and aliases for each provider
- **Deployment Options**:
  - Local deployment
  - Remote deployment: Vercel, GitHub Pages, Cloudflare Pages
- **Advanced Settings**:
  - Tool support configuration
  - Custom proxy settings
  - Detailed note functionality
- **Responsive Design**:
  - Compatible with desktop and mobile devices
  - Collapsible sidebar
  - Dark theme interface

## Installation and Usage

### Requirements

- Modern web browser
- Local or remote server for hosting backend services

### Quick Start

Remote Deployment:

1. You can deploy uni-api-web to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyym68686%2Funi-api-web)

2. You can deploy to Cloudflare Pages:

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy to Cloudflare Pages (with SSL configuration)
wrangler pages deploy . --project-name cerebr --branch main
```

3. You can also deploy to GitHub Pages:

```bash
# Fork this repository
# Then go to Settings -> Pages in your repository
# In the "Build and deployment" section:
# - Set "Source" to "Deploy from a branch"
# - Select your branch (main/master) and root directory (/)
# - Click Save
```

Local Deployment:

1. Clone the repository:
   ```bash
   git clone https://github.com/yym68686/uni-api-web.git
   cd uni-api-web
   ```

2. Start the backend service:
   ```bash
   # Use the actual backend startup command for your project
   python3 -m http.server 8001
   ```

3. Open `127.0.0.1:8001` in your browser or access via a web server

## Configuration Guide

### Provider Settings

Each API provider can be configured with the following information:

- **Provider Name**: Used to identify different service providers
- **API Key**: Support for single or multiple API key configurations
- **Base URL**: The base URL for the API service
- **Model Configuration**:
  - Original model names
  - Optional model aliases

### Advanced Settings

- **Tool Support**: Enable support for function calls and other tools
- **Proxy Settings**: Configure proxy services through preference JSON
- **Notes Feature**: Add notes related to the provider

## Development Guide

### Project Structure

- `index.html` - Main page structure
- `styles.css` - Style definitions
- `script.js` - Frontend interaction logic
- `README.md` - English documentation
- `README_CN.md` - Chinese documentation

### Custom Development

To modify or extend functionality:

1. Edit `index.html` to add new UI elements
2. Add corresponding styles in `styles.css`
3. Implement interaction logic in `script.js`

## Contribution Guidelines

We welcome community contributions! If you want to participate in project development:

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Contact Information

If you have questions or suggestions, please contact us through:

- Project Issues page
- Email: your-email@example.com

---

Thank you for using uni-api! We look forward to your feedback and suggestions.