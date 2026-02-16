---
publish: true
lang: en
title: "First Impressions of Openclaw Linux Installation"
---
# Introduction
Following ML and deep learning, the emergence of Transformer & Attention-based LLM AI has begun to change the world rapidly. While change wasn't slow before, LLM AI feels like something that could achieve a new industrial revolution or a technological singularity.

Among these developments, tools have emerged that use LLM AI to go beyond simple chatbots and easily manipulate the PC itself. One such program, released as open source, is called `Openclaw`.

It was already a project garnering attention, but with the recent rapid development of LLMs, its performance has improved significantly, making the tool very famous. It has even gone viral to the point where non-experts interested in AI are amazed after trying it once.

---
# What is Openclaw
The name has changed twice (`Clawdbot` -> `Moltbot`), but the history isn't important for this post. In short, it is as follows:
> A tool that allows LLM models like GPT to directly manipulate an entire computer and makes it easy to set up.

In fact, this wasn't impossible even without Openclaw. Even without chatbot clients (like `ChatGPT`), one could use LLM APIs or run local LLMs (like `ollama`, `gpt-oss`), and simply let them control the PC. With `Claude Code` leading the way, tools like `Gemini CLI` and `Codex CLI` appeared as chatbots running directly in the terminal. While their purpose was as coding agents, they were effectively LLM clients that could execute CLI commands directly, allowing for limited PC control.

However, we wanted to assign tasks remotely, not just when sitting in front of the computer. To do this, complex settings such as SSH, MCP, and permissions had to be managed manually. Services like `Omnara` emerged to alleviate some of this complexity, but they were either paid or only solved minor issues, falling short of being a definitive solution. In the midst of this, the `Clawdbot` project, started as a **hobby** by a developer in Austria, grew and went viral, becoming `Openclaw`.

After installing `Openclaw` on a PC and going through a very simple configuration, the LLM takes control of the PC, allowing for easy commands via IM apps like Telegram. It's not just about chatting; it's about ordering your computer to perform tasks through a messaging app.

For example, you can use Telegram to have it code, conduct research, write documents, manage emails, or even surf the web and shop. You can assign tasks while **chatting with your PC in real-time through a messenger**. Because of this feature, many people use the expression "Iron Man's Jarvis for my PC." In other words, Openclaw is a program that acts as a gateway connecting IM apps and your PC via LLM.

---
# Selecting the PC to Run On
So many people choose the Mac Mini as an Openclaw host that it has caused a shortage. However, most people seem to believe they "must use a Mac Mini." You should use a Mac Mini in the following cases; otherwise, there's no need. Openclaw is a "cross-platform" tool to begin with.

- You want to develop native iOS & macOS apps using Openclaw.
- You want to control all computer functions using the monitor and mouse (navigating web screens, writing complex documents, shopping, etc.).
- You need a separate low-power macOS computer to keep on 24/7.
- You want a Mac and need an excuse.

If you already have a Mac, you can just install it on your current machine. Try it out by creating a virtual machine or a virtual container.

Interestingly, some suggested buying a Mac Mini to "save tokens by running local LLMs," but the current shortage is for the base Mac Mini M4. No matter how much the Mac Mini shares RAM with the GPU, it's difficult to run an LLM for Openclaw with only 16GB of VRAM. It might be plausible for fine-tuned small LLMs or specific tasks like media generation. Or, if you buy a Mac Mini with 64GB of RAM for local LLMs, that I can acknowledge.

Unless you fall into those categories, there's no need to buy a Mac Mini. I plan to develop Apple-side apps using cross-platform frameworks (kmp, flutter, game engines) rather than native ones, and since I don't need to entrust my entire PC to an LLM yet, I didn't buy a Mac Mini. Because the LLM connects via an account, high PC performance isn't necessary. So, I resurrected a Surface Pro 4 with a broken monitor from storage, installed a Linux server, and set up Openclaw on it. An N100 low-power barebone PC seems like a good choice, and for more complex tasks (like project builds), a barebone PC with a high-performance CPU is also fine (though a Mac Mini is currently cheaper than a high-performance PC due to abnormal RAM prices).

Since Openclaw takes full control over the PC, it is recommended to install it on a separate machine rather than your primary one. No matter how smart LLMs have become, they aren't perfect; since they operate on probabilistic reasoning, they can perform unintended actions at any time. This is communicated to users through a strong warning during Openclaw installation.

---
# Simple Setup 
You just install it, agree to the terms, connect your Codex account, and link a Telegram bot. You can easily create and manage a Telegram bot using the `BotFather` bot.
During the initial setup (Setup wizard), various configurations can be done visually and easily (even though it's a CLI!), so I could start without much difficulty.

Once setup is complete and Telegram is connected, chatting with the bot you created will have Openclaw receive the message, perform the task on the PC, and report the results back to Telegram.
It really feels like using ChatGPT through Telegram, but it's using my PC.

---
# Usage Review
I liked the feeling of communicating with my PC using a familiar IM app GUI, as if talking to a friend.
The support for various complex settings (Skills, custom Cronjobs, and hundreds of other options) and plugins, which can be managed relatively easily through a dashboard (WebUI), was also excellent. As expected, GUIs are bound to be more popular than CLIs.

---
# Conclusion

First of all, the current hype is indeed a bit exaggerated.
However, I'd give it a thumbs up for "convenience."
A convenient tool born from technological progress and laziness.

I suddenly felt lazy to write (sigh, this is a side effect of AI), so I'm ending this abruptly, but I'll add more content later when I have more time.
