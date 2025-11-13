---
publish: true
lang: en
title: "Running a Blog with Obsidian and Quartz Using an Idling PC"
---

## Overview
There are various ways to publish Obsidian notes on the web, the easiest being Obsidian Publish for $8/month. This method allows you to publish articles with a single click, and even custom domains are handled automatically with just one DNS setting, making it very convenient. However, customization is limited, and $8 a month isn't cheap. I'm already using Obsidian Sync ($4/month) because I find custom sync solutions to be unstable, and I didn't want to spend an additional $8 on top of that.

In this post, I'll share the method I used. You may or may not use Obsidian Sync, but you will need a dedicated computer for publishing (a home server is even better). The site itself will be published using GitHub Pages, so the home server doesn't need to be running 24/7, but you'll have the inconvenience of turning it on every time you want to write. Even a personal PC will work, as you just need to run a script.

This blog's build and deployment are automated using a combination of Obsidian + Sync, Quartz, and an always-on PC (an idling PC).
When I write and sync an article in Obsidian from anywhere, a separate PC automatically handles the build and deployment process.
This allows the user to focus solely on writing.

## Writing and Syncing: Obsidian and Obsidian Sync
All articles are written in Obsidian and automatically saved in Markdown format.
You can write or edit articles on any device supported by the Obsidian client, such as a PC or mobile device.

Using Obsidian's official paid service, Obsidian Sync, all notes are synchronized in real-time across all devices. This also syncs the notes to the home server, which is used for uploading articles to GitHub Pages.
This is the core of the system: using the Obsidian server, not local files, as the Single Source of Truth (SSOT). If you only use Obsidian on a PC, then that PC's Obsidian Vault becomes the SSOT.

It's possible to set this up without Obsidian Sync. Whether you use Git for your own sync solution or only write on your personal PC, the key is to automate the part that uploads the selected folder to GitHub.

## Automated Build Environment: An Idling PC
An always-on PC at home (a home server or desktop) takes on this role. If you don't have a home server, you can also set this up on your personal PC.
This PC also has the Obsidian app installed and is logged into the same Obsidian account to synchronize notes.

I installed Linux on the home server and use `inotify-tools` to detect file changes in the Obsidian vault directory in real-time.
When a file change is detected, it automatically starts the build and deployment process.
If automatic deployment is unnecessary, you can skip this part, but you will have to manually run the deployment steps below on your PC.

## Build and Deployment Automation: Quartz and Shell Scripts
First, for deployment, you need to create a new, separate project folder, not use the Obsidian vault directly. The Obsidian vault remains untouched, and all deployment tasks are performed in the project folder.

`Quartz` is one of many static website builders, and it's optimized for publishing from Obsidian. It can also generate graphs and build locally.

When a file change is detected in the folder designated for deployment within the Obsidian vault, the following actions are performed:

*   **Content Synchronization**: The latest content from the Obsidian vault is copied to the project's `content` directory (`rsync`).
*   **Site Build**: The Quartz CLI (`npx quartz build`) is used to convert the Markdown files into static website files and build them in the `public` directory.
*   **Git Push**: If there are changes, Git is used to automatically commit and push them to the remote repository (GitHub).

Because the process copies the content to a deployment folder and then processes it for deployment, without directly touching the original Obsidian articles, your original notes are safe. Additionally, you can select a specific folder for deployment rather than the entire Obsidian vault, as only that folder's contents are deployed.

The term `processing content within the folder` here means automatically adding to the content or creating additional translated copies after copying. For this site, after copying, `Gemini` automatically generates translated copies in three languages. Since this happens after the copy, the original Obsidian vault doesn't get cluttered with unnecessary translated versions. And because the process "creates" actual files before deployment, the site becomes searchable in those languages externally.

## Final Deployment: GitHub Pages and Custom Domain Connection
When a new commit is pushed to the main branch, a pre-configured GitHub Actions workflow is triggered.
This workflow deploys the static files from the `public` directory to GitHub Pages.

If needed, the build could be done on GitHub Pages instead of the local PC (server), but this would add build time and make it cumbersome to test the website locally. Therefore, I chose to pre-build on my PC (server) and upload only the finished pages.

### GitHub Pages Settings
The actual deployment is published via GitHub -> GitHub Pages. Therefore, you need to configure Pages as well.
You can set up GitHub Pages in the "Pages" section of your GitHub repository settings.
Set the "Source" to "Deploy from a branch," select the "Branch" as `gh-pages` (or a `docs` folder in the `main` branch), and then select the `/(root)` folder.
Saving this will activate GitHub Pages.

If you have a custom domain you've purchased, you can [set it up](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages) as well.

## Conclusion
This system allows the user to focus solely on writing. The complex build and deployment process is handled automatically just by writing and saving in Obsidian.
The core idea of this architecture is using Obsidian Sync as a central hub and an idling PC as an automation agent. If you don't have an idling PC, simply running the deployment script once on your own PC will automatically trigger the entire process: "`Obsidian Vault` -> `Copy to Content directory` -> `Process contents` -> `Upload(push)` -> `Publish`".

## Additionally
I didn't code this entire process by myself; I developed it with the help of `Codex`, `Claude Code`, and `Gemini`.
Personally, I feel that Gemini is not yet suitable for project-level coding tasks locally, so I only use it for translation (I'm looking forward to model 3.0). If you explain your current environment (whether you have a home server, etc.) and the concepts above to Codex or CC and ask them to build the site, they should do a good job. Therefore, I have not included script code in this post. I'm sharing the idea so you can tune it to your own environment.
