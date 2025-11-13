---
publish: true
lang: en
title: "Running a Blog with Obsidian and Quartz Using an Idle PC"
---

## Overview
There are various ways to publish Obsidian notes on the web, the easiest being to use Obsidian Publish for $8 a month. This method allows you to publish articles with a single click, and custom domains are also very convenient as everything is automated with just one DNS setting. However, customization is limited, and $8 a month is not cheap. I am currently using Obsidian Sync ($4), and I didn't want to spend an additional $8 on top of that.

In this article, I'll share the method I used. You may or may not use Obsidian Sync, but you will need a computer for publishing (a home server is even better). The site itself will be published using GitHub Pages, so the home server doesn't need to be running 24/7, but you will have the inconvenience of turning on the home server every time you write a post. It doesn't matter if it's a personal PC, as you just need to run a script.

This blog is built and deployed automatically by combining Obsidian + Sync, Quartz, and an always-on PC (an idle PC).
It's a structure where if you write and sync an article in Obsidian from anywhere, the build and deployment process proceeds automatically on a separate PC.
This allows the user to focus solely on writing.

## Content Creation and Syncing: Obsidian and Obsidian Sync
All articles are written in Obsidian and automatically saved in Markdown format.
You can write or edit articles on any device supported by the Obsidian client, such as a PC or mobile device.

Using Obsidian's official paid service, Obsidian Sync, all notes on all devices are synchronized in real-time. At this time, the notes are also synchronized to the home server, which is used to upload articles to GitHub Pages.
This is the core of this system: using the Obsidian server, not local files, as the Single Source of Truth (SSOT). If you only use Obsidian on a PC, your PC's Obsidian Vault becomes the SSOT.

It is possible to build this system without using Obsidian Sync. This is because you only need to automate the part where you select the folder to be published and upload it to GitHub, whether you do your own sync with Git or just use it on your personal PC.

## Automated Build Environment: An Idle PC
An always-on PC at home (a home server or desktop) takes on this role. If you don't have a home server, you can also set it up on your personal PC.
This PC also has the Obsidian app installed and syncs notes by logging into the same Obsidian account.

I installed Linux on the home server, and here I use `inotify-tools` to detect file changes in the Obsidian vault directory in real-time.
When a file change is detected, it automatically starts the build and deployment process.
If automatic deployment is unnecessary, you can skip this part, but you will have to run the deployment below manually on your PC.

## Build and Deployment Automation: Quartz and Shell Scripts
First, for deployment, you need to create a new, separate project folder, not the Obsidian vault. All deployment work is done in the project folder without touching the Obsidian vault.

`Quartz` is one of the static website builders, and it is a program optimized for publishing Obsidian. It also draws graphs and allows for local builds.

When a file change is detected in the folder to be deployed within the Obsidian vault, the following actions are performed.

*   **Content Synchronization**: Copies the latest content from the Obsidian vault to the project's `content` directory (`rsync`).
*   **Site Build**: Uses the Quartz CLI (`npx quartz build`) to convert markdown files into static website files and builds them in the `public` directory.
*   **Git Push**: If there are changes, it automatically commits and pushes them to the remote repository (GitHub) using Git.

Your original articles are safe because you copy them to a deployment folder and then process the content within that folder for deployment, without directly touching the Obsidian articles. Also, you can select a folder for deployment rather than deploying the entire Obsidian vault, as only that folder is deployed to the deployment folder.

Here, the term `Process contents` means that after copying, you automatically add more to the content or create additional translated copies. In the case of this site, after copying, `Gemini` automatically generates translated copies in three languages. Since the generation happens after copying, unnecessary translated versions are not visible in the original Obsidian vault, and because the actual files are "created" before deployment, they can be searched for externally in that language.

## Final Deployment: GitHub Pages and Custom Domain Connection
When a new commit is pushed to the main branch, a pre-configured GitHub Actions workflow is triggered.
This workflow deploys the static files from the `public` directory to GitHub Pages.

If necessary, the build could be done on GitHub Pages instead of the PC (server), but in that case, it would take build time and be cumbersome to test the website locally. So I chose to pre-build on the PC (server) and upload only the finished pages.

### GitHub Pages Setup
The actual deployment is published via GitHub -> GitHub Pages. Therefore, you also need to configure Pages.
You can set up GitHub Pages in the "Pages" section of your GitHub repository settings.
Set "Source" to "Deploy from a branch", select the "Branch" as `gh-pages` (or the `docs` folder of the `main` branch), and then select the `/(root)` folder.
Save, and GitHub Pages will be activated.

If you have a custom domain you purchased, [set it up](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages) as well.

## Conclusion
This system allows the user to focus solely on writing. The complex build and deployment process is handled automatically just by writing and saving in Obsidian.
The key idea of this structure is to use Obsidian Sync as a central hub and an idle PC as an automation agent. If you don't have an idle PC, running the deployment script once on your own PC will automatically perform the "`Obsidian Vault` -> `Copy to Content directory` -> `Process contents` -> `Upload(push)` -> `Publish`" process.

## Additionally
I did not code this entire process myself; I developed it with the help of `Codex`, `Claude Code`, and `Gemini`.
Personally, I feel that Gemini is not yet suitable for project-level coding tasks locally, so I am only using it for translation purposes (I am looking forward to the 3.0 model). If you explain your current environment (whether you have a home server, etc.) to Codex or CC and ask them to build a site based on the information above, they will do a good job. Therefore, this article does not include script code, etc. I am sharing the idea, so I hope you will tune it well to your own environment.
