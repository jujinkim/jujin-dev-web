---
publish: true
lang: zh
title: "使用闲置PC通过Obsidian和Quartz运营博客"
---

## 概述
本博客通过Obsidian + Sync、Quartz以及一台始终开启的PC（闲置PC）的组合，实现了构建和部署的自动化。
其结构是，无论身在何处，只要用Obsidian撰写并同步文章，另一台PC就会自动进行构建和部署过程。
这样，用户只需专注于写作。

## 撰写与同步：Obsidian与Obsidian Sync
所有文章都以Markdown格式在Obsidian中撰写。
无论是在PC还是移动设备上，都可以撰写或修改文章。

通过使用Obsidian的官方付费服务Obsidian Sync，所有设备上的笔记都会实时同步。
这是该系统的核心。它不使用本地文件，而是将Obsidian服务器作为单一事实来源（Single Source of Truth）。

## 自动构建环境：闲置PC
家中始终开启的PC（家庭服务器或台式机）担任此角色。
这台PC上安装了Obsidian应用程序，并使用相同的Obsidian账户登录以同步笔记。

使用 `inotify-tools` 实时检测Obsidian保险库目录中的文件更改。
一旦检测到文件更改，就会自动启动构建和部署过程。

## 构建与部署自动化：Quartz与Shell脚本
当检测到文件更改时，将执行以下操作。

*   **内容同步**：将Obsidian保险库的最新内容复制（`rsync`）到项目的 `content` 目录中。
*   **网站构建**：使用Quartz CLI（`npx quartz build`）将Markdown文件转换为静态网站文件，并在 `public` 目录中构建。
*   **Git推送**：如果存在更改，则使用Git自动提交并推送到远程存储库（GitHub）。

## 最终部署：GitHub Pages与自定义域名连接
当新的提交被推送到主分支时，预先设置的GitHub Actions工作流将被触发。
此工作流将 `public` 目录中的静态文件部署到GitHub Pages。

### GitHub Pages 设置
转到GitHub存储库设置中的“Pages”部分。
将“Source”设置为“Deploy from a branch”，将“Branch”选择为 `gh-pages`（或 `main` 分支的 `docs` 文件夹），然后选择 `/(root)` 文件夹。
保存后，GitHub Pages将被激活。

### 自定义域名连接
在GitHub Pages设置的“Custom domain”部分，输入您想要的域名，例如 `yourdomain.com`。
在您的域名注册商（DNS提供商）处，为 `yourdomain.com` 设置一个指向GitHub Pages服务器IP地址的 `A` 记录，并为 `www.yourdomain.com` 设置一个指向 `yourusername.github.io` 的 `CNAME` 记录。
DNS设置生效后，您就可以通过 `yourdomain.com` 访问您的博客了。

## 结论
通过这个系统，用户可以只专注于写作。只需在Obsidian中撰写并保存文章，复杂的构建和部署过程就会自动处理。
使用Obsidian Sync作为中央枢纽，并利用闲置PC作为自动化代理是此架构的核心思想。
通过连接GitHub Pages和自定义域名，您可以轻松运营自己的博客。
