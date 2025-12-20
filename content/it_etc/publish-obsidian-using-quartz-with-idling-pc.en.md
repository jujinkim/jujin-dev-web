---
publish: true
lang: en
title: "Running a Blog with Obsidian and Quartz on an Idling PC"
---

## Overview
There are various ways to publish Obsidian to the web, and the easiest is to use Obsidian Publish for \$8 a month. This method allows you to publish articles with one click, and even custom domains are automatically configured with just a DNS setting, which is very convenient. However, customization is limited, and \$8 a month is not cheap. I use Obsidian Sync (\$4) (as custom sync is unstable, I believe), and I didn't want to spend an additional \$8 on top of that.

In this article, I will share the method I used. Obsidian Sync can be used or not, but you will need a dedicated publishing computer (a home server would be even better). The site itself will be published using GitHub Pages, so the home server doesn't need to be running 24/7, but you will have the inconvenience of turning on the home server every time you write an article. Even if it's a personal PC, it doesn't matter as long as you run the script.

This blog is built and deployed automatically by combining Obsidian + Sync, Quartz, and an always-on PC (an idling PC).
Wherever you write and sync an article with Obsidian, the build and deployment process proceeds automatically on a separate PC.
This allows the user to focus solely on writing.

## Writing and Syncing Articles: Obsidian and Obsidian Sync
All articles are written in Obsidian and automatically saved in Markdown format.
You can write or edit articles on any device that supports the Obsidian client, such as a PC or mobile device.

Using Obsidian's official paid service, Obsidian Sync, notes are synchronized in real-time across all devices. At this time, notes are also synchronized to the home server used for uploading articles to GitHub Pages.
This is the core of this system: it uses the Obsidian server as the Single Source of Truth, rather than local files. If you only use Obsidian on a PC, your PC's Obsidian Vault becomes the SSOT.

It is possible to set up the system even without Obsidian Sync. Whether you use Git for self-syncing or only use it on your personal PC, you only need to automate the process of selecting a folder to publish and uploading it to GitHub.

## Automated Build Environment: An Idling PC
An always-on PC at home (a home server or desktop) takes on this role. If you don't have a home server, you can set it up on your personal PC.
Obsidian app is also installed on this PC, and notes are synced by logging in with the same Obsidian account.

I installed Linux on the home server, and here I use `inotify-tools` to detect file changes in the Obsidian vault directory in real-time.
When a file change is detected, the build and deployment process automatically starts.
If automatic deployment is not necessary, you can skip this part, but you will have to manually run the deployment process on your PC.

## Build and Deployment Automation: Quartz and Shell Scripts
First, for deployment, you need to create a separate new project folder, not within the Obsidian vault. The Obsidian vault remains untouched, and all deployment tasks are carried out in the project folder.

`Quartz` is one of the static website builders, optimized for publishing Obsidian. It also draws graphs and can be built locally.

Upon detecting file changes in the deployment folder within the Obsidian vault, the following actions are performed:

*   **Content Synchronization**: The latest content from the Obsidian vault is copied to the project's `content` directory (`rsync`).
*   **Site Build**: The Quartz CLI (`npx quartz build`) is used to convert Markdown files into static website files and build them into the `public` directory.
*   **Git Push**: If there are changes, Git is used to automatically commit and push to the remote repository (GitHub).

Since Obsidian articles are not directly touched, but rather copied to a deployment folder and then processed for deployment, the original articles are safe. Also, instead of deploying the entire Obsidian vault, you can select specific folders for deployment. Only the selected folders are deployed.

The phrase "processing contents within the folder" means automatically adding enhancements to the content or generating translated copies after copying. In the case of this site, Gemini automatically generates translated copies in three languages after copying. Since these are generated after copying, unnecessary translations do not appear in the original Obsidian vault, and because the files are actually "generated" and then deployed, they can be searched externally in those languages.

## Final Deployment: GitHub Pages and Custom Domain Connection
When new commits are pushed to the main branch, a pre-configured GitHub Actions workflow is triggered.
This workflow deploys the static files in the `public` directory to GitHub Pages.

If necessary, the build could also be done on GitHub Pages instead of the PC (server), but in this case, it would take build time and be cumbersome to test the website locally. So, I chose to build on the PC (server) beforehand and upload only the completed pages.

### GitHub Pages Setup
The actual deployment is published through GitHub -> GitHub Pages. Therefore, Pages settings also need to be configured.
You can set up GitHub Pages in the "Pages" section of your GitHub repository settings.
Set "Source" to "Deploy from a branch", and select `gh-pages` (or the `docs` folder of the `main` branch) as the "Branch", then select the `/(root)` folder.
Saving these settings will activate GitHub Pages.

If you have purchased a Custom domain, you can also [set it up](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages) together.

## Conclusion
This system allows users to focus solely on writing articles. Simply writing and saving in Obsidian automatically handles the complex build and deployment process.
Using Obsidian Sync as a central hub and an idling PC as an automation agent is the core idea of this structure. If you don't have an idling PC, just running the deployment script once on your own PC will automatically perform the "Obsidian Vault -> Copy to Content directory -> Process contents -> Upload (push) -> Publish" sequence.

## Additional Notes
I did not code all of this myself; I developed it with the help of `Codex`, `Claude Code`, and `Gemini`.
Personally, I still think Gemini is not suitable for project-level coding tasks locally, so I only use it for translation (looking forward to the 3.0 model). If you summarize the content above along with your current environment (e.g., whether you have a home server) and ask Codex or CC to build a site for you, they will do a good job. Therefore, this article does not include script code. I am sharing the idea, so I hope you can tune it to fit your environment.
