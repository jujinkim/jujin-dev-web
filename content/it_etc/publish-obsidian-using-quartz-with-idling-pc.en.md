---
publish: true
lang: en
title: "Running a Blog Using Obsidian and Quartz with an Idle PC"
---

## Overview
There are various ways to publish Obsidian to the web, but the easiest method is to use Obsidian Publish for $8/month. This method allows you to publish posts with a single click, and custom domains are handled automatically with just a DNS setting, which is very convenient. However, customization is limited, and the cost of $8/month is not cheap. I am using Obsidian Sync ($4) (I think custom sync is unstable), and I didn't want to burn an extra $8 on top of that.

In this article, I will share the method I used. You can use Obsidian Sync or not, but you will need a publishing computer (a home server is even better). Since the site itself will be published using GitHub Pages, the home server doesn't need to be running 24/7, but it would be a hassle to turn on the home server every time you write a post. It doesn't matter if it's a personal PC, as you just need to execute the script.

This blog is built and deployed automatically by combining Obsidian + Sync, Quartz, and an always-on PC (idle PC).
It is structured so that if you write and sync a post with Obsidian from anywhere, the build and deployment process proceeds automatically on a separate PC.
This allows the user to focus solely on writing.

## Writing and Syncing: Obsidian and Obsidian Sync
All posts are written in Obsidian and automatically saved in Markdown format.
You can write or edit posts on any device supported by the Obsidian client, such as a PC or mobile.

Using Obsidian's official paid service, Obsidian Sync, notes on all devices are synchronized in real-time. At this time, notes are also synchronized to the home server, which is used for uploading posts to GitHub Pages.
This is the core of this system: it uses the Obsidian server, not local files, as the Single Source of Truth (SSOT). If you only use Obsidian on a PC, the PC's Obsidian Vault becomes the SSOT.

It is possible to build this without using Obsidian Sync. Whether you use your own sync with Git, use it only on a personal PC, or just automate the part where you select the folder to publish and upload it to GitHub.

## Automated Build Environment: Idle PC
An always-on PC at home (home server or desktop) handles this role. If you don't have a home server, it is possible to set it up on a personal PC.
The Obsidian app is also installed on this PC, and it logs in with the same Obsidian account to synchronize notes.

I installed Linux on the home server, and here I use `inotify-tools` to detect file changes in the Obsidian vault directory in real-time.
When a file change is detected, the build and deployment process starts automatically.
If automatic deployment is unnecessary, you can skip this part, but you must manually execute the deployment below on your PC.

## Automating Build and Deployment: Quartz and Shell Scripts
First, for deployment, you need to create a separate new project folder, not the Obsidian vault. The Obsidian vault is left untouched, and all deployment work is done in the project folder.

`Quartz` is one of the static website builders, and it is a program optimized for publishing Obsidian. It also draws graphs and can be built locally.

When a file change is detected in the folder to be deployed within the Obsidian vault, the following actions are performed.

*   **Content Synchronization**: Copy the latest content of the Obsidian vault to the project's `content` directory (`rsync`).
*   **Site Build**: Convert markdown files to static website files using the Quartz CLI (`npx quartz build`) and build them in the `public` directory.
*   **Git Push**: If there are changes, automatically commit using Git and push to the remote repository (GitHub).

Since the Obsidian posts are not touched directly, but copied to the deployment folder and then the content within this folder is processed and deployed, the existing posts are safe. Also, instead of deploying the entire Obsidian vault, you can select a deployment folder. This is because only that folder is deployed as the deployment folder.

Here, `processing content within the folder` means adding flesh to the content via automation after copying or generating additional translated copies. In the case of this site, `Gemini` automatically generates translated copies in 3 languages after copying. Since they are generated after copying, unnecessary translations are not visible in the existing Obsidian vault, and since the actual files are "created" and then deployed, they can also be searched externally in that language.

## Final Deployment: GitHub Pages and Custom Domain Connection
When a new commit is pushed to the main branch, a pre-configured GitHub Actions workflow is triggered.
This workflow deploys the static files in the `public` directory to GitHub Pages.

If necessary, the build could be done on GitHub Pages instead of the PC (server), but in this case, it would take time to build, and it is cumbersome to test the website locally. So I chose to build in advance on the PC (server) and upload only the completed pages.

### GitHub Pages Settings
Actual deployment is published via GitHub -> GitHub Pages. Therefore, you also need to configure Pages settings.
You can configure GitHub Pages in the "Pages" section of the GitHub repository settings.
Set "Source" to "Deploy from a branch", select `gh-pages` (or the `docs` folder of the `main` branch) as the "Branch", and then select the `/(root)` folder.
Saving it activates GitHub Pages.

If you have a Custom domain you purchased, configure it together [here](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages).

## Conclusion
Through this system, the user can focus solely on writing. Just by writing and saving posts in Obsidian, complex build and deployment processes are handled automatically.
The core idea of this structure is to use Obsidian Sync as a central hub and utilize an idle PC as an automation agent. If you don't have an idle PC, just run the deployment script once on your own PC, and "`Obsidian Vault` -> `Copy to Content directory` -> `Process contents` -> `Upload(push)` -> `Publish`" happens automatically.

## Addendum
I didn't code this entire process myself, but developed it with the help of `Codex`, `Claude Code`, and `Gemini`.
Personally, I think Gemini is not yet suitable for assigning coding tasks on a project basis locally, so I am using it only for translation purposes (looking forward to the 3.0 model). If you ask Codex or CC to build a site by organizing the above contents along with your current environment (whether you have a home server, etc.), they will do it well. Therefore, I did not include script code, etc. in the text. I am sharing the idea, so I hope you tune it well according to your environment.
