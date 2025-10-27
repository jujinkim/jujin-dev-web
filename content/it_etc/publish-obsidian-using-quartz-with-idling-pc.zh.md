---
publish: true
lang: zh
title: "使用闲置PC通过Obsidian和Quartz运营博客"
---

## 概述
将Obsidian发布到网络上有多种方法，最简单的方法是每月支付8美元使用Obsidian Publish。这种方法只需一键即可发布文章，自定义域名也只需设置一个DNS记录即可自动完成所有操作，非常方便。但定制性有限，而且每月8美元的价格并不便宜。我正在使用Obsidian Sync（4美元）（我认为自定义同步不稳定），不想再额外花费8美元。

本文将分享我使用的方法。Obsidian Sync可有可无，但需要一台用于发布的电脑（最好是家庭服务器）。网站本身将使用GitHub Pages发布，因此家庭服务器不必24小时运行，但每次写文章时都需要打开家庭服务器，会有些麻烦。即使是个人PC，只要运行脚本即可，所以没关系。

这个博客是结合Obsidian + Sync、Quartz以及一台常开的PC（闲置PC）来自动化构建和部署的。
无论在哪里用Obsidian撰写和同步文章，都会在另一台PC上自动进行构建和部署。
这样，用户就可以只专注于写作。

## 撰写与同步：Obsidian与Obsidian Sync
所有文章都在Obsidian中撰写，并自动以Markdown格式保存。
可以在PC、移动设备等任何支持Obsidian客户端的设备上撰写或修改文章。

使用Obsidian的官方付费服务Obsidian Sync，所有设备的笔记都会实时同步。此时，用于将文章上传到GitHub Pages的家庭服务器上的笔记也会同步。
这是该系统的核心，即使用Obsidian服务器而不是本地文件作为单一事实来源（Single Source of Truth）。如果只在PC上使用Obsidian，那么PC的Obsidian Vault就成为SSOT。

即使不使用Obsidian Sync，也可以构建该系统。因为无论是使用Git等进行自定义同步，还是只在个人PC上使用，只需将选择要发布的文件夹并上传到GitHub的部分自动化即可。

## 自动构建环境：闲置PC
家里常开的PC（家庭服务器或台式机）担任此角色。如果没有家庭服务器，也可以在个人PC上构建。
这台PC也安装了Obsidian应用程序，并使用相同的Obsidian帐户登录以同步笔记。

我在家庭服务器上安装了Linux，并使用`inotify-tools`实时检测Obsidian Vault目录中的文件更改。
当检测到文件更改时，会自动开始构建和部署过程。
如果不需要自动部署，可以跳过此部分，但需要手动在PC上执行以下部署。

## 构建与部署自动化：Quartz与Shell脚本
首先，为了部署，需要创建一个新的项目文件夹，而不是Obsidian Vault。所有部署工作都在项目文件夹中进行，不触及Obsidian Vault。

`Quartz`是静态网站生成器之一，是为发布Obsidian而优化的程序。它还可以绘制图表，并可以在本地构建。

当检测到Obsidian Vault内要部署的文件夹中的文件更改时，将执行以下操作。

*   **内容同步**：将Obsidian Vault的最新内容复制（`rsync`）到项目的`content`目录。
*   **网站构建**：使用Quartz CLI（`npx quartz build`）将Markdown文件转换为静态网站文件，并在`public`目录中构建。
*   **Git推送**：如果有更改，则使用Git自动提交并推送到远程存储库（GitHub）。

由于不直接触及Obsidian文章，而是将其复制到部署文件夹后处理该文件夹中的内容进行部署，因此现有文章是安全的。此外，可以选择要部署的文件夹，而不是部署整个Obsidian Vault。因为只将该文件夹部署到部署文件夹。

这里的“处理文件夹中的内容”是指在复制后通过自动化为内容添加内容或额外生成翻译副本。就本网站而言，复制后`Gemini`会自动生成3种语言的翻译副本。由于是在复制后生成，因此在现有的Obsidian Vault中不会看到不必要的翻译版本，并且由于在部署后实际“生成”了文件，因此也可以用该语言从外部搜索到。

## 最终部署：GitHub Pages与自定义域名连接
当新的提交被推送到主分支时，会触发预先设置的GitHub Actions工作流程。
此工作流程将`public`目录中的静态文件部署到GitHub Pages。

如果需要，也可以在GitHub Pages而不是PC（服务器）上进行构建，但在这种情况下，会花费构建时间，并且在本地测试网站会很麻烦。因此，我选择在PC（服务器）上预先构建，只上传完成的页面。

### GitHub Pages设置
实际部署是通过GitHub -> GitHub Pages发布的。因此也需要设置Pages。
可以在GitHub存储库设置的“Pages”部分设置GitHub Pages。
将“Source”设置为“Deploy from a branch”，将“Branch”选择为`gh-pages`（或`main`分支的`docs`文件夹），然后选择`/(root)`文件夹。
保存后，GitHub Pages将被激活。

如果您有购买的自定义域名，请一起设置。

## 结论
通过该系统，用户可以只专注于写作。只需在Obsidian中撰写和保存文章，复杂的构建和部署过程就会自动处理。
使用Obsidian Sync作为中央枢纽，并利用闲置PC作为自动化代理是该结构的核心思想。如果没有闲置PC，只需在您的PC上运行一次部署脚本，即可自动完成“`Obsidian Vault` -> `Copy to Content directory` -> `Process contents` -> `Upload(push)` -> `Publish`”。

## 补充
我并没有亲自编写所有这些过程的代码，而是在`Codex`、`Claude Code`和`Gemini`的帮助下开发的。
我个人认为Gemini还不适合在本地以项目为单位进行编码工作，因此我只将其用于翻译（期待3.0模型）。如果您向Codex或CC说明您当前的环境（是否有家庭服务器等）并要求他们构建网站，他们会做得很好。因此，本文不包含脚本代码等。我分享了我的想法，希望您可以根据自己的环境进行调整。
