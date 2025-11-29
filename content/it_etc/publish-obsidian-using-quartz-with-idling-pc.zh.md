---
publish: true
lang: zh
title: "使用闲置 PC 利用 Obsidian 和 Quartz 运营博客"
---

## 概述
将 Obsidian 发布到网络上有多种方法，最简单的方法是使用每月 8 美元的 Obsidian publish。这种方法可以一键发布文章，自定义域名也只需简单的 DNS 设置即可自动完成，非常方便。但是自定义功能受限，而且每月 8 美元的价格并不便宜。我正在使用 Obsidian sync（4 美元）（我认为第三方同步不稳定），不想再为此额外花费 8 美元。

这篇文章将分享我使用的方法。Obsidian Sync 可以使用也可以不使用，但需要一台用于发布的计算机（如果有家庭服务器更好）。网站本身将使用 GitHub Pages 发布，所以家庭服务器不需要 24 小时运行，但每次写文章时都需要打开家庭服务器可能会有些麻烦。如果是个人 PC，只需要执行脚本即可，所以也没关系。

这个博客结合了 Obsidian + Sync、Quartz 以及一台常开的 PC（闲置 PC），实现了构建和部署的自动化。
无论在哪里通过 Obsidian 撰写文章并同步，另一台 PC 都会自动进行构建和部署过程。
通过这种方式，用户可以专注于写作。

## 撰写与同步：Obsidian 和 Obsidian Sync
所有文章都在 Obsidian 中撰写，并自动保存为 Markdown 格式。
可以在 PC、移动设备等任何支持 Obsidian 客户端的设备上撰写或修改文章。

使用 Obsidian 的官方付费服务 Obsidian Sync，所有设备的笔记都会实时同步。此时，用于将文章上传到 GitHub Pages 的家庭服务器上的笔记也会同步。
这是该系统的核心，使用 Obsidian 服务器而不是本地文件作为单一事实来源 (Single Source of Truth)。如果仅在 PC 上使用 Obsidian，那么 PC 的 Obsidian Vault 将成为 SSOT。

即使不使用 Obsidian Sync 也可以搭建。无论是通过 Git 自行同步，还是仅在个人 PC 上使用，只需要自动化选择发布文件夹并上传到 GitHub 的部分即可。

## 自动构建环境：闲置 PC
家里常开的 PC（家庭服务器或台式机）负责此角色。如果没有家庭服务器，也可以在个人 PC 上搭建。
这台 PC 上也安装了 Obsidian 应用程序，并登录相同的 Obsidian 帐户以同步笔记。

我在家庭服务器上安装了 Linux，并使用 `inotify-tools` 实时检测 Obsidian Vault 目录中的文件更改。
一旦检测到文件更改，就会自动开始构建和部署过程。
如果不需要自动部署，可以跳过此部分，但需要在 PC 上手动执行下面的部署操作。

## 构建与部署自动化：Quartz 和 Shell 脚本
首先，为了部署，需要创建一个单独的新项目文件夹，而不是 Obsidian Vault。不要触碰 Obsidian Vault，所有的部署工作都在项目文件夹中进行。

`Quartz` 是静态网站生成器之一，是专门为发布 Obsidian 内容而优化的程序。它还可以绘制图谱，并支持本地构建。

当检测到 Obsidian Vault 内要发布的文件夹有文件更改时，执行以下操作：

*   **内容同步**：将 Obsidian Vault 的最新内容复制到项目的 `content` 目录 (`rsync`)。
*   **网站构建**：使用 Quartz CLI (`npx quartz build`) 将 Markdown 文件转换为静态网站文件，并构建到 `public` 目录。
*   **Git 推送**：如果有更改，使用 Git 自动提交并推送到远程仓库 (GitHub)。

因为不直接修改 Obsidian 文章，而是复制到部署用文件夹后加工该文件夹内的内容进行部署，所以现有文章是安全的。此外，不是部署整个 Obsidian Vault，而是可以选择部署用文件夹。因为只部署该文件夹作为部署用文件夹。

这里所说的 `文件夹内内容加工`，是指复制后通过自动化添加内容或额外生成翻译副本。以本网站为例，复制后 `Gemini` 会自动生成 3 种语言的翻译副本。因为是复制后生成的，所以在原有的 Obsidian Vault 中看不到不必要的翻译版本，而且因为是“生成”实际文件后部署，所以外部也可以搜索到相应的语言版本。

## 最终部署：GitHub Pages 及自定义域名连接
当新的提交被推送到主分支时，预先设置的 GitHub Actions 工作流将被触发。
该工作流将 `public` 目录的静态文件部署到 GitHub Pages。

如有必要，也可以在 GitHub Pages 而不是 PC（服务器）上进行构建，但在这种情况下，构建需要时间，而且在本地测试网站比较麻烦。所以我选择了在 PC（服务器）上预先构建，只上传完成的页面。

### GitHub Pages 设置
实际部署是通过 GitHub -> GitHub Pages 发布的。因此也需要进行 Pages 设置。
可以在 GitHub 仓库设置的 "Pages" 部分配置 GitHub Pages。
将 "Source" 设置为 "Deploy from a branch"，将 "Branch" 选择为 `gh-pages`（或 `main` 分支的 `docs` 文件夹），然后选择 `/(root)` 文件夹。
保存后 GitHub Pages 即被激活。

如果你购买了 Custom domain，也请一并[设置](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages)。

## 结论
通过该系统，用户可以专注于文章撰写。只需在 Obsidian 中撰写并保存文章，复杂的构建和部署过程就会自动处理。
使用 Obsidian Sync 作为中心枢纽，利用闲置 PC 作为自动化代理，是该架构的核心理念。如果没有闲置 PC，只要在自己的 PC 上运行一次部署脚本，就会自动完成 "`Obsidian Vault` -> `Copy to Content directory` -> `Process contents` -> `Upload(push)` -> `Publish`" 的过程。

## 补充
这整个过程并非我直接编写代码，而是在 `Codex`、`Claude Code`、`Gemini` 的帮助下开发的。
个人认为 Gemini 目前还不适合按项目单位执行本地编码任务，所以只用于翻译用途（期待 3.0 模型）。如果向 Codex 或 CC 说明目前的本人环境（是否有家庭服务器等）并要求整理上述内容来构建网站，它们会做得很好。因此正文中没有包含脚本代码等。分享这个想法，希望大家能根据自己的环境进行很好的调整。
