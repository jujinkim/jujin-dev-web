---
publish: "false"
title: "使用闲置PC通过Obsidian和Quartz发布内容"
lang: zh
---

# 使用闲置PC通过Obsidian和Quartz运营博客

1.  **概述**
    本博客通过结合使用Obsidian、Obsidian Sync、Quartz以及一台常开的PC（闲置PC），实现了构建和部署的自动化。无论身在何处，只要用Obsidian撰写并同步文章，独立的PC就会自动完成构建和部署过程。

2.  **文章撰写与同步：Obsidian与Obsidian Sync**
    所有文章均以Markdown格式在Obsidian中撰写。您可以在PC、移动设备等任何设备上撰写或修改文章。通过使用Obsidian的官方付费服务Obsidian Sync，所有设备上的笔记都会实时同步。这是该系统的核心，它不使用本地文件，而是将Obsidian服务器作为单一事实来源（Single Source of Truth）。

3.  **自动构建环境：闲置PC**
    家中一台常开的PC（家庭服务器或台式机）担任此角色。这台PC上安装了Obsidian应用，并使用相同的Obsidian账户登录以同步笔记。`scripts/obsidian_watch.sh` shell脚本使用`inotify-tools`实时检测Obsidian保险库目录中的文件变更。

4.  **构建与部署自动化：Quartz与Shell脚本**
    当检测到文件变更时，`obsidian_watch.sh`脚本会执行`obsidian_manual_sync.sh`脚本。该脚本按顺序执行以下任务：
    - 将Obsidian保险库的最新内容复制（`rsync`）到`content`目录。
    - 使用Quartz CLI（`npx quartz build`）将静态网站文件构建到`public`目录。
    - 如果有变更，则使用Git自动提交并将更改推送到远程仓库（GitHub）。

5.  **最终部署：GitHub Actions**
    当新的提交被推送到主分支时，预设的GitHub Actions工作流将被触发。该工作流将`public`目录中的静态文件部署到GitHub Pages，最终使新内容在`dev.jujin.kim`域名上可见。

6.  **结论**
    通过这个系统，用户可以只专注于内容创作。只需在Obsidian中撰写并保存文章，复杂的构建和部署过程就会自动处理。该架构的核心思想是使用Obsidian Sync作为中央枢纽，并利用闲置PC作为自动化代理。
