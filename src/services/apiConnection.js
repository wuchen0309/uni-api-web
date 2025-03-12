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

    // 保存连接信息
    saveConnection(url, key) {
        this.connection.url = url;
        this.connection.key = key;
        localStorage.setItem('api_url', url);
        localStorage.setItem('api_key', key);
    }

    // 测试连接
    async testConnection() {
        try {
            const response = await fetch(`${this.connection.url}/v1/api_config`, {
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