// ==UserScript==
// @name         show-epic-free-games-on-steam-store
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  在 Steam 商店详情页、主页、搜索页、愿望单等醒目标识 Epic 已送过的游戏。已修复详情页多余标记问题。
// @author       biackezio
// @match        https://store.steampowered.com/*
// @match        https://keylol.com/t596303-1-1
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// ==/UserScript==

(function() {
    'use strict';

    const KEYLOL_URL = 'https://keylol.com/t596303-1-1';
    const STORAGE_KEY = 'epic_freebie_ids';

    // 1. 油猴菜单功能：手动更新
    GM_registerMenuCommand("🔄 更新 Epic 赠送游戏名单", () => {
        GM_openInTab(KEYLOL_URL, { active: true });
    });

    const currentUrl = window.location.href;

    // --- 其乐页面逻辑：抓取数据 ---
    if (currentUrl.includes('keylol.com')) {
        const steamLinks = document.querySelectorAll('a[href*="store.steampowered.com/app/"]');
        const freebieIds = new Set();
        steamLinks.forEach(link => {
            const match = link.href.match(/\/app\/(\d+)/);
            if (match) freebieIds.add(match[1]);
        });

        if (freebieIds.size > 0) {
            GM_setValue(STORAGE_KEY, Array.from(freebieIds));
            alert(`成功！已识别并存储 ${freebieIds.size} 个 Epic 限免游戏 ID。`);
        }
        return;
    }
    // 创建左下角悬浮窗
    function createFloatingNotice() {
        if (document.getElementById('epic-float-notice')) return;
        const notice = document.createElement('div');
        notice.id = 'epic-float-notice';
        notice.innerText = '🎁 Epic 曾限时免费赠送此游戏';
        notice.style = `
            position: fixed; bottom: 20px; left: 20px; z-index: 9999;
            background: #ff69b4; color: white; padding: 12px 20px;
            border-radius: 8px; font-weight: bold; font-size: 14px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            border: 2px solid white; animation: slideIn 0.5s ease-out;
        `;
        // 添加简单的滑入动画
        const style = document.createElement('style');
        style.innerHTML = `@keyframes slideIn { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`;
        document.head.appendChild(style);
        document.body.appendChild(notice);
    }
    // --- Steam 页面逻辑 ---
    const freebieSet = new Set(GM_getValue(STORAGE_KEY, []));
    if (freebieSet.size === 0) return;

    // 统一的标签样式
    const createBadge = (fontSize = '12px', margin = '0 5px') => {
        const badge = document.createElement('span');
        badge.innerText = '❤️ E宝的爱';
        badge.className = 'epic-free-badge';
        badge.style = `
            background: #ff69b4; color: white; padding: 1px 6px;
            font-size: ${fontSize}; border-radius: 3px; margin: ${margin};
            font-weight: bold; display: inline-block; vertical-align: middle;
            box-shadow: 0 0 4px rgba(0,0,0,0.3); pointer-events: none;
        `;
        return badge;
    };

    // 绝对定位标签（用于主页/列表盒子左边缘中部）
    const createAbsoluteBadge = () => {
        const badge = document.createElement('div');
        badge.innerText = '❤️ E宝的爱';
        badge.className = 'epic-free-badge-abs';
        badge.style = `
            position: absolute; left: 0; top: 50%; transform: translateY(-50%);
            background: #ff69b4; color: white; padding: 2px 6px;
            font-size: 10px; border-radius: 0 4px 4px 0; font-weight: bold;
            z-index: 10; pointer-events: none; box-shadow: 2px 0 5px rgba(0,0,0,0.3);
        `;
        return badge;
    };
    // 处理不同页面的核心函数
    function processSteamPages() {
        // 判断当前是否在商店详情页
        const isAppPage = currentUrl.includes('/app/');
        const pageAppId = isAppPage ? currentUrl.match(/\/app\/(\d+)/)?.[1] : null;

        // 1. 商店详情页主标题 (#appHubAppName)
        if (isAppPage) {
            const storeTitle = document.querySelector('#appHubAppName:not(.epic-checked)');
            if (storeTitle) {
                storeTitle.classList.add('epic-checked');
                createFloatingNotice();
                if (freebieSet.has(pageAppId)) {
                    storeTitle.appendChild(createBadge('14px', '0 15px'));
                }
            }
        }

        // 2. 搜索结果页、主页列表、以及详情页底部的推荐
        const gameNodes = document.querySelectorAll('[data-ds-appid]:not(.epic-checked)');
        gameNodes.forEach(node => {
            const appId = node.getAttribute('data-ds-appid');

            // --- 关键优化：如果是详情页，跳过标记与主游戏 ID 相同的其他元素 (如侧边栏、列表项) ---
            if (isAppPage && appId === pageAppId) {
                node.classList.add('epic-checked'); // 标记为已处理但不加标签
                return;
            }

            if (freebieSet.has(appId)) {
                node.classList.add('epic-checked');
                // 搜索页、列表页查找插入点
                let titleArea = node.querySelector('.title, .search_name, .title_capsule');
                if (!titleArea) titleArea = node; // 兜底
                if (window.getComputedStyle(node).position === 'static') {
                    node.style.position = 'relative';
                }
                titleArea.prepend(createAbsoluteBadge());
            }
        });

        // 3. 愿望单页面适配
        const wishlistItems = document.querySelectorAll('.wishlist_row:not(.epic-checked)');
        wishlistItems.forEach(item => {
            item.classList.add('epic-checked');
            const link = item.querySelector('a[href*="/app/"]');
            if (link) {
                const appId = link.href.match(/\/app\/(\d+)/)?.[1];
                if (freebieSet.has(appId)) {
                    const titleContainer = item.querySelector('.content .title');
                    if (titleContainer) titleContainer.appendChild(createBadge());
                }
            }
        });
    }

    // 初始执行一次
    processSteamPages();

    // 使用 MutationObserver 监听动态内容
    const observer = new MutationObserver(() => {
        processSteamPages();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();