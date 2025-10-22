---
publish: "false"
title: "Publish Obsidian using Quartz with Idling PC"
lang: en
---

# Running a Blog with Obsidian and Quartz Using an Idling PC

1.  **Overview**
    This blog is built and deployed automatically using a combination of Obsidian, Obsidian Sync, Quartz, and an always-on PC (an idling PC). It's structured so that when you write and sync a post in Obsidian from anywhere, the build and deployment process runs automatically on a separate PC.

2.  **Writing and Syncing: Obsidian and Obsidian Sync**
    All posts are written in Markdown format in Obsidian. You can write or edit posts on any device, such as a PC or mobile. Using Obsidian's official paid service, Obsidian Sync, notes are synchronized in real-time across all devices. This is the core of the system, using the Obsidian server as the Single Source of Truth, rather than local files.

3.  **Automated Build Environment: Idling PC**
    An always-on PC at home (a home server or desktop) handles this role. This PC has the Obsidian app installed and is logged into the same Obsidian account to sync notes. The `scripts/obsidian_watch.sh` shell script uses `inotify-tools` to detect file changes in the Obsidian vault directory in real-time.

4.  **Build and Deployment Automation: Quartz and Shell Scripts**
    When a file change is detected, the `obsidian_watch.sh` script executes the `obsidian_manual_sync.sh` script. This script performs the following tasks sequentially:
    - Copies the latest content from the Obsidian vault to the `content` directory (`rsync`).
    - Builds the static website files into the `public` directory using the Quartz CLI (`npx quartz build`).
    - If there are changes, it automatically commits and pushes them to the remote repository (GitHub) using Git.

5.  **Final Deployment: GitHub Actions**
    When a new commit is pushed to the main branch, a pre-configured GitHub Actions workflow is triggered. This workflow deploys the static files from the `public` directory to GitHub Pages, making the new content finally available at the `dev.jujin.kim` domain.

6.  **Conclusion**
    This system allows the user to focus solely on writing. Just by writing and saving in Obsidian, the complex build and deployment process is handled automatically. The key idea of this architecture is to use Obsidian Sync as a central hub and an idling PC as an automation agent.
