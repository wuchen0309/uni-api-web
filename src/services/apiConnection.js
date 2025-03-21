// API连接服务
export class ApiConnectionService {
    constructor() {
        this.connection = {
            url: localStorage.getItem('api_url') || '',
            key: localStorage.getItem('api_key') || '',
            isConnected: false
        };
    }

    // 获取存储的连接信息
    getStoredConnection() {
        return {
            url: this.connection.url,
            key: this.connection.key
        };
    }

    // 规范化URL格式
    normalizeUrl(url) {
        if (!url) return '';

        // 添加协议前缀（如果缺少）
        if (!/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }

        // 移除尾部斜杠
        return url.replace(/\/+$/, '');
    }

    // 保存连接信息
    saveConnection(url, key) {
        const normalizedUrl = this.normalizeUrl(url);
        this.connection.url = normalizedUrl;
        this.connection.key = key;
        localStorage.setItem('api_url', normalizedUrl);
        localStorage.setItem('api_key', key);
    }

    // 测试连接
    async testConnection() {
        try {
            // 确保URL格式正确
            const baseUrl = this.normalizeUrl(this.connection.url);

            const response = await fetch(`${baseUrl}/v1/api_config`, {
                headers: {
                    'Authorization': `Bearer ${this.connection.key}`
                }
            });

            if (!response.ok) {
                throw new Error(`连接失败: HTTP ${response.status}`);
            }

            this.connection.isConnected = true;
            return true;
        } catch (error) {
            console.error('连接服务器失败:', error);
            throw error;
        }
    }
}