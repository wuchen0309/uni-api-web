// 路由管理
export class Router {
    constructor(options = {}) {
        this.routes = new Map();
        this.defaultRoute = options.defaultRoute || (() => {});
    }

    // 添加路由
    addRoute(path, handler) {
        this.routes.set(path, handler);
    }

    // 检查URL并加载对应内容
    checkUrlAndLoadContent() {
        const path = window.location.hash.substring(1);
        const handler = this.routes.get(path);

        if (handler) {
            handler(path);
        } else {
            this.defaultRoute(path);
        }
    }

    // 初始化路由监听
    init() {
        window.addEventListener('hashchange', () => this.checkUrlAndLoadContent());
        this.checkUrlAndLoadContent();
    }
}