# 🎮 E宝的爱标识助手 | 在 Steam 显示 E 宝送过的游戏 (Show Epic Free Games On Steam Store)

**E宝的爱标识助手** 是一款基于 Tampermonkey（油猴）编写的轻量级增强脚本。它能帮助你在浏览 Steam 商店时，一眼识别出哪些游戏曾在 **Epic Games Store** 开启过限时免费领取。

避免“背刺”，从看到那个**粉色标签**开始！

---

## 📸 效果展示

| 商店详情页 (粉色标签 + 左下角悬浮) | 首页/搜索页 (盒子边缘对齐) |
| :--- | :--- |
| ![详情页截图](./screenshots/screenshots1.png) | ![列表页截图](./screenshots/screenshots2.png) |

> **提示**：如果在详情页没看到悬浮窗，请检查是否已按照下方教程更新了限免名单。
---

## ✨ 主要功能

* **全页面适配**：支持 Steam 商店首页、搜索页、游戏详情页。
* **醒目标识**：在详情页标题后添加**粉底白字**标签，并在左下角显示**永久悬浮窗**。
* **精准对齐**：在主页和列表页，标签会自动对齐游戏盒子的**左侧边缘中部**，不遮挡关键信息。
* **数据同步**：支持自动抓取并更新 Epic 历史限免名单。

---

## 🚀 安装与使用

### 第一步：安装脚本管理器

你需要先在浏览器中安装一个脚本管理器插件（推荐使用 **Tampermonkey**）：

* [Chrome 商店安装](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
* [Edge 商店安装](https://www.google.com/search?q=https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkmonpdeodbobnefkaheebkbgnbhb)
* [Firefox 商店安装](https://addons.mozilla.org/zh-CN/firefox/addon/tampermonkey/)

### 第二步：添加脚本

1. 点击浏览器工具栏上的油猴图标，选择 **“添加新脚本”**。
2. 清空编辑器中的默认代码。
3. 将本仓库提供的 `show-epic-free-games-on-steam-store-2.0.user.js` 代码全部复制并粘贴进去。
4. 点击左上角的 **“文件” -> “保存”**。

### 第三步：初始化数据 (必须)

脚本初次安装后由于没有名单数据，不会显示标签。请执行以下操作：

1. 打开 [Steam 商店](https://store.steampowered.com/) 任意页面。
2. 点击油猴插件图标，在菜单中找到并点击 **“🔄 更新 Epic 限免名单”**。
3. 脚本会自动跳转到 Keylol 相关的限免索引页，等待页面加载完成并弹出“成功存储”的提示框。
4. 刷新 Steam 页面，即可看到效果！

---

## 🛠️ 常见问题 (FAQ)

**Q: 为什么我安装了脚本但没看到标签？**
A: 请确保你执行了上述的“初始化数据”步骤。如果没有数据缓存，脚本是无法识别游戏的。

**Q: 名单会过期吗？**
A: Epic 每周都会送新游戏。建议每隔一段时间通过油猴菜单手动点击“更新”，保持名单最新。

**Q: 想要修改标签颜色怎么办？**
A: 在脚本代码的 `createBadge` 和 `createAbsoluteBadge` 函数中，修改 `#ff69b4`（粉色）为你喜欢的 Hex 颜色代码即可。

---

## 📜 免责声明

本脚本仅供交流学习使用，数据来源于其乐社区公开整理。脚本不收集任何用户信息，所有识别逻辑均在本地浏览器端完成。

---

**想要调整其他功能或反馈 Bug？欢迎联系我！**

