---
publish: true
lang: en
title: "First Impressions of Openclaw After Installing on Linux"
---
# Introduction
Since the emergence of Transformer & Attention LLM AI following ML and deep learning, the world has begun to change rapidly. While change wasn't slow before, LLM AI feels like something that could potentially achieve a new industrial revolution or a technological singularity.

Among these developments, tools have appeared that use LLM AI to easily control PCs beyond simple chatbots, and one such program distributed as open source is called `Openclaw`.

Although it was already a project of interest, its performance has improved rapidly alongside the recent explosive growth of LLMs, making the tool very famous. It has even reached the point of viral marketing, where non-experts interested in AI use it once and are left in awe.

---
# What is Openclaw
The name has changed twice (`Clawdbot` -> `Moltbot`), but the history isn't important for this post. Simply put:
> A tool that allows LLM models like GPT to directly control an entire computer and makes it easy to set up.

In fact, this sort of thing was not impossible even without Openclaw. One could use APIs or run local LLMs (`ollama`, `gpt-oss`, etc.) instead of just chatbot clients (`ChatGPT`, etc.) and simply let them control the PC. Tools like `Gemini CLI` and `Codex CLI`, following the lead of `Claude Code`, are chatbots that run directly in the terminal. While their primary purpose was as coding agents, they were effectively LLM clients capable of executing CLI commands directly, allowing for limited control over the PC.

However, we wanted to be able to assign tasks remotely even when not in front of the computer. This required manually managing complex settings like SSH, MCP, and permissions. Services like `Omnara` emerged to alleviate some of this complexity, but they were either paid or only solved part of the problem without being definitive. In the midst of this, the `Clawdbot` project, started as a **hobby** by a developer in Austria, grew and gained word-of-mouth popularity to become `Openclaw`.

After installing `Openclaw` on a PC and going through a very simple setup, the LLM takes control of the PC, allowing you to issue commands very easily through IM apps like Telegram. It's not just about chatting; you are assigning tasks that your computer can perform through a messaging app.

For example, you can have it code, conduct research, write documents, manage emails, and even browse the web or go shopping via Telegram. You can assign tasks by simply **conversing with your PC in real-time through a messenger**. Because of this functionality, many people use the expression "Jarvis from Iron Man on my PC." In other words, Openclaw is a program that acts as a gateway, connecting IM apps to your PC via an LLM.

---
# Selecting a PC to Run It
Many people are choosing the Mac Mini as an Openclaw host, to the point where the Mac Mini is facing shortages because of it. However, it seems most people just think "I have to use a Mac Mini." You should use a Mac Mini in the following cases; otherwise, there's no need to use one. After all, Openclaw is a "cross-platform" tool.

- I want to develop native iOS & macOS apps via Openclaw.
- I want to control all computer functions using the monitor and mouse, beyond simple text and coding tasks (e.g., browsing web screens, writing complex documents, shopping, etc.).
- I need a separate low-power macOS computer to keep running 24/7.

If you already have a Mac, you can just install it on the Mac you're using. For a trial, try setting up a virtual machine or a virtual container on your Mac and experience it.

Notably, there was an opinion about buying a Mac Mini to "save tokens by running a local LLM," but the current shortage is for the base M4 Mac Mini. Even though the Mac Mini shares RAM with the GPU, it's difficult to run the LLMs needed for Openclaw with only 16GB of VRAM. It might make sense if it's for a small, fine-tuned LLM or specific tasks like media generation. Or, if you buy a Mac Mini with 64GB of RAM for a local LLM, that's understandable.

If the above cases don't apply, there's no need to buy a Mac Mini. I also plan to develop Apple-side apps using cross-platform frameworks (KMP, Flutter, game engines) rather than native ones, and since I don't need to entrust my entire PC to an LLM yet, I didn't buy a Mac Mini. Because LLMs connect via accounts, the PC performance doesn't need to be top-tier. So, I resurrected a Surface Pro 4 with a broken screen from storage, installed a Linux server on it, and set up Openclaw there. An N100 low-power barebone PC also seems like a good choice, and for more complex tasks (like building projects), a barebone PC with a high-performance CPU is fine (though with current RAM price hikes, a Mac Mini is actually cheaper than a high-performance PC).

Since Openclaw takes full authority to control the PC, it's recommended to install it on a separate PC rather than your daily driver. No matter how smart LLMs have become, they aren't perfect; since they operate on probabilistic reasoning, they can perform unwanted actions at any time. Openclaw informs users of this with a strong warning during installation.

---
# Simple Setup
I'm getting too lazy to write.
Just install it, agree to the terms, connect your Codex account, and link a Telegram bot. You can easily create and manage a Telegram bot using the `BotFather` bot.
Then, if you chat in Telegram, Openclaw will receive it, perform the task on the PC, and notify you of the result via Telegram.
It really feels like using ChatGPT through Telegram.

---
# Task Review
I liked the feeling of conversing with my PC through a familiar IM messaging app GUI, just like talking to a friend.

---
# Conclusion

First of all, the current hype is indeed a bit much.
However, I want to give it credit from the perspective of "convenience."
A convenient tool created by technological advancement + laziness.
