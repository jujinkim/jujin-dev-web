---
publish: true
lang: en
title: "First Impressions of Openclaw After Installing on Linux"
---
# Introduction
Following ML and deep learning, the emergence of Transformer & Attention LLM AI has caused the world to change rapidly. While change wasn't slow before, LLM AI feels like something that could potentially lead to a new industrial revolution or achieve a technological singularity.

Among these, tools have appeared that utilize this LLM AI to go beyond simple chatbots and easily control a PC itself, one of which is an open-source program named `Openclaw`.

It was already a project of interest, but with the recent rapid development of LLMs, its performance has improved quickly, making the tool very famous. It has now even reached a level of viral marketing where non-experts interested in AI are amazed after trying it just once.

---
# What is Openclaw
The name has changed twice (`Clawdbot` -> `Moltbot`), but the history isn't important for this post; in short, it's as follows:
> A tool that allows LLM models like GPT to directly control an entire computer and makes it easy to set up.

Actually, doing this wasn't impossible before Openclaw. Even without chatbot clients (like `ChatGPT`), you could use APIs or run local LLMs (like `ollama`, `gpt-oss`), and just let them control the PC. Tools like `Gemini CLI` and `Codex CLI`, which emerged following `Claude Code`, are chatbots that run directly in the terminal; while their purpose was as coding agents, they were essentially LLM clients that could execute CLI commands directly, allowing for limited PC control.

However, we wanted to be able to assign tasks remotely, not just when sitting in front of the computer. To do this, one had to manually manage complex settings like SSH, MCP, and permissions. Services appeared to alleviate some of this complexity (like `Omnara`), but they were either paid or only solved minor complexities without being definitive. In the midst of this, the `Clawdbot` project, which an Austrian developer started as a **hobby**, grew and gained word-of-mouth popularity to become `Openclaw`.

After installing `Openclaw` on a PC and going through a very simple setup, the LLM takes control of the PC, and you can very easily issue commands via IM apps like Telegram. It's not just for conversation; you use messaging apps to tell your computer to do things it can normally do.

For example, you can have it code, conduct research, write documents, manage emails, or even browse the web and shop via Telegram. You can assign tasks simply by **having a real-time conversation with your PC through a messenger**. Because of this feature, many people often use the expression "Jarvis for my PC." In other words, Openclaw is a program that acts as a gateway connecting IM apps and your PC via an LLM.

---
# Selecting a PC to run it
Many people choose a Mac Mini as an Openclaw host, to the point where there's a shortage of them because of Openclaw. However, most people seem to only think they "must use a Mac Mini." You should use a Mac Mini in the cases below; otherwise, there's no need for one. To begin with, Openclaw is a "cross-platform" tool.

- I want to develop native iOS & macOS apps via Openclaw.
- I want to control all functions of the computer, using the monitor and mouse, rather than just text and coding tasks (browsing the web, writing complex documents, shopping, etc.).
- I need a separate, low-power macOS computer to leave on 24/7.

If you already have a Mac, you can just install it on the one you're using. Try it out by creating a virtual machine or a virtual container on your Mac.

One interesting point was the opinion that people buy Mac Minis to "save tokens by running local LLMs," but the current shortage is for the base M4 Mac Mini model. No matter how much the Mac Mini shares RAM with the GPU, it's difficult to run the LLMs used for Openclaw with only 16GB of VRAM. It might make sense for fine-tuned small LLMs or specific tasks like media generation. Or, if you buy a Mac Mini with 64GB of RAM for local LLMs, I'd grant you that.

If you're not in the above situations, there's no need to buy a Mac Mini. I also plan to develop Apple-side apps using cross-platform frameworks (KMP, Flutter, game engines) rather than native ones, and I don't feel the need to entrust my entire PC to an LLM yet, so I didn't buy a Mac Mini. Since the LLM connects via an account, the PC performance doesn't need to be high. So, I resurrected a Surface Pro 4 with a broken monitor that was stuck in storage, set up a Linux server on it, and installed Openclaw there. An N100 low-power barebones PC also looks good, and if you're doing complex work (like project builds), a barebones PC with a high-performance CPU is fine (though Mac Minis are currently cheaper than high-performance PCs due to the hike in RAM prices).

Since Openclaw essentially takes all permissions to control the PC, I recommend installing it on a separate PC rather than your daily driver if possible. No matter how smart LLMs have become, they aren't perfect; since they operate on probabilistic inference, they can perform actions the user doesn't want at any time. This is also communicated to users via strong warnings when installing Openclaw.

---
# Simple Setup
You just install it, agree to the terms, connect your Codex account, and link a Telegram bot. You can easily create and manage a Telegram bot using the `BotFather` bot. During the initial setup (Setup wizard), you can easily configure a wide variety of settings visually (even though it's a CLI!), so I could start without any particular difficulty.

Once setup is complete and linked to Telegram, you chat with the Telegram bot you created and linked; Openclaw receives the message, works on the PC, and tells you the result via Telegram. It really feels like using ChatGPT through Telegram, but it's using my PC.

---
# Work Review
I liked the feeling of communicating with my PC as if talking to a friend using the GUI of an IM messaging app I normally use. It also supports various complex settings (Skills, internal Cronjobs, and hundreds of others) and plugins, and it was great to be able to configure and manage these relatively easily from a dashboard (WebUI). Indeed, GUIs are bound to be more popular than CLIs.

---
# Conclusion

First of all, the current buzz is definitely hype.
However, I'd like to give it credit from the perspective of being "convenient."
A handy tool created by technological advancement + laziness.

I suddenly felt too lazy to write more (sigh, this is all a side effect of AI), so I've finished it abruptly for now, but I'll fill in more content when I have some free time later.
