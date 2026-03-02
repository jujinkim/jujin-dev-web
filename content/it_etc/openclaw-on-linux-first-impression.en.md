---
publish: true
lang: en
title: "First Impressions of Openclaw After Installing on Linux"
---
# Introduction
The world began to change rapidly with the emergence of Transformer & Attention LLM AI, following ML and deep learning. While change wasn't slow before, LLM AI feels like something that could achieve a new industrial revolution or a technological singularity.

Among these, tools have emerged that go beyond simple chatbots to easily manipulate the PC itself using LLM AI, one of which is an open-source program called `Openclaw`.

While it was already a project of interest, its performance has improved rapidly alongside the recent explosive development of LLMs, making the tool very famous. It has now reached a point of viral marketing where even non-experts interested in AI are amazed after trying it once.

---
# What is Openclaw
The name has changed twice (`Clawdbot` -> `Moltbot`), but the history isn't important for this post. Simply put:
> A tool that allows LLM models like GPT to directly control an entire computer and makes it easy to configure.

Technically, this wasn't impossible before Openclaw. You could use APIs or local LLMs (`ollama`, `gpt-oss`, etc.) even without chatbot clients (like `ChatGPT`), and you just had to let them control the PC. `Claude Code`, followed by `Gemini CLI` and `Codex CLI`, appeared as chatbots running directly in the terminal. While their purpose was as coding agents, they were essentially LLM clients that could execute CLI commands directly, allowing for limited PC control.

However, we wanted to delegate tasks remotely, even when not in front of the computer. To achieve this, one had to manually manage complex settings like SSH, MCP, and permissions. Services like `Omnara` emerged to alleviate some of this complexity, but they were either paid or only solved part of the problem without being definitive. In the midst of this, the `Clawdbot` project, which an Austrian developer started as a **hobby**, grew through word of mouth to become `Openclaw`.

After installing `Openclaw` on a PC and going through a very simple setup, the LLM takes control of the PC, and you can easily issue commands through IM apps like Telegram. It's not just about chatting; you are directing tasks your computer can do via a messaging app.

For example, you can command coding, research, document writing, email management, and even web surfing or shopping through Telegram. You are essentially **working by having real-time conversations with your PC via messenger**. Because of this feature, many people describe it as "Jarvis from Iron Man for my PC." In other words, Openclaw acts as a gateway connecting IM apps and your PC via LLM. Beyond that, it is an integrated AI Agent program that provides easy manipulation of various skills, plugins, and settings, while also supporting separate session memory functions.

---
# Selecting the PC to Run On
So many people are choosing the Mac Mini as the host for Openclaw that it has caused a shortage. However, most people seem to think they "must use a Mac Mini." You should use a Mac Mini in the following cases; otherwise, there is no need for one. Openclaw is, by design, a "cross-platform" tool.

- You want to develop iOS & macOS Native apps via Openclaw.
- You want to control all computer functions using the monitor and mouse (navigating web screens, writing complex documents, shopping, etc.).
- You need a separate, low-power macOS computer to keep on 24/7.
- You want a Mac and need an excuse.

If you already have a Mac, you can just install it on your current machine. For a trial, try creating a virtual machine or a virtual container on your Mac.

As a side note, some suggested buying a Mac Mini to "save tokens by running local LLMs," but the current shortage is for the base Mac Mini M4. Even though the Mac Mini shares RAM with the GPU, it is difficult to run the LLMs used for Openclaw with only 16GB of VRAM. It might make sense for small fine-tuned LLMs or specific tasks like media generation. Or, if you are buying a Mac Mini with 64GB of RAM for local LLMs, that is understandable.

If the above cases don't apply, there's no need to buy a Mac Mini. I also plan to have it develop Apple-side apps using cross-platform frameworks (`kmp`, `flutter`, game engines) rather than native ones, and I don't yet need to entrust my entire PC to the LLM, so I didn't buy a Mac Mini. Since the LLM connects via an account, the PC performance doesn't need to be exceptionally high. So, I resurrected a Surface Pro 4 with a broken screen that was stuck in storage, installed a Linux server on it, and installed Openclaw there. An N100 low-power barebone PC also looks good, and if you're doing complex tasks (like project builds), a barebone PC with a high-performance CPU is fine (though with current RAM prices, a Mac Mini can be cheaper than a high-perf PC).

Since Openclaw takes all permissions to control the PC, I recommend installing it on a separate PC rather than your primary one. No matter how smart LLMs have become, they are not perfect and operate based on probabilistic reasoning, meaning they can perform unwanted actions at any time. This is also communicated to users with a strong warning during the Openclaw installation.

---
# Simple Setup
Just install it, agree to the terms, connect your Codex account, and connect a Telegram bot. You can easily create and manage a Telegram bot using the `BotFather` bot.
The initial setup (Setup wizard) allows for various configurations to be done visually and easily (even though it's a CLI!), so I was able to start without any major difficulties.

Once the setup is complete and connected to Telegram (or another messaging app), chatting with the Telegram bot I created and connected allows Openclaw to receive the messages, work on the PC, and report the results back via Telegram.
It really feels like using ChatGPT through Telegram, but now it's using my own PC.

---
# Usage Review
I liked the feeling of communicating with my PC as if I were talking to a friend through the GUI of an IM messaging app I use daily.
Furthermore, it supports various complex settings (Skills, internal Cronjobs, and hundreds of other configurations) and plugins, and being able to configure and manage these relatively easily in the dashboard (WebUI) was excellent. As expected, GUI cannot help but be more popular than CLI.

Moreover, while general AI usage creates a separate session for each chat and performance drops as that session grows longer, Openclaw can continue multiple tasks within a single session using its own memory management solution. It seems to constantly change context internally and store only necessary information, making it truly feel like delegating work to a human.

---
# Conclusion

For now, the current noise is definitely a bit of a fuss.
However, I want to give it credit from the perspective of "convenience."
A convenient tool created by the combination of technological advancement and laziness.

However, as it is a tool that processes automation through natural language, tasks can accumulate enormously inside if you don't pay attention. This means tokens can be consumed insanely fast before you know it. Therefore, even if you use the Codex Pro version, you must manage Cronjobs and handle session and token management well. You shouldn't forget that it's a tool that conveniently provides memory management, agent management, and IM connection. Especially if you are using other LLMs (`Claude`, `Gemini`), it would be a good method to let Openclaw's Agents be handled by Codex and have those Agents use the `Claude`/`Gemini` CLI when performing actual tasks to split token consumption and work smarter.

I've ended this abruptly because I suddenly got too lazy to write (sigh, this is all a side effect of AI), but I will fill in more content when I have more time.
