---
publish: true
lang: en
title: "Running a Blog Using Obsidian and Quartz on an Idle PC"
---

## Overview
There are various ways to publish Obsidian to the web, but the easiest method is using Obsidian Publish for $8 a month. This method allows for one-click publishing, and custom domains are automatically handled with just a single DNS setting, making it very convenient. However, customization is limited, and the $8 monthly fee is not cheap. I am using Obsidian Sync ($4) (I consider custom syncs unstable), and I didn't want to spend an additional $8 on top of that.

In this post, I will share the method I used. You can use Obsidian Sync or not, but you will need a computer for publishing (a home server is even better). Since the site itself will be published using GitHub Pages, the home server doesn't need to be running 24/7, but you would have the hassle of turning on the home server every time you write a post. It doesn't matter if it's a personal PC as long as you can run the script.

This blog is built and deployed automatically by combining Obsidian + Sync, Quartz, and an always-on PC (an idle PC).
The structure is such that if you write and sync a post in Obsidian from anywhere, a separate PC automatically handles the build and deployment process.
This allows the user to focus solely on writing.

## Writing and Syncing: Obsidian and Obsidian Sync
All posts are written in Obsidian and automatically saved in Markdown format.
You can write or edit posts on any device supported by the Obsidian client, such as a PC or mobile device.

Using Obsidian's official paid service, Obsidian Sync, notes are synchronized in real-time across all devices. At this time, the notes are also synced to the home server used for uploading posts to GitHub Pages.
This is the core of this system, using the Obsidian server, not local files, as the Single Source of Truth. If you only use Obsidian on a PC, that PC's Obsidian Vault becomes the SSOT.

It is possible to build this without using Obsidian Sync. Whether you do your own sync with Git, use it only on a personal PC, or just automate the part where you select a folder to publish and upload it to GitHub, it works.

## Automatic Build Environment: An Idle PC
A PC that is always on at home (home server or desktop) takes on this role. If you don't have a home server, you can also set it up on a personal PC.
This PC also has the Obsidian app installed and is logged in with the same Obsidian account to sync notes.

I installed Linux on the home server, and here I use `inotify-tools` to detect file changes in the Obsidian vault directory in real-time.
When a file change is detected, the build and deployment process starts automatically.
If automatic deployment is unnecessary, you can skip this part, but you will have to execute the deployment manually on the PC as shown below.

## Build and Deployment Automation: Quartz and Shell Scripts
First, for deployment, you need to create a separate new project folder, not the Obsidian vault. The Obsidian vault is left untouched, and all deployment work is done in the project folder.

`Quartz` is one of the static site builders, a program optimized for publishing Obsidian. It also draws graphs and can build locally.

When a file change is detected in the folder to be published within the Obsidian vault, the following actions are performed.

*   **Content Sync**: Copy the latest content of the Obsidian vault to the project's `content` directory (`rsync`).
*   **Site Build**: Convert markdown files to static website files using the Quartz CLI (`npx quartz build`) and build them in the `public` directory.
*   **Git Push**: If there are changes, automatically commit using Git and push to the remote repository (GitHub).

Since the original Obsidian posts are not touched directly, but copied to a deployment folder and then processed and deployed, the existing posts are safe. Also, instead of deploying the entire Obsidian vault, you can select a deployment folder. This is because only that folder is deployed as the deployment folder.

Here, `processing content within the folder` means automatically adding to the content after copying or creating additional translated copies. In the case of this site, after copying, `Gemini` automatically creates translated copies in 3 languages. Since they are created after copying, unnecessary translations are not seen in the existing Obsidian vault, and because the actual files are "created" and then deployed, they can be searched externally in those languages.

## Final Deployment: GitHub Pages and Custom Domain Connection
When a new commit is pushed to the main branch, a pre-configured GitHub Actions workflow is triggered.
This workflow deploys the static files in the `public` directory to GitHub Pages.

If necessary, the build could be done on GitHub Pages instead of the PC (server), but in this case, the build time would take longer and it is cumbersome to test the website locally. So I chose to build in advance on the PC (server) and upload only the finished pages.

### GitHub Pages Configuration
Actual deployment is published via GitHub -> GitHub Pages. Therefore, you also need to configure Pages.
You can configure GitHub Pages in the "Pages" section of the GitHub repository settings.
Set "Source" to "Deploy from a branch", select `gh-pages` (or the `docs` folder of the `main` branch) for "Branch", and then select the `/(root)` folder.
Once saved, GitHub Pages is activated.

If you have a purchased Custom domain, [configure](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages) it as well.

## Conclusion
Through this system, the user can focus solely on writing. Just writing and saving in Obsidian automatically handles the complex build and deployment process.
The core idea of this structure is to use Obsidian Sync as a central hub and utilize an idle PC as an automation agent. If you don't have an idle PC, running the deployment script once on your own PC will automatically perform "`Obsidian Vault` -> `Copy to Content directory` -> `Process contents` -> `Upload(push)` -> `Publish`".

## Addendum
I didn't code all of this process myself, but developed it with the help of `Codex`, `Claude Code`, and `Gemini`.
Personally, I think Gemini is not yet suitable for ordering coding tasks on a project basis locally, so I am using it only for translation purposes (looking forward to the 3.0 model). If you ask Codex or CC to organize the above content and build a site according to your current environment (whether you have a home server, etc.), they will do it well. Therefore, I did not include script code, etc. in the main text. I am sharing the idea, so I hope you tune it well to fit your environment.
