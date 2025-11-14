---
publish: true
lang: zh
title: "使用闲置PC通过Obsidian和Quartz运营博客"
---

## 概述
将Obsidian发布到网络的方法多种多样，最简单的方法是每月支付8美元使用Obsidian publish。这种方法的优点是，只需一键即可发布文章，自定义域名也只需一个DNS设置，一切都会自动进行，非常方便。但它的定制性有限，而且每月8美元的价格也不算便宜。我正在使用Obsidian sync（4美元）（我认为自定义同步不稳定），不想在此基础上再额外花费8美元。

本文旨在分享我所使用的方法。Obsidian Sync可有可无，但需要一台用于发布的电脑（最好是家庭服务器）。网站本身将使用GitHub Pages发布，因此家庭服务器无需24小时运行，但每次写作时都需要打开家庭服务器，这可能会有些麻烦。即使是个人PC，只要能运行脚本就没关系。

这个博客通过结合Obsidian + Sync、Quartz以及一台常开的PC（闲置PC），实现了构建和部署的自动化。
无论身在何处，只要用Obsidian写作并同步，另一台PC就会自动进行构建和部署。
这样，用户就可以只专注于写作。

## 写作与同步：Obsidian和Obsidian Sync
所有文章都在Obsidian中撰写，并自动以Markdown格式保存。
可以在任何支持Obsidian客户端的设备上（如PC、移动设备等）撰写或修改文章。

通过使用Obsidian的官方付费服务Obsidian Sync，所有设备的笔记都会实时同步。此时，笔记也会同步到用于将文章上传到GitHub Pages的家庭服务器上。
这是该系统的核心，它使用Obsidian服务器而非本地文件作为单一事实来源（Single Source of Truth）。如果只在PC上使用Obsidian，那么PC上的Obsidian Vault就成为SSOT。

不使用Obsidian Sync也可以构建该系统。因为只需将要发布的文件夹通过Git等方式自行同步，或者只在个人PC上使用，然后将选择的文件夹上传到GitHub的部分自动化即可。

## 自动构建环境：闲置PC
家里常开的PC（家庭服务器或台式机）担任此角色。如果没有家庭服务器，也可以在个人PC上构建。
这台PC上也安装了Obsidian应用，并使用相同的Obsidian账户登录以同步笔记。

我在家庭服务器上安装了Linux，并使用`inotify-tools`实时检测Obsidian vault目录中的文件变更。
当检测到文件变更时，会自动启动构建和部署过程。
如果不需要自动部署，可以跳过此部分，但需要手动在PC上执行下面的部署步骤。

## 构建与部署自动化：Quartz和Shell脚本
首先，为了部署，需要创建一个新的项目文件夹，而不是直接使用Obsidian vault。所有部署工作都在项目文件夹中进行，不触及Obsidian vault。

`Quartz`是静态网站生成器之一，它对发布Obsidian内容进行了优化。它还可以绘制图表，并支持本地构建。

当检测到Obsidian vault内待发布文件夹的文件变更时，将执行以下操作。

*   **内容同步**：使用`rsync`将Obsidian vault的最新内容复制到项目的`content`目录。
*   **网站构建**：使用Quartz CLI（`npx quartz build`）将Markdown文件转换为静态网站文件，并在`public`目录中构建。
*   **Git推送**：如果存在变更，使用Git自动提交并推送到远程仓库（GitHub）。

由于不直接操作Obsidian文章，而是将其复制到部署文件夹后处理该文件夹内的内容进行部署，因此现有文章是安全的。此外，可以选择要部署的文件夹，而不是部署整个Obsidian vault。因为只有该文件夹会被部署到发布目录。

这里的“处理文件夹内的内容”是指在复制后通过自动化为内容增添内容或额外创建翻译副本。就本站而言，复制后`Gemini`会自动生成3种语言的翻译副本。因为是在复制后创建，所以不必要的翻译版本不会出现在现有的Obsidian vault中，并且由于是实际“创建”文件后进行部署，因此也可以通过相应语言从外部搜索到。

## 最终部署：GitHub Pages及自定义域名连接
当新的提交被推送到主分支时，预设的GitHub Actions工作流将被触发。
此工作流将`public`目录中的静态文件部署到GitHub Pages。

如有需要，也可以在GitHub Pages上进行构建，而不是在PC（服务器）上，但这样会花费构建时间，并且在本地测试网站会比较麻烦。因此，我选择在PC（服务器）上预先构建，然后只上传完成的页面。

### GitHub Pages 设置
实际部署是通过 GitHub -> GitHub Pages 发布的。因此也需要进行Pages设置。
可以在GitHub仓库设置的“Pages”部分设置GitHub Pages。
将“Source”设置为“Deploy from a branch”，将“Branch”选择为`gh-pages`（或`main`分支的`docs`文件夹），然后选择`/(root)`文件夹。
保存后，GitHub Pages即被激活。

如果您有自己购买的自定义域名，可以一并进行[设置](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages)。

## 结论
通过这个系统，用户可以只专注于写作。只需在Obsidian中写作并保存，复杂的构建和部署过程就会自动处理。
使用Obsidian Sync作为中央枢纽，并利用闲置PC作为自动化代理是该架构的核心思想。如果没有闲置PC，只需在自己的PC上运行一次部署脚本，即可自动完成“`Obsidian Vault` -> `复制到Content目录` -> `处理内容` -> `上传(推送)` -> `发布`”的整个流程。

## 补充
我并没有亲自编写所有这些过程的代码，而是在`Codex`、`Claude Code`和`Gemini`的帮助下开发的。
我个人认为Gemini目前还不适合在本地进行项目级别的编码工作，所以只用它来进行翻译（期待3.0模型）。
如果你向Codex或CC说明你当前的环境（如是否有家庭服务器等）并整理上述内容，要求他们构建网站，他们会做得很好。因此，本文中未包含脚本代码等。我分享的是一个想法，希望你能根据自己的环境进行适当的调整。
