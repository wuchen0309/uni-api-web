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

            // 检查是否点击了提供商管理，如果是则加载提供商配置
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

        // 如果当前页面是设置页面，则加载提供商配置
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

    // 修改：获取提供商配置
    async function fetchApiConfig() {
        try {
            // 显示API容器并设置加载状态
            const apiContainer = document.getElementById('api-container');
            const apiCardsContainer = document.getElementById('api-cards-container');

            // 显示容器并清空之前的内容
            apiContainer.style.display = '';
            apiCardsContainer.innerHTML = '<div class="loading">加载提供商配置中...</div>';

            // 发送请求获取提供商配置
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

                // 获取添加按钮并先移除已有的事件监听器
                const addButton = document.getElementById('add-api-button');
                // 克隆按钮以移除所有事件监听器
                const newButton = addButton.cloneNode(true);
                addButton.parentNode.replaceChild(newButton, addButton);

                // 重新添加事件监听器
                newButton.addEventListener('click', () => {
                    const emptyProvider = {
                        provider: '',
                        base_url: '',
                        api: '',
                        model: []
                    };
                    const newCard = createApiCard(emptyProvider);
                    apiCardsContainer.appendChild(newCard);

                    // 为新添加的卡片绑定事件监听器
                    setupNewCardEventListeners(newCard);
                });

                // 添加事件监听
                setupCardEventListeners();

                // 设置保存按钮事件监听
                setupSaveConfigButton();
            } else {
                apiCardsContainer.innerHTML = '<div class="error">未找到提供商配置</div>';
            }
        } catch (error) {
            console.error('获取提供商配置失败:', error);
            const apiContainer = document.getElementById('api-container');
            const apiCardsContainer = document.getElementById('api-cards-container');

            apiContainer.style.display = '';
            apiCardsContainer.innerHTML = `<div class="error">获取提供商配置失败: ${error.message}</div>`;
        }
    }

    // 修改: 创建API卡片
    function createApiCard(provider) {
        // 克隆模板
        const template = document.querySelector('.api-card.template');
        const card = template.cloneNode(true);
        card.classList.remove('template');
        card.style.display = '';

        // 填充数据
        card.querySelector('.provider-name').value = provider.provider || '';

        // 修改: 处理API密钥数组
        const apiKeysContainer = card.querySelector('.api-keys-container');
        apiKeysContainer.innerHTML = ''; // 清空默认的API输入框

        // 如果API是数组，为每个API值创建一个输入框
        if (Array.isArray(provider.api)) {
            provider.api.forEach(apiKey => {
                const apiKeyEntry = createApiKeyEntry(apiKey);
                apiKeysContainer.appendChild(apiKeyEntry);
            });
        } else if (provider.api) {
            // 如果API是单个字符串
            const apiKeyEntry = createApiKeyEntry(provider.api);
            apiKeysContainer.appendChild(apiKeyEntry);
        } else {
            // 如果没有API，创建一个空的输入框
            const apiKeyEntry = createApiKeyEntry('');
            apiKeysContainer.appendChild(apiKeyEntry);
        }

        // 添加API密钥按钮点击事件
        const addApiKeyBtn = card.querySelector('.add-api-key-btn');
        addApiKeyBtn.addEventListener('click', function() {
            const newApiKeyEntry = createApiKeyEntry();
            apiKeysContainer.appendChild(newApiKeyEntry);
        });

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
        if (provider.url && card.querySelector('.note')) {
            card.querySelector('.note').value = provider.url || '';
        } else if (provider.notes && card.querySelector('.note')) {
            card.querySelector('.note').value = provider.notes || '';
        }

        // 添加：处理偏好设置
        const preferencesTextarea = card.querySelector('.preferences');
        if (preferencesTextarea && provider.preferences) {
            try {
                preferencesTextarea.value = JSON.stringify(provider.preferences, null, 2);
            } catch (e) {
                preferencesTextarea.value = '';
                console.error('解析偏好设置失败', e);
            }
        }

        return card;
    }

    // 修改: 创建API密钥输入条目 - 使用HTML模板
    function createApiKeyEntry(apiKey = '') {
        // 使用HTML模板
        const template = document.querySelector('.api-key-entry-template .api-key-entry');
        const entry = template.cloneNode(true);

        // 设置API密钥值
        entry.querySelector('.api-key').value = apiKey;

        // 添加删除按钮事件
        const removeBtn = entry.querySelector('.remove-api-key-btn');
        removeBtn.addEventListener('click', function() {
            // 确保至少保留一个API密钥输入框
            const container = entry.closest('.api-keys-container');
            if (container.querySelectorAll('.api-key-entry').length > 1) {
                entry.remove();
            }
        });

        return entry;
    }

    // 修改: 创建模型条目 - 使用HTML模板
    function createModelEntry(modelItem = null) {
        // 使用HTML模板
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
            // 移除现有的事件监听器，防止重复绑定
            btn.removeEventListener('click', duplicateCardHandler);
            btn.addEventListener('click', duplicateCardHandler);
        });

        // 删除卡片
        document.querySelectorAll('.delete-btn').forEach(btn => {
            // 移除现有的事件监听器，防止重复绑定
            btn.removeEventListener('click', deleteCardHandler);
            btn.addEventListener('click', deleteCardHandler);
        });

        // 切换高级设置
        document.querySelectorAll('.advanced-settings-header').forEach(header => {
            // 移除现有的事件监听器，防止重复绑定
            header.removeEventListener('click', toggleAdvancedSettingsHandler);
            header.addEventListener('click', toggleAdvancedSettingsHandler);
        });
    }

    // 抽取处理函数，便于添加和移除事件监听器
    function duplicateCardHandler() {
        const card = this.closest('.api-card');
        const clone = card.cloneNode(true);
        card.parentNode.insertBefore(clone, card.nextSibling);

        // 为新卡片绑定事件
        setupNewCardEventListeners(clone);
    }

    function deleteCardHandler() {
        const card = this.closest('.api-card');
        card.remove();
    }

    function toggleAdvancedSettingsHandler() {
        const content = this.nextElementSibling;
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
        const icon = this.querySelector('.toggle-icon');
        icon.textContent = content.style.display === 'none' ? '▼' : '▲';
    }

    // 仅为新卡片设置事件监听器
    function setupNewCardEventListeners(card) {
        // 复制按钮
        const duplicateBtn = card.querySelector('.duplicate-btn');
        if (duplicateBtn) {
            duplicateBtn.addEventListener('click', duplicateCardHandler);
        }

        // 删除按钮
        const deleteBtn = card.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', deleteCardHandler);
        }

        // 高级设置切换
        const advancedHeader = card.querySelector('.advanced-settings-header');
        if (advancedHeader) {
            advancedHeader.addEventListener('click', toggleAdvancedSettingsHandler);
        }

        // 模型添加按钮
        const addModelBtn = card.querySelector('.add-model-btn');
        if (addModelBtn) {
            addModelBtn.addEventListener('click', function() {
                const modelsContainer = card.querySelector('.models-container');
                const newModelEntry = createModelEntry();
                modelsContainer.appendChild(newModelEntry);
            });
        }

        // API密钥添加按钮
        const addApiKeyBtn = card.querySelector('.add-api-key-btn');
        if (addApiKeyBtn) {
            addApiKeyBtn.addEventListener('click', function() {
                const apiKeysContainer = card.querySelector('.api-keys-container');
                const newApiKeyEntry = createApiKeyEntry();
                apiKeysContainer.appendChild(newApiKeyEntry);
            });
        }

        // 为已存在的模型删除按钮绑定事件
        card.querySelectorAll('.remove-model-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const modelEntry = btn.closest('.model-entry');
                modelEntry.remove();
            });
        });

        // 为已存在的API密钥删除按钮绑定事件
        card.querySelectorAll('.remove-api-key-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const entry = btn.closest('.api-key-entry');
                const container = entry.closest('.api-keys-container');
                if (container.querySelectorAll('.api-key-entry').length > 1) {
                    entry.remove();
                }
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

    // 收集提供商配置数据
    function collectApiConfigData() {
        const apiCards = document.querySelectorAll('.api-card:not(.template)');
        const providers = [];

        apiCards.forEach(card => {
            // 收集API密钥
            const apiKeys = [];
            card.querySelectorAll('.api-key-entry .api-key').forEach(input => {
                if (input.value.trim()) {
                    apiKeys.push(input.value.trim());
                }
            });

            const provider = {
                provider: card.querySelector('.provider-name').value,
                base_url: card.querySelector('.base-url').value,
                tools: card.querySelector('.tools-checkbox').checked
            };

            // 如果只有一个API密钥，则以字符串形式存储，否则以数组形式存储
            if (apiKeys.length === 1) {
                provider.api = apiKeys[0];
            } else if (apiKeys.length > 1) {
                provider.api = apiKeys;
            } else {
                provider.api = "";
            }

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

            // 添加：收集偏好设置
            const preferencesTextarea = card.querySelector('.preferences');
            if (preferencesTextarea && preferencesTextarea.value.trim()) {
                try {
                    provider.preferences = JSON.parse(preferencesTextarea.value.trim());
                } catch (e) {
                    console.error('解析偏好设置JSON失败:', e);
                    // 可以考虑显示错误提示给用户
                }
            }

            // 其他配置字段...
            if (card.querySelector('.note')) {
                provider.notes = card.querySelector('.note').value;
            }

            providers.push(provider);
        });

        return { providers };
    }

    // 修改：保存配置按钮事件监听
    function setupSaveConfigButton() {
        const saveButton = document.getElementById('save-config-button');
        if (saveButton) {
            saveButton.addEventListener('click', function() {
                // 收集配置数据
                const configData = collectApiConfigData();

                // 显示保存中状态
                saveButton.disabled = true;
                saveButton.innerHTML = '<span class="loading-spinner"></span> 保存中...';

                // 发送POST请求到服务器
                fetch('http://localhost:8000/v1/api_config/update', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer REMOVED',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(configData)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`请求失败: HTTP ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('保存成功:', data);
                    // alert('配置已成功保存到服务器！');
                })
                .catch(error => {
                    console.error('保存配置失败:', error);
                    alert(`保存配置失败: ${error.message}`);
                })
                .finally(() => {
                    // 恢复按钮状态
                    saveButton.disabled = false;
                    // 使用模板内容恢复按钮
                    const buttonTemplate = document.getElementById('save-button-template');
                    saveButton.innerHTML = buttonTemplate.innerHTML;
                });
            });
        }
    }
});
