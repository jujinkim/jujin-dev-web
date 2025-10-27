---
publish: true
lang: en
title: "Operating a Blog with Obsidian and Quartz Using an Idle PC"
---

## Overview
There are various ways to publish Obsidian content on the web, but the easiest method is to use Obsidian Publish for $8 per month. This method allows you to publish articles with a single click, and custom domains are handled automatically with just one DNS setting, making it very convenient. However, customization is limited, and the $8 monthly fee is not cheap. I am currently using Obsidian Sync ($4), as I find custom sync solutions to be unstable, and I didn't want to spend an additional $8 on top of that.

In this article, I will share the method I used. You can use Obsidian Sync or not, but you will need a dedicated computer for publishing (a home server is even better). The site itself will be published using GitHub Pages, so the home server doesn't need to be running 24/7, but you will have the inconvenience of turning it on every time you write a post. Even a personal PC will work, as you just need to run a script.

This blog is built and deployed automatically using a combination of Obsidian + Sync, Quartz, and an always-on PC (an idle PC).
It's structured so that when you write and sync an article in Obsidian from anywhere, the build and deployment process runs automatically on a separate PC.
This allows the user to focus solely on writing.

## Content Creation and Synchronization: Obsidian and Obsidian Sync
All articles are written in Obsidian and automatically saved in Markdown format.
You can write or edit articles on any device supported by the Obsidian client, such as a PC or mobile device.

Using Obsidian's official paid service, Obsidian Sync, notes are synchronized in real-time across all devices. At this point, the notes are also synchronized to the home server, which is used to upload the articles to GitHub Pages.
This is the core of the system: using the Obsidian server, not local files, as the Single Source of Truth (SSOT). If you only use Obsidian on a PC, then that PC's Obsidian Vault becomes the SSOT.

It is possible to set this up without using Obsidian Sync. This is because you only need to automate the part where you select the folder to be published and upload it to GitHub, whether you use your own sync method like Git or just use it on a personal PC.

## Automated Build Environment: An Idle PC
An always-on PC at home (a home server or desktop) handles this role. If you don't have a home server, it can also be set up on a personal PC.
The Obsidian app is also installed on this PC, and it synchronizes notes by logging into the same Obsidian account.

I installed Linux on the home server, where I use `inotify-tools` to detect file changes in the Obsidian vault directory in real-time.
When a file change is detected, it automatically starts the build and deployment process.
If automatic deployment is unnecessary, you can skip this part, but you will have to run the deployment process below manually from your PC.

## Build and Deployment Automation: Quartz and Shell Scripts
First, for deployment, you need to create a separate, new project folder, not use the Obsidian vault directly. The Obsidian vault is left untouched, and all deployment tasks are carried out in the project folder.

`Quartz` is one of the static website builders, and it is optimized for publishing Obsidian content. It can also generate graphs and can be built locally.

When a file change is detected in the folder to be deployed within the Obsidian vault, the following actions are performed.

*   **Content Synchronization**: Copy the latest content from the Obsidian vault to the project's `content` directory (`rsync`).
*   **Site Build**: Use the Quartz CLI (`npx quartz build`) to convert Markdown files into static website files and build them in the `public` directory.
*   **Git Push**: If there are changes, automatically commit and push them to the remote repository (GitHub) using Git.

Because the content is copied to a deployment folder and processed there before being deployed, without directly touching the original Obsidian articles, the original articles remain safe. Furthermore, you can select a specific folder for deployment instead of deploying the entire Obsidian vault. This is because only the contents of that specific folder are prepared for deployment.

Here, 'processing the content within the folder' means automatically augmenting the content after copying it or generating additional translated copies. In the case of this site, after copying, `Gemini` automatically generates translated copies in three languages. Since the generation happens after copying, the original Obsidian vault does not show unnecessary translated versions, and because actual files are "generated" before deployment, they can be found by external search engines in those languages.

## Final Deployment: GitHub Pages and Custom Domain Connection
When a new commit is pushed to the main branch, a pre-configured GitHub Actions workflow is triggered.
This workflow deploys the static files from the `public` directory to GitHub Pages.

If necessary, the build could be done on GitHub Pages instead of the PC (server), but this would take build time and make it cumbersome to test the website locally. Therefore, I chose to pre-build on the PC (server) and upload only the finished pages.

### GitHub Pages Configuration
The actual deployment is published via GitHub -> GitHub Pages. Therefore, you also need to configure Pages.
You can configure GitHub Pages in the "Pages" section of your GitHub repository settings.
Set "Source" to "Deploy from a branch", select the "Branch" as `gh-pages` (or the `docs` folder in the `main` branch), and then select the `/(root)` folder.
Saving this will activate GitHub Pages.

If you have purchased a custom domain, you can set it up here as well.

## Conclusion
This system allows the user to focus solely on writing. Just by writing and saving in Obsidian, the complex build and deployment process is handled automatically.
Using Obsidian Sync as a central hub and leveraging an idle PC as an automation agent is the core idea of this structure. If you don't have an idle PC, simply running the deployment script once on your own PC will automatically perform the "`Obsidian Vault` -> `Copy to Content directory` -> `Process contents` -> `Upload(push)` -> `Publish`" sequence.

## Additionally
I did not code this entire process by myself; I developed it with the help of `Codex`, `Claude Code`, and `Gemini`.
Personally, I feel that Gemini is not yet suitable for project-level coding tasks locally, so I am only using it for translation purposes (I am looking forward to the 3.0 model). If you ask Codex or CC to build a site by summarizing the above content along with your current environment (e.g., whether you have a home server), they will do a good job. Therefore, I have not included script codes in the main text. I am sharing the idea, so I hope you will tune it well to fit your own environment.
