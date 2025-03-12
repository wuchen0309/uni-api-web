// 侧边栏组件
import { isMobile } from '../utils/deviceUtils.js';

export class Sidebar {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.sidebarToggle = document.getElementById('sidebarToggle');
        this.togglePin = document.getElementById('togglePin');
        this.sidebarTitle = document.querySelector('.sidebar-header h3');
        this.sidebarNav = document.getElementById('sidebarNav');
        this.isPinned = false;

        this.init();
    }

    init() {
        // 初始化侧边栏状态
        if (isMobile()) {
            this.sidebar.classList.add('collapsed');
        }

        this.setupEventListeners();
        this.setupNavItems();
    }

    setupEventListeners() {
        // 切换按钮事件
        this.sidebarToggle.addEventListener('click', () => {
            if (isMobile()) {
                this.sidebar.classList.toggle('expanded');
            } else {
                this.sidebar.classList.toggle('collapsed');
            }
        });

        // Pin按钮事件
        this.togglePin.addEventListener('click', () => {
            if (isMobile()) {
                this.sidebar.classList.remove('expanded');
            } else {
                this.isPinned = !this.isPinned;
                this.togglePin.classList.toggle('pinned', this.isPinned);
                if (!this.isPinned) {
                    this.sidebar.classList.add('collapsed');
                }
            }
        });

        // 鼠标离开事件
        this.sidebar.addEventListener('mouseleave', () => {
            if (!this.isPinned) {
                this.sidebar.classList.add('collapsed');
            }
        });

        // 鼠标进入切换按钮事件
        this.sidebarToggle.addEventListener('mouseenter', () => {
            this.sidebar.classList.remove('collapsed');
        });

        // 标题点击事件
        this.sidebarTitle.addEventListener('click', () => {
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });

            if (isMobile()) {
                this.sidebar.classList.remove('expanded');
            }
        });

        // 窗口大小变化事件
        window.addEventListener('resize', () => {
            if (!isMobile()) {
                this.sidebar.classList.remove('expanded');
                if (!this.isPinned) {
                    this.sidebar.classList.add('collapsed');
                }
            }
        });
    }

    setupNavItems() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.nav-item').forEach(navItem => {
                    navItem.classList.remove('active');
                });

                item.classList.add('active');

                if (isMobile()) {
                    this.sidebar.classList.remove('expanded');
                }
            });
        });
    }
}