// API卡片组件
export class ApiCard {
    constructor(provider = {}) {
        this.provider = provider;
    }

    // 创建API卡片
    createCard() {
        const template = document.querySelector('.api-card.template');
        const card = template.cloneNode(true);
        card.classList.remove('template');
        card.style.display = '';

        this.fillCardData(card);
        this.setupCardEventListeners(card);

        return card;
    }

    // 填充卡片数据
    fillCardData(card) {
        card.querySelector('.provider-name').value = this.provider.provider || '';

        // 处理API密钥
        const apiKeysContainer = card.querySelector('.api-keys-container');
        apiKeysContainer.innerHTML = '';

        if (Array.isArray(this.provider.api)) {
            this.provider.api.forEach(apiKey => {
                const apiKeyEntry = this.createApiKeyEntry(apiKey);
                apiKeysContainer.appendChild(apiKeyEntry);
            });
        } else if (this.provider.api) {
            const apiKeyEntry = this.createApiKeyEntry(this.provider.api);
            apiKeysContainer.appendChild(apiKeyEntry);
        } else {
            const apiKeyEntry = this.createApiKeyEntry('');
            apiKeysContainer.appendChild(apiKeyEntry);
        }

        // 设置基础URL
        card.querySelector('.base-url').value = this.provider.base_url || '';

        // 处理模型
        const modelsContainer = card.querySelector('.models-container');
        modelsContainer.innerHTML = '';

        if (this.provider.model && Array.isArray(this.provider.model)) {
            this.provider.model.forEach(modelItem => {
                const modelEntry = this.createModelEntry(modelItem);
                modelsContainer.appendChild(modelEntry);
            });
        }

        // 设置其他选项
        if (card.querySelector('.tools-checkbox')) {
            card.querySelector('.tools-checkbox').checked = this.provider.tools || false;
        }

        // 设置备注
        if (card.querySelector('.note')) {
            card.querySelector('.note').value = this.provider.notes || this.provider.url || '';
        }

        // 设置偏好设置
        const preferencesTextarea = card.querySelector('.preferences');
        if (preferencesTextarea && this.provider.preferences) {
            try {
                preferencesTextarea.value = JSON.stringify(this.provider.preferences, null, 2);
            } catch (e) {
                console.error('解析偏好设置失败', e);
                preferencesTextarea.value = '';
            }
        }
    }

    // 创建API密钥输入条目
    createApiKeyEntry(apiKey = '') {
        const template = document.querySelector('.api-key-entry-template .api-key-entry');
        const entry = template.cloneNode(true);
        entry.querySelector('.api-key').value = apiKey;

        const removeBtn = entry.querySelector('.remove-api-key-btn');
        removeBtn.addEventListener('click', () => {
            const container = entry.closest('.api-keys-container');
            if (container.querySelectorAll('.api-key-entry').length > 1) {
                entry.remove();
            }
        });

        return entry;
    }

    // 创建模型条目
    createModelEntry(modelItem = null) {
        const template = document.querySelector('.model-entry-template .model-entry');
        const modelEntry = template.cloneNode(true);

        const originalModelInput = modelEntry.querySelector('.original-model-name');
        const renamedModelInput = modelEntry.querySelector('.renamed-model-name');

        if (modelItem) {
            if (typeof modelItem === 'string') {
                originalModelInput.value = modelItem;
            } else if (typeof modelItem === 'object') {
                const originalName = Object.keys(modelItem)[0];
                const renamedName = modelItem[originalName];
                originalModelInput.value = originalName;
                renamedModelInput.value = renamedName;
            }
        }

        const removeBtn = modelEntry.querySelector('.remove-model-btn');
        removeBtn.addEventListener('click', () => modelEntry.remove());

        return modelEntry;
    }

    // 设置卡片事件监听
    setupCardEventListeners(card) {
        // 复制按钮
        const duplicateBtn = card.querySelector('.duplicate-btn');
        if (duplicateBtn) {
            duplicateBtn.addEventListener('click', () => {
                const clone = card.cloneNode(true);
                card.parentNode.insertBefore(clone, card.nextSibling);
                this.setupCardEventListeners(clone);
            });
        }

        // 删除按钮
        const deleteBtn = card.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                card.remove();
            });
        }

        // 添加API密钥按钮
        const addApiKeyBtn = card.querySelector('.add-api-key-btn');
        addApiKeyBtn.addEventListener('click', () => {
            const apiKeysContainer = card.querySelector('.api-keys-container');
            const newApiKeyEntry = this.createApiKeyEntry();
            apiKeysContainer.appendChild(newApiKeyEntry);
        });

        // 添加模型按钮
        const addModelBtn = card.querySelector('.add-model-btn');
        addModelBtn.addEventListener('click', () => {
            const modelsContainer = card.querySelector('.models-container');
            const newModelEntry = this.createModelEntry();
            modelsContainer.appendChild(newModelEntry);
        });

        // 高级设置切换
        const advancedHeader = card.querySelector('.advanced-settings-header');
        if (advancedHeader) {
            advancedHeader.addEventListener('click', () => {
                const content = advancedHeader.nextElementSibling;
                content.style.display = content.style.display === 'none' ? 'block' : 'none';
                const icon = advancedHeader.querySelector('.toggle-icon');
                icon.textContent = content.style.display === 'none' ? '▼' : '▲';
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
}