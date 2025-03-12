// API配置服务
export class ApiConfigService {
    constructor(apiConnection) {
        this.apiConnection = apiConnection;
    }

    // 获取API配置
    async fetchConfig() {
        const response = await fetch(`${this.apiConnection.connection.url}/v1/api_config`, {
            headers: {
                'Authorization': `Bearer ${this.apiConnection.connection.key}`
            }
        });

        if (!response.ok) {
            throw new Error(`请求失败: HTTP ${response.status}`);
        }

        return await response.json();
    }

    // 保存API配置
    async saveConfig(configData) {
        const response = await fetch(`${this.apiConnection.connection.url}/v1/api_config/update`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiConnection.connection.key}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(configData)
        });

        if (!response.ok) {
            throw new Error(`保存失败: HTTP ${response.status}`);
        }

        return await response.json();
    }
}