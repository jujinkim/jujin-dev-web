---
publish: true
lang: en
title: "Running a Blog with Obsidian and Quartz Using an Idling PC"
---

## Overview
This blog is automated for building and deployment by combining Obsidian + Sync, Quartz, and an always-on PC (an idling PC).
It's structured so that when you write and sync a post in Obsidian from anywhere, the build and deployment process automatically runs on a separate PC.
This allows the user to focus solely on writing.

## Content Creation and Synchronization: Obsidian and Obsidian Sync
All posts are written in Markdown format within Obsidian.
You can write or edit posts on any device, including PC and mobile.

Using Obsidian's official paid service, Obsidian Sync, notes are synchronized in real-time across all devices.
This is the core of the system. It uses the Obsidian server, not local files, as the Single Source of Truth.

## Automated Build Environment: The Idling PC
An always-on PC at home (a home server or desktop) handles this role.
This PC has the Obsidian app installed and is logged into the same Obsidian account to sync notes.

It uses `inotify-tools` to detect file changes in the Obsidian vault directory in real-time.
When a file change is detected, it automatically starts the build and deployment process.

## Build and Deployment Automation: Quartz and Shell Scripts
When a file change is detected, the following actions are performed.

*   **Content Synchronization**: The latest content from the Obsidian vault is copied (`rsync`) to the project's `content` directory.
*   **Site Build**: The Quartz CLI (`npx quartz build`) is used to convert Markdown files into a static website and build them in the `public` directory.
*   **Git Push**: If there are changes, Git is used to automatically commit and push them to the remote repository (GitHub).

## Final Deployment: GitHub Pages and Custom Domain Connection
When a new commit is pushed to the main branch, a pre-configured GitHub Actions workflow is triggered.
This workflow deploys the static files from the `public` directory to GitHub Pages.

### GitHub Pages Setup
Go to the "Pages" section in your GitHub repository settings.
Set the "Source" to "Deploy from a branch," select the "Branch" as `gh-pages` (or the `docs` folder in the `main` branch), and then select the `/(root)` folder.
After saving, GitHub Pages will be activated.

### Custom Domain Connection
In the GitHub Pages settings, enter your desired domain, such as `yourdomain.com`, in the "Custom domain" section.
At your domain registrar (DNS provider), set an `A` record for `yourdomain.com` to the GitHub Pages server IP addresses, and set a `CNAME` record for `www.yourdomain.com` to `yourusername.github.io`.
Once the DNS settings propagate, you can access your blog via `yourdomain.com`.

## Conclusion
Through this system, the user can focus solely on writing. Just by writing and saving in Obsidian, the complex build and deployment process is handled automatically.
The core idea of this architecture is to use Obsidian Sync as a central hub and leverage an idling PC as an automation agent.
By connecting GitHub Pages with a custom domain, you can easily run your own blog.
