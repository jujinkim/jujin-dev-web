---
publish: "false"
title: "Publish Obsidian using Quartz with Idling PC"
lang: en
---

1.  **Overview**
    This blog is built and deployed automatically using a combination of Obsidian, Obsidian Sync, Quartz, and an always-on PC (an idling PC).
    It's structured so that when you write and sync a post in Obsidian from anywhere, the build and deployment process runs automatically on a separate PC.
    This allows the user to focus solely on writing.

2.  **Writing and Syncing: Obsidian and Obsidian Sync**
    All posts are written in Markdown format in Obsidian.
    You can write or edit posts on any device, such as a PC or mobile.

    Using Obsidian's official paid service, Obsidian Sync, notes are synchronized in real-time across all devices.
    This is the core of the system. It uses the Obsidian server, not local files, as the Single Source of Truth.

3.  **Automated Build Environment: The Idling PC**
    An always-on PC at home (a home server or desktop) handles this role.
    This PC has the Obsidian app installed and is logged into the same Obsidian account to sync notes.

    The `scripts/obsidian_watch.sh` shell script uses `inotify-tools` to detect file changes in the Obsidian vault directory in real-time.
    When a file change is detected, this script automatically starts the build and deployment process.

4.  **Build and Deployment Automation: Quartz and Shell Scripts**
    The `obsidian_watch.sh` script runs the `obsidian_manual_sync.sh` script, which performs the following tasks sequentially:

    *   **Content Sync**: Copies (`rsync`) the latest content from the Obsidian vault to the project's `content` directory.
    *   **Site Build**: Uses the Quartz CLI (`npx quartz build`) to convert Markdown files into static website files and builds them in the `public` directory.
    *   **Git Push**: If there are changes, it automatically commits and pushes them to the remote repository (GitHub) using Git.

5.  **Final Deployment: GitHub Pages and Custom Domain Connection**
    When a new commit is pushed to the main branch, a pre-configured GitHub Actions workflow is triggered.
    This workflow deploys the static files from the `public` directory to GitHub Pages.

    **GitHub Pages Setup**:
    In your GitHub repository settings, go to the "Pages" section.
    Set "Source" to "Deploy from a branch", select the `gh-pages` branch (or the `docs` folder in the `main` branch) as the "Branch", and then select the `/(root)` folder.
    After saving, GitHub Pages will be activated.

    **Custom Domain Connection**:
    In the GitHub Pages settings, enter your desired domain, such as `yourdomain.com`, in the "Custom domain" section.
    In your domain registrar (DNS provider), set an `A` record for `yourdomain.com` to the GitHub Pages server IP addresses, and set a `CNAME` record for `www.yourdomain.com` to `yourusername.github.io`.
    Once the DNS settings propagate, you can access your blog via `yourdomain.com`.

6.  **Conclusion**
    Through this system, the user can focus solely on writing. The complex build and deployment process is handled automatically just by writing and saving in Obsidian.
    The core idea of this structure is to use Obsidian Sync as a central hub and an idling PC as an automation agent.
    By connecting GitHub Pages with a custom domain, you can easily run your own blog.
