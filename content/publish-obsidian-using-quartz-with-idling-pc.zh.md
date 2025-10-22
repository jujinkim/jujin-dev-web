---
publish: "false"
lang: zh
title: "使用闲置PC通过Obsidian和Quartz运营博客"
---

## 概述
该博客通过结合使用Obsidian、Obsidian Sync、Quartz以及一台常开的PC（闲置PC），实现了构建和部署的自动化。
其结构是，无论在何处使用Obsidian撰写并同步文章，都会在另一台PC上自动进行构建和部署过程。
这样一来，用户只需专注于写作。

## 文章撰写与同步：Obsidian与Obsidian Sync
所有文章都以Markdown格式在Obsidian中撰写。
无论是在PC还是移动设备上，都可以撰写或修改文章。

通过使用Obsidian的官方付费服务Obsidian Sync，所有设备上的笔记都会实时同步。
这是该系统的核心。它不使用本地文件，而是将Obsidian服务器作为单一事实来源（Single Source of Truth）。

## 自动构建环境：闲置PC
家中一台常开的PC（家庭服务器或台式机）担任此角色。
这台PC上安装了Obsidian应用程序，并使用相同的Obsidian账户登录以同步笔记。

`scripts/obsidian_watch.sh` shell脚本使用 `inotify-tools` 实时检测Obsidian保险库目录中的文件变更。
一旦检测到文件变更，该脚本会自动启动构建和部署过程。

## 构建与部署自动化：Quartz与Shell脚本
`obsidian_watch.sh` 脚本会执行 `obsidian_manual_sync.sh` 脚本。该脚本按顺序执行以下任务：

*   **内容同步**：将Obsidian保险库的最新内容复制（`rsync`）到项目的 `content` 目录。
*   **站点构建**：使用Quartz CLI（`npx quartz build`）将Markdown文件转换为静态网站文件，并构建到 `public` 目录中。
*   **Git推送**：如果存在变更，则使用Git自动提交并将更改推送到远程仓库（GitHub）。

## 最终部署：GitHub Pages与自定义域名连接
当新的提交被推送到主分支时，预先设置好的GitHub Actions工作流将被触发。
该工作流会将 `public` 目录中的静态文件部署到GitHub Pages。

### GitHub Pages设置
进入GitHub仓库的“Settings”中的“Pages”部分。
将“Source”设置为“Deploy from a branch”，将“Branch”选择为 `gh-pages`（或 `main` 分支的 `docs` 文件夹），然后选择 `/(root)` 文件夹。
保存后，GitHub Pages即被激活。

### 自定义域名连接
在GitHub Pages设置的“Custom domain”部分输入您想要的域名，例如 `yourdomain.com`。
在您的域名注册商（DNS提供商）处，为 `yourdomain.com` 设置一个 `A` 记录，指向GitHub Pages服务器的IP地址，并为 `www.yourdomain.com` 设置一个 `CNAME` 记录，指向 `yourusername.github.io`。
DNS设置生效后，您就可以通过 `yourdomain.com` 访问您的博客了。

## 结论
通过这个系统，用户可以完全专注于写作。只需在Obsidian中撰写并保存文章，复杂的构建和部署过程就会自动处理。
该架构的核心思想是使用Obsidian Sync作为中央枢纽，并利用闲置PC作为自动化代理。
通过连接GitHub Pages和自定义域名，您可以轻松运营自己的博客。
