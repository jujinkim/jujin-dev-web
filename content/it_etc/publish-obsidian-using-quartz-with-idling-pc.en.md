---
publish: true
lang: en
title: "Operating a Blog with Obsidian and Quartz Using an Idling PC"
---

## Overview
There are various ways to publish Obsidian on the web, with the easiest being the use of Obsidian Publish for $8/month. This method allows for one-click publishing and is very convenient as custom domains are automatically set up with just one DNS configuration. However, customization is limited, and $8/month is not a cheap price. I am currently using Obsidian Sync ($4/month) (as I find custom syncs to be unstable), and I didn't want to spend an additional $8 on top of that.

In this post, I will share the method I used. You may or may not use Obsidian Sync, but you will need a dedicated computer for publishing (a home server is even better). The site itself will be published using GitHub Pages, so the home server doesn't need to be running 24/7, but it can be a hassle to turn it on every time you write a post. Even a personal PC will do, as you just need to run a script.

This blog is built and its deployment is automated by combining Obsidian + Sync, Quartz, and an always-on PC (an idling PC).
The structure is such that when you write and sync a post in Obsidian from anywhere, the build and deployment process proceeds automatically on a separate PC.
This allows the user to focus solely on writing.

## Content Creation and Synchronization: Obsidian and Obsidian Sync
All posts are written in Obsidian and automatically saved in Markdown format.
You can write or edit posts on any device supported by the Obsidian client, such as a PC or mobile device.

Using Obsidian's official paid service, Obsidian Sync, notes are synchronized in real-time across all devices. At this point, the notes are also synchronized to the home server, which is used for uploading posts to GitHub Pages.
This is the core of the system: using the Obsidian server, not local files, as the Single Source of Truth (SSOT). If you only use Obsidian on a PC, then your PC's Obsidian Vault becomes the SSOT.

It is possible to build this system without using Obsidian Sync. You can automate the part where you select the folder to be published and upload it to GitHub, whether you use your own sync method like Git or just use it on a personal PC.

## Automated Build Environment: An Idling PC
An always-on PC at home (a home server or desktop) takes on this role. If you don't have a home server, it can also be set up on a personal PC.
The Obsidian app is also installed on this PC, and it is logged into the same Obsidian account to synchronize notes.

I installed Linux on the home server, where I use `inotify-tools` to detect file changes in the Obsidian vault directory in real-time.
When a file change is detected, it automatically starts the build and deployment process.
If automatic deployment is unnecessary, you can skip this part, but you will have to manually run the deployment process below on your PC.

## Build and Deployment Automation: Quartz and Shell Scripts
First, for deployment, you need to create a new, separate project folder, not the Obsidian vault. All deployment tasks are performed in the project folder without touching the Obsidian vault.

`Quartz` is one of the static website builders, optimized for publishing Obsidian. It also generates graphs and allows for local builds.

When a file change is detected in the folder to be deployed within the Obsidian vault, the following actions are performed:

*   **Content Synchronization**: The latest content from the Obsidian vault is copied to the project's `content` directory (`rsync`).
*   **Site Build**: The Quartz CLI (`npx quartz build`) is used to convert Markdown files into static website files and build them in the `public` directory.
*   **Git Push**: If there are changes, Git is used to automatically commit and push them to the remote repository (GitHub).

Since the Obsidian posts are not directly touched, but are copied to a deployment folder and then processed, the original posts are safe. Also, you can select a specific folder for deployment, rather than deploying the entire Obsidian vault, as only that folder is deployed to the deployment folder.

Here, the term `Process contents` means that after copying, the content is automatically augmented or translation copies are additionally generated. In the case of this site, after copying, `Gemini` automatically generates translation copies in three languages. Since they are generated after copying, unnecessary translations are not visible in the original Obsidian vault, and because the actual files are "generated" before deployment, they can be found by external search engines in that language.

## Final Deployment: GitHub Pages and Custom Domain Connection
When a new commit is pushed to the main branch, a pre-configured GitHub Actions workflow is triggered.
This workflow deploys the static files from the `public` directory to GitHub Pages.

If necessary, the build could be done on GitHub Pages instead of the PC (server), but this would take build time and make it cumbersome to test the website locally. Therefore, I chose to pre-build on the PC (server) and upload only the finished pages.

### GitHub Pages Setup
The actual deployment is published via GitHub -> GitHub Pages. Therefore, you also need to configure Pages.
You can set up GitHub Pages in the "Pages" section of your GitHub repository settings.
Set "Source" to "Deploy from a branch", select the "Branch" as `gh-pages` (or the `docs` folder in the `main` branch), and then select the `/(root)` folder.
Save the settings to activate GitHub Pages.

If you have a custom domain you purchased, you can [set it up](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages) as well.

## Conclusion
This system allows the user to focus solely on writing. The complex build and deployment process is handled automatically just by writing and saving a post in Obsidian.
The key idea of this architecture is to use Obsidian Sync as a central hub and an idling PC as an automation agent. If you don't have an idling PC, you can just run the deployment script once on your own PC, and the process of "`Obsidian Vault` -> `Copy to Content directory` -> `Process contents` -> `Upload(push)` -> `Publish`" will be done automatically.

## Additionally
I did not code this entire process by myself; I developed it with the help of `Codex`, `Claude Code`, and `Gemini`.
Personally, I feel that Gemini is not yet suitable for project-level coding tasks locally, so I am only using it for translation purposes (and looking forward to the 3.0 model). If you explain your current environment (e.g., whether you have a home server) to Codex or CC and ask them to build a site based on the information above, they will do a good job. Therefore, I have not included script codes in the text. I am sharing the idea, so I hope you will tune it well to your own environment.
