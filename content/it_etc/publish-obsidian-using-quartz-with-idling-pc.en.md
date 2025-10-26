---
publish: true
lang: en
title: "Running a Blog with Obsidian and Quartz Using an Idle PC"
---

## Overview
There are various ways to publish Obsidian content on the web, but the easiest is to use Obsidian Publish for $8/month. This method allows you to publish articles with a single click, and custom domains are handled automatically with just one DNS setting, making it very convenient. However, customization is limited, and $8/month is not cheap. I'm currently using Obsidian Sync ($4/month) (I find custom sync solutions to be unstable), and I didn't want to spend an additional $8 on top of that.

In this article, I'll share the method I used. You can use Obsidian Sync or not, but you will need a dedicated computer for publishing (a home server is even better). The site itself will be published using GitHub Pages, so the home server doesn't need to be running 24/7, but it can be a hassle to turn it on every time you want to write a post. It doesn't matter if it's a personal PC, as long as you can run the script.

This blog is set up with an automated build and deployment process using a combination of Obsidian + Sync, Quartz, and an always-on PC (an idle PC).
When you write and sync an article in Obsidian from anywhere, the build and deployment process is automatically handled by a separate PC.
This allows the user to focus solely on writing.

## Writing and Syncing: Obsidian and Obsidian Sync
All articles are written in Obsidian and automatically saved in Markdown format.
You can write or edit articles on any device supported by the Obsidian client, such as a PC or mobile device.

Using Obsidian's official paid service, Obsidian Sync, all notes are synchronized in real-time across all devices. At this point, the notes are also synced to the home server, which is used to upload the articles to GitHub Pages.
This is the core of the system: using the Obsidian server, not local files, as the Single Source of Truth (SSOT). If you only use Obsidian on a PC, then that PC's Obsidian Vault becomes the SSOT.

It's possible to set this up without using Obsidian Sync. You can automate the part where you select a folder to publish and upload it to GitHub, whether you use Git for your own sync or just use it on a personal PC.

## Automated Build Environment: An Idle PC
An always-on PC at home (a home server or desktop) takes on this role. If you don't have a home server, you can also set it up on your personal PC.
The Obsidian app is also installed on this PC, and it's logged into the same Obsidian account to sync notes.

I installed Linux on the home server, where I use `inotify-tools` to detect file changes in the Obsidian vault directory in real-time.
When a file change is detected, it automatically starts the build and deployment process.
If automatic deployment is unnecessary, you can skip this part, but you will have to run the deployment process below manually from your PC.

## Build and Deployment Automation: Quartz and Shell Scripts
First, for deployment, you need to create a separate, new project folder, not use the Obsidian vault directly. The Obsidian vault is left untouched, and all deployment tasks are performed in the project folder.

`Quartz` is one of the static website builders, and it's optimized for publishing Obsidian content. It can also draw graphs and build locally.

When a file change is detected in the folder to be deployed within the Obsidian vault, the following actions are performed:

*   **Content Sync**: Copies the latest content from the Obsidian vault to the project's `content` directory (`rsync`).
*   **Site Build**: Uses the Quartz CLI (`npx quartz build`) to convert Markdown files into static website files and builds them in the `public` directory.
*   **Git Push**: If there are changes, it automatically commits and pushes them to the remote repository (GitHub) using Git.

Because the Obsidian articles are not touched directly, but are copied to a deployment folder and then processed, the original articles are safe. Also, you can choose which folder to deploy, rather than deploying the entire Obsidian vault. Only that folder is deployed to the deployment folder.

Here, `processing the content within the folder` means automatically adding to the content or creating translated copies after copying. In the case of this site, after copying, `Gemini` automatically generates translated copies in three languages. Because the generation happens after copying, unnecessary translated versions are not visible in the original Obsidian vault, and since the actual files are "created" before deployment, they can be found by external search engines in that language.

## Final Deployment: GitHub Pages and Custom Domain Connection
When a new commit is pushed to the main branch, a pre-configured GitHub Actions workflow is triggered.
This workflow deploys the static files from the `public` directory to GitHub Pages.

If necessary, the build could be done on GitHub Pages instead of the PC (server), but this would take build time and make it cumbersome to test the website locally. So I chose to pre-build on the PC (server) and upload only the finished pages.

### GitHub Pages Setup
The actual deployment is published via GitHub -> GitHub Pages. Therefore, you also need to configure Pages.
You can set up GitHub Pages in the "Pages" section of your GitHub repository settings.
Set "Source" to "Deploy from a branch", select `gh-pages` (or the `docs` folder in the `main` branch) for the "Branch", and then select the `/(root)` folder.
Save the settings to activate GitHub Pages.

If you have a custom domain you've purchased, set it up as well.

## Conclusion
This system allows the user to focus solely on writing. The complex build and deployment process is handled automatically just by writing and saving in Obsidian.
The key idea of this architecture is to use Obsidian Sync as a central hub and an idle PC as an automation agent. If you don't have an idle PC, you can just run the deployment script once on your own PC, and the process of "`Obsidian Vault` -> `Copy to Content directory` -> `Process contents` -> `Upload(push)` -> `Publish`" will happen automatically.

## Addendum
I didn't code this entire process myself; I developed it with the help of `Codex`, `Claude Code`, and `Gemini`.
Personally, I feel that Gemini is not yet suitable for project-level coding tasks locally, so I'm only using it for translation purposes (and looking forward to the 3.0 model). If you explain your current environment (whether you have a home server, etc.) to Codex or CC and ask them to build a site based on the information above, they should do a good job. Therefore, I haven't included script code in this article. I'm sharing the idea, so I hope you can tune it well to your own environment.
