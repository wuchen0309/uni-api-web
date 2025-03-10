document.addEventListener('DOMContentLoaded', function() {
    // 元素获取
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const togglePin = document.getElementById('togglePin');
    const sidebarNav = document.getElementById('sidebarNav');
    const markdownContent = document.getElementById('markdown-content');
    const sidebarTitle = document.querySelector('.sidebar-header h3');

    // 侧边栏状态
    let isPinned = false;

    // 检查URL并加载对应内容
    checkUrlAndLoadContent();

    // 修改：检测是否为移动设备
    const isMobile = () => window.innerWidth <= 768;

    // 修改：初始化时根据设备类型设置侧边栏状态
    if (isMobile()) {
        sidebar.classList.add('collapsed');
    }

    // 修改：切换侧边栏可见性的处理
    sidebarToggle.addEventListener('click', function() {
        if (isMobile()) {
            sidebar.classList.toggle('expanded');
        } else {
            sidebar.classList.toggle('collapsed');
        }
    });

    // 修改：切换固定状态的处理
    togglePin.addEventListener('click', function() {
        if (isMobile()) {
            // 在移动端，点击 pin 按钮直接关闭侧边栏
            sidebar.classList.remove('expanded');
        } else {
            isPinned = !isPinned;
            togglePin.classList.toggle('pinned', isPinned);
            if (!isPinned) {
                sidebar.classList.add('collapsed');
            }
        }
    });

    // 当鼠标离开侧边栏且未固定时，折叠侧边栏
    sidebar.addEventListener('mouseleave', function() {
        if (!isPinned) {
            sidebar.classList.add('collapsed');
        }
    });

    // 当鼠标进入侧边栏切换按钮时，展开侧边栏
    sidebarToggle.addEventListener('mouseenter', function() {
        sidebar.classList.remove('collapsed');
    });

    // 修改：标题点击事件
    sidebarTitle.addEventListener('click', function() {
        // 清除所有导航项的活动状态
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // 添加：在移动端自动隐藏侧边栏
        if (isMobile()) {
            sidebar.classList.remove('expanded');
        }
    });

    // 为导航项添加点击事件
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有导航项的活动状态
            document.querySelectorAll('.nav-item').forEach(navItem => {
                navItem.classList.remove('active');
            });

            // 添加当前项的活动状态
            this.classList.add('active');

            // 更新URL

            // 在移动端自动隐藏侧边栏
            if (isMobile()) {
                sidebar.classList.remove('expanded');
            }

            // 检查是否点击了设置管理，如果是则加载API配置
            fetchApiConfig();
        });
    });

    // 根据URL加载内容
    function checkUrlAndLoadContent() {
        // 获取URL中的路径
        let path = window.location.hash.substring(1);

        // 如果URL没有指定路径，则加载默认文件
        if (!path) {
            fetchApiConfig();
            return;
        }

        // 高亮对应的导航项
        highlightActiveNavItem(path);

        // 如果当前页面是设置页面，则加载API配置
        if (path === 'settings') {
            setTimeout(() => {
                fetchApiConfig();
            }, 100);
        }
    }

    // 高亮显示当前活动的导航项
    function highlightActiveNavItem(path) {
        const navItem = document.querySelector(`.nav-item[data-page="${path}"]`);
        if (navItem) {
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            navItem.classList.add('active');
        }
    }

    // 更新URL而不刷新页面
    function updateUrl(pagePath) {
        // 使用hash方式更新URL
        window.location.hash = pagePath;
    }

    // 加载文件内容的函数
    async function fetchFileContent(filePath) {
        try {
            // 直接从相对路径加载markdown文件
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`加载文件失败: HTTP ${response.status}`);
            }
            return await response.text();
        } catch (error) {
            console.error(`加载文件失败 ${filePath}:`, error);
            return `# 加载失败\n\n无法加载文件: ${filePath}\n\n错误: ${error.message}`;
        }
    }

    // 新增函数：获取API配置
    async function fetchApiConfig() {
        try {
            // 显示API容器并设置加载状态
            const apiContainer = document.getElementById('api-container');
            const apiCardsContainer = document.getElementById('api-cards-container');

            // 显示容器并清空之前的内容
            apiContainer.style.display = '';
            apiCardsContainer.innerHTML = '<div class="loading">加载API配置中...</div>';

            // 发送请求获取API配置
            const response = await fetch('http://localhost:8000/v1/api_config', {
                headers: {
                    'Authorization': 'Bearer REMOVED'
                }
            });

            if (!response.ok) {
                throw new Error(`请求失败: HTTP ${response.status}`);
            }

            const data = await response.json();

            // 清空容器
            apiCardsContainer.innerHTML = '';

            // 创建每个API的卡片
            if (data.api_config && data.api_config.providers) {
                data.api_config.providers.forEach(provider => {
                    const card = createApiCard(provider);
                    apiCardsContainer.appendChild(card);
                });

                // 添加新建卡片按钮的事件监听
                const addButton = document.getElementById('add-api-button');
                addButton.addEventListener('click', () => {
                    const emptyProvider = {
                        provider: '',
                        base_url: '',
                        api: '',
                        model: []
                    };
                    const newCard = createApiCard(emptyProvider);
                    apiCardsContainer.appendChild(newCard);
                });

                // 添加事件监听
                setupCardEventListeners();
            } else {
                apiCardsContainer.innerHTML = '<div class="error">未找到API配置</div>';
            }
        } catch (error) {
            console.error('获取API配置失败:', error);
            const apiContainer = document.getElementById('api-container');
            const apiCardsContainer = document.getElementById('api-cards-container');

            apiContainer.style.display = '';
            apiCardsContainer.innerHTML = `<div class="error">获取API配置失败: ${error.message}</div>`;
        }
    }

    // 创建API卡片
    function createApiCard(provider) {
        // 克隆模板
        const template = document.querySelector('.api-card.template');
        const card = template.cloneNode(true);
        card.classList.remove('template');
        card.style.display = '';

        // 填充数据
        card.querySelector('.provider-name').value = provider.provider || '';
        card.querySelector('.api-key').value = provider.api || '';
        card.querySelector('.base-url').value = provider.base_url || '';

        // 清空模型容器
        const modelsContainer = card.querySelector('.models-container');
        modelsContainer.innerHTML = '';

        // 添加模型条目
        if (provider.model && Array.isArray(provider.model)) {
            provider.model.forEach(modelItem => {
                const modelEntry = createModelEntry(modelItem);
                modelsContainer.appendChild(modelEntry);
            });
        }

        // 添加模型按钮点击事件
        const addModelBtn = card.querySelector('.add-model-btn');
        addModelBtn.addEventListener('click', function() {
            const newModelEntry = createModelEntry();
            modelsContainer.appendChild(newModelEntry);
        });

        // 设置高级选项
        if (card.querySelector('.tools-checkbox')) {
            card.querySelector('.tools-checkbox').checked = provider.tools || false;
        }

        // 添加URL字段（如果存在）
        if (provider.url && card.querySelector('.system-prompt')) {
            card.querySelector('.system-prompt').value = provider.url || '';
        }

        return card;
    }

    // 创建模型条目
    function createModelEntry(modelItem = null) {
        // 克隆模型条目模板
        const template = document.querySelector('.model-entry-template .model-entry');
        const modelEntry = template.cloneNode(true);

        const originalModelInput = modelEntry.querySelector('.original-model-name');
        const renamedModelInput = modelEntry.querySelector('.renamed-model-name');

        // 填充数据
        if (modelItem) {
            if (typeof modelItem === 'string') {
                // 如果是字符串，只填充原始模型名
                originalModelInput.value = modelItem;
            } else if (typeof modelItem === 'object') {
                // 如果是对象，填充原始名和别名
                const originalName = Object.keys(modelItem)[0];
                const renamedName = modelItem[originalName];

                originalModelInput.value = originalName;
                renamedModelInput.value = renamedName;
            }
        }

        // 添加删除按钮事件
        const removeBtn = modelEntry.querySelector('.remove-model-btn');
        removeBtn.addEventListener('click', function() {
            modelEntry.remove();
        });

        return modelEntry;
    }

    // 修改设置卡片事件监听
    function setupCardEventListeners() {
        // 复制卡片
        document.querySelectorAll('.duplicate-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const card = this.closest('.api-card');
                const clone = card.cloneNode(true);
                card.parentNode.insertBefore(clone, card.nextSibling);

                // 重新绑定模型添加按钮事件
                const modelsContainer = clone.querySelector('.models-container');
                const addModelBtn = clone.querySelector('.add-model-btn');
                addModelBtn.addEventListener('click', function() {
                    const newModelEntry = createModelEntry();
                    modelsContainer.appendChild(newModelEntry);
                });

                // 重新绑定模型删除按钮事件
                clone.querySelectorAll('.remove-model-btn').forEach(btn => {
                    const modelEntry = btn.closest('.model-entry');
                    btn.addEventListener('click', function() {
                        modelEntry.remove();
                    });
                });

                setupCardEventListeners(); // 重新绑定其他事件
            });
        });

        // 删除卡片
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const card = this.closest('.api-card');
                card.remove();
            });
        });

        // 切换高级设置
        document.querySelectorAll('.advanced-settings-header').forEach(header => {
            header.addEventListener('click', function() {
                const content = this.nextElementSibling;
                content.style.display = content.style.display === 'none' ? 'block' : 'none';
                const icon = this.querySelector('.toggle-icon');
                icon.textContent = content.style.display === 'none' ? '▼' : '▲';
            });
        });
    }

    // 监听URL变化
    window.addEventListener('hashchange', checkUrlAndLoadContent);

    // 添加：监听窗口大小变化
    window.addEventListener('resize', function() {
        if (!isMobile()) {
            sidebar.classList.remove('expanded');
            if (!isPinned) {
                sidebar.classList.add('collapsed');
            }
        }
    });

    // 添加：点击内容区域时隐藏侧边栏
    const content = document.getElementById('content');
    content.addEventListener('click', function(e) {
        if (isMobile()) {
            // 确保点击的不是链接元素
            if (!e.target.closest('a')) {
                sidebar.classList.remove('expanded');
            }
        }
    });

    // 添加：阻止侧边栏内的点击事件冒泡到内容区域
    sidebar.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // 收集API配置数据
    function collectApiConfigData() {
        const apiCards = document.querySelectorAll('.api-card:not(.template)');
        const providers = [];

        apiCards.forEach(card => {
            const provider = {
                provider: card.querySelector('.provider-name').value,
                api: card.querySelector('.api-key').value,
                base_url: card.querySelector('.base-url').value,
                tools: card.querySelector('.tools-checkbox').checked
            };

            // 收集模型数据
            const models = [];
            card.querySelectorAll('.model-entry').forEach(entry => {
                const originalName = entry.querySelector('.original-model-name').value;
                const renamedName = entry.querySelector('.renamed-model-name').value;

                if (originalName) {
                    if (renamedName) {
                        // 如果有别名，使用对象格式
                        const modelObj = {};
                        modelObj[originalName] = renamedName;
                        models.push(modelObj);
                    } else {
                        // 如果没有别名，使用字符串格式
                        models.push(originalName);
                    }
                }
            });

            provider.model = models;

            // 其他配置字段...
            if (card.querySelector('.system-prompt')) {
                provider.url = card.querySelector('.system-prompt').value;
            }

            providers.push(provider);
        });

        return { providers };
    }
});
