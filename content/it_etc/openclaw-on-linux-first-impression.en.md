---
publish: true
lang: en
title: "First Impressions of Openclaw After Linux Installation"
---
# Introduction
With the emergence of Transformer & Attention LLM AI following ML and Deep Learning, the world began to change rapidly. While the pace of change wasn't slow before, LLM AI feels like something that could achieve a new industrial revolution or a technological singularity.

Among these, tools have appeared that utilize LLM AI to go beyond simple chatbots and easily manipulate the PC itself. One such program distributed as open source is called `Openclaw`.

The project was already attracting attention, but its performance has improved rapidly alongside the explosive development of LLMs recently. This tool has become so famous that even non-experts interested in AI are amazed after trying it, to the point of becoming viral.

---
# What is Openclaw
The name has changed twice (`Clawdbot` -> `Moltbot`), but history isn't the point of this article. Simply put:
> A tool that allows LLM models like GPT to directly control the entire computer and makes it easy to configure.

Actually, doing this wasn't impossible before Openclaw. Even without a chatbot client (like `ChatGPT`), one could use APIs or local LLMs (like `ollama`, `gpt-oss`, etc.) and just enable them to manipulate the PC. Starting with `Claude Code`, tools like `Gemini CLI` and `Codex CLI` appeared as chatbots running directly in the terminal. While their purpose was to be coding agents, they were effectively LLM clients that could execute CLI commands directly, allowing for limited PC control.

However, we wanted to be able to assign tasks remotely, even when not in front of the computer. To do this, one had to manually manage complex settings like SSH, MCP, and permissions. Services like `Omnara` emerged to resolve some of this complexity, but they were either paid or only solved part of the problem without being definitive. In the midst of this, the `Clawdbot` project, which a developer in Austria started developing as a **hobby**, grew through word-of-mouth to become `Openclaw`.

After installing `Openclaw` on a PC and going through a very simple setup, the LLM takes control of your PC, and you can easily give commands through IM apps like Telegram. It's not just about chatting; it's about making your computer do things via a messaging app.

For example, you can assign coding tasks, research data, write documents, manage emails, and even browse the web or shop through Telegram. You can perform tasks by **interacting with your PC in real-time through a messenger**. Because of this feature, many people use the expression "Jarvis from Iron Man for my PC." In other words, Openclaw acts as a gateway connecting IM apps and your PC via an LLM. It is an integrated AI Agent program that makes it easy to manipulate various skills, plugins, and settings, and separately supports session memory functions.

---
# Selecting a PC to Run It On
So many people choose the Mac Mini as a host for Openclaw that it has caused a shortage. However, most people seem to think they "just have to use a Mac Mini." You should use a Mac Mini in the following cases; otherwise, there is no need. Openclaw is a "cross-platform" tool to begin with.

- You want to develop native iOS & macOS apps via Openclaw.
- You want to control all functions of the computer using a monitor and mouse (navigating web screens, writing complex documents, shopping, etc.).
- You need a separate low-power macOS computer to keep on 24/7.
- You want a Mac and need an excuse.

If you already have a Mac, you can just install it on your current machine. Try creating a virtual machine or a virtual container on your Mac to experience it.

As a side note, some suggested buying a Mac Mini "to save tokens by running a local LLM," but the current shortage is for the base M4 Mac Mini. Even though the Mac Mini shares RAM with the GPU, it is difficult to run the LLMs used in Openclaw with only 16GB of VRAM. It might make sense for small fine-tuned LLMs or specific tasks like media generation. Or, if you buy a Mac Mini with 64GB of RAM for a local LLM, then I'll acknowledge that.

If the above cases don't apply, there's no need to buy a Mac Mini. I also plan to have it develop apps using cross-platform frameworks (KMP, Flutter, game engines) rather than native ones for Apple, and I don't yet feel the need to entrust my entire PC to an LLM, so I didn't buy a Mac Mini. Since the LLM connects via an account, the PC doesn't need to have high performance. So, I resurrected a Surface Pro 4 with a broken monitor that was gathering dust in storage, installed a Linux server on it, and installed Openclaw there. An N100 low-power barebone PC also seems like a good choice, and if you're doing complex tasks (like project builds), a barebone PC with a high-performance CPU is fine (though with rising RAM prices, a Mac Mini is often cheaper than a high-performance PC these days).

Since Openclaw takes all permissions to manipulate the PC, it is recommended to install it on a separate PC rather than your primary one. No matter how smart LLMs have become, they are not perfect, and since they operate based on probabilistic reasoning, they can perform unwanted actions at any time. This is also stated as a strong warning to users when installing Openclaw.

---
# Simple Setup
Just install it, agree to the terms, connect your Codex account, and link a Telegram bot. You can easily create and manage a Telegram bot using the `BotFather` bot.
During the initial setup (Setup wizard), I was able to start without much difficulty because various settings could be adjusted visually and easily (even though it's a CLI!).

Once the setup is finished and connected to Telegram (or another messaging app), if you chat with the Telegram bot you created and linked, Openclaw receives it, performs the task on the PC, and informs you of the results via Telegram.
It really feels like using ChatGPT through Telegram, but now it's using my PC.

---
# Review of Usage
I liked the feeling of talking to my PC as if talking to a friend through the GUI of the IM messaging app I usually use.
Beyond that, it supports various complex settings (Skills, its own Cronjobs, and hundreds of other settings) and plugins, and it was great to be able to configure and manage these relatively easily in the dashboard (WebUI). As expected, GUIs are bound to be more popular than CLIs.

Furthermore, when using general AI, a separate session is created for each chat, and performance gradually degrades as the session gets longer. However, Openclaw can continue multiple tasks in one session thanks to its own memory management solution. It seems to constantly switch context and save only necessary information internally, making it truly feel like assigning work to a person.

---
# Conclusion

For now, the current buzz is definitely a bit of hype.
However, I want to give it credit from the perspective of "convenience."
A convenient tool created by technological advancement + laziness.

I ended this abruptly because I suddenly felt lazy to write (sigh, this is all a side effect of AI), but I will fill in more content later when I have more time.
