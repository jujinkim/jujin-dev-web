---
publish: true
lang: zh
title: "使用闲置PC通过Obsidian和Quartz运营博客"
---

## 概述
将Obsidian发布到网络上有多种方法，最简单的是每月花费8美元使用Obsidian Publish。这种方法只需一键即可发布文章，自定义域名也只需进行一次DNS设置，一切都会自动进行，非常方便。但缺点是定制性有限，而且每月8美元的价格并不便宜。我正在使用Obsidian Sync（4美元）（我认为自定义同步不稳定），不想在此基础上再额外花费8美元。

本文将分享我使用的方法。Obsidian Sync可有可无，但需要一台用于发布的电脑（最好是家庭服务器）。网站本身将使用GitHub Pages发布，因此家庭服务器不必24小时运行，但每次写文章时都需要打开家庭服务器，会有些麻烦。即使是个人PC，只要运行脚本即可，所以也没关系。

这个博客是通过结合Obsidian + Sync、Quartz以及一台常开的PC（闲置PC）来自动构建和部署的。
其结构是，无论在哪里用Obsidian撰写并同步文章，另一台PC都会自动进行构建和部署过程。
这样，用户就可以只专注于写作。

## 写作与同步：Obsidian与Obsidian Sync
所有文章都在Obsidian中撰写，并自动以Markdown格式保存。
可以在任何支持Obsidian客户端的设备上（如PC、手机等）撰写或修改文章。

通过Obsidian的官方付费服务Obsidian Sync，所有设备的笔记都会实时同步。此时，用于将文章上传到GitHub Pages的家庭服务器上的笔记也会同步。
这是该系统的核心，即使用Obsidian服务器而非本地文件作为单一事实来源（Single Source of Truth）。如果只在PC上使用Obsidian，那么PC上的Obsidian Vault就成为SSOT。

即使不使用Obsidian Sync，也可以构建该系统。因为无论是使用Git等进行自定义同步，还是只在个人PC上使用，只需将选择要发布的文件夹并上传到GitHub的部分自动化即可。

## 自动构建环境：闲置PC
家里常开的PC（家庭服务器或台式机）担任此角色。如果没有家庭服务器，也可以在个人PC上构建。
这台PC上也安装了Obsidian应用，并使用相同的Obsidian账户登录以同步笔记。

我在家庭服务器上安装了Linux，并使用`inotify-tools`实时检测Obsidian Vault目录中的文件更改。
当检测到文件更改时，会自动开始构建和部署过程。
如果不需要自动部署，可以跳过此部分，但需要手动在PC上执行下面的部署操作。

## 构建与部署自动化：Quartz与Shell脚本
首先，为了部署，需要创建一个新的项目文件夹，而不是Obsidian Vault。所有部署工作都在项目文件夹中进行，不触及Obsidian Vault。

`Quartz`是静态网站生成器之一，是为发布Obsidian而优化的程序。它可以绘制图表，也可以在本地构建。

当检测到Obsidian Vault内要部署的文件夹中的文件发生更改时，将执行以下操作。

*   **内容同步**：将Obsidian Vault的最新内容复制到项目的`content`目录（`rsync`）。
*   **网站构建**：使用Quartz CLI（`npx quartz build`）将Markdown文件转换为静态网站文件，并在`public`目录中构建。
*   **Git推送**：如果发生更改，则使用Git自动提交并推送到远程仓库（GitHub）。

由于不直接接触Obsidian文章，而是将其复制到部署文件夹后处理该文件夹内的内容进行部署，因此现有文章是安全的。此外，可以选择要部署的文件夹，而不是部署整个Obsidian Vault。因为只有该文件夹会被部署到部署文件夹。

这里的“处理文件夹内的内容”是指在复制后通过自动化为内容添加额外信息或创建翻译副本。以本网站为例，复制后`Gemini`会自动生成三种语言的翻译副本。由于是在复制后生成，因此在现有的Obsidian Vault中不会看到不必要的翻译版本，并且因为是实际“生成”文件后进行部署，所以也可以通过相应语言从外部进行搜索。

## 最终部署：GitHub Pages与自定义域名连接
当新的提交被推送到主分支时，会触发预先设置好的GitHub Actions工作流。
该工作流将`public`目录中的静态文件部署到GitHub Pages。

如果需要，也可以在GitHub Pages上进行构建，而不是在PC（服务器）上，但这样会花费构建时间，并且在本地测试网站会很麻烦。因此，我选择在PC（服务器）上预先构建，只上传完成的页面。

### GitHub Pages设置
实际部署是通过GitHub -> GitHub Pages发布的。因此也需要进行Pages设置。
可以在GitHub仓库设置的“Pages”部分设置GitHub Pages。
将“Source”设置为“Deploy from a branch”，将“Branch”选择为`gh-pages`（或`main`分支的`docs`文件夹），然后选择`/(root)`文件夹。
保存后，GitHub Pages即被激活。

如果你有购买的自定义域名，可以一并进行[设置](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages)。

## 结论
通过这个系统，用户可以只专注于写作。只需在Obsidian中撰写并保存文章，复杂的构建和部署过程就会自动处理。
该结构的核心思想是使用Obsidian Sync作为中央枢纽，并利用闲置PC作为自动化代理。如果没有闲置PC，只需在自己的PC上运行一次部署脚本，即可自动完成“`Obsidian Vault` -> `Copy to Content directory` -> `Process contents` -> `Upload(push)` -> `Publish`”的整个过程。

## 补充
我并非亲自编写了所有这些过程的代码，而是在`Codex`、`Claude Code`和`Gemini`的帮助下开发的。
我个人认为Gemini目前还不适合在本地进行项目级别的编码工作，所以只用于翻译（期待3.0模型）。如果你向Codex或CC说明你当前的环境（是否有家庭服务器等）并请求他们根据上述内容构建网站，他们会做得很好。因此，本文中未包含脚本代码等。我分享的是想法，希望你能根据自己的环境进行调整。
