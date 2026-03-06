---
publish: true
lang: en
title: "First Impressions of Openclaw After Installing on Linux"
---
# Introduction
Following ML and deep learning, the world began to change rapidly with the emergence of Transformer & Attention-based LLM AI. Change wasn't slow before, but LLM AI feels like something that could achieve a new industrial revolution or technical singularity.

Among these, tools have emerged that leverage this LLM AI to easily manipulate PCs beyond simple chatbots, and one such open-source program is called `Openclaw`.

It was already a project of interest, but with the recent rapid advancement of LLMs, its performance has improved quickly, making the tool very famous. Now, it has even gone viral to the point where non-experts interested in AI try it once and are amazed.

---
# What is Openclaw
The name has changed twice (`Clawdbot` -> `Moltbot`), but the history isn't important for this post. Simply put:
> A tool that allows LLM models like GPT to directly control the entire computer and makes it easy to set up.

In fact, this wasn't impossible even without Openclaw. Even without a chatbot client (like `ChatGPT`), one could use APIs or run local LLMs (like `ollama`, `gpt-oss`), and simply let them control the PC. Starting with `Claude Code`, tools like `Gemini CLI` and `Codex CLI` are chatbots that run directly in the terminal. While their purpose was coding agents, they were effectively LLM clients capable of executing CLI commands, allowing for limited PC control.

However, we wanted to assign tasks remotely, not necessarily while sitting in front of the computer. To do this, complex settings such as SSH, MCP, and permissions had to be managed manually. Services like `Omnara` emerged to alleviate some of this complexity, but they were either paid or only solved minor issues, falling short of being a definitive solution. In the meantime, the `Clawdbot` project, which an Austrian developer started as a **hobby**, grew through word of mouth to become `Openclaw`.

After installing `Openclaw` on a PC and going through a very simple setup, the LLM takes control of the PC, allowing you to easily issue commands through IM apps like Telegram. It's not just about chatting; you use messaging apps to tell your computer what to do.

For example, you can have it code, conduct research, write documents, manage emails, or even browse the web and shop via Telegram. You can simply **assign tasks while having real-time conversations with your PC through a messenger**. Because of this feature, many people use the expression "Jarvis from Iron Man on my PC." In short, Openclaw acts as a gateway connecting IM apps and your PC via LLM. Beyond that, it's an integrated AI Agent program that provides easy management of various skills, plugins, and settings, while supporting a dedicated session memory feature.

---
# Choosing a PC
So many people choose the Mac Mini as an Openclaw host that it has caused a shortage. However, most people seem to think you "must" use a Mac Mini. You should use a Mac Mini in the following cases; otherwise, there's no need. Openclaw is a "cross-platform" tool to begin with.

- You want to develop native iOS & macOS apps via Openclaw.
- You want to control all computer functions using the monitor and mouse (browsing the web, writing complex documents, shopping, etc.).
- You need a separate low-power macOS computer to keep on 24/7.
- You want a Mac and need an excuse.

If you already have a Mac, you can just install it on your current machine. Try creating a virtual machine or container on your Mac for a test run.

Interestingly, some suggested buying a Mac Mini to "run local LLMs and save tokens," but the current shortage is for the base Mac Mini M4. No matter how much the Mac Mini shares RAM with the GPU, it's difficult to run the LLMs used for Openclaw with only 16GB of VRAM. It might make sense for fine-tuned small LLMs or specific tasks like media generation. Or, if you buy a Mac Mini with 64GB of RAM for local LLMs, I'll give you that.

If you're not in the above situations, there's no need to buy a Mac Mini. I plan to develop Apple-side apps using cross-platform tools (KMP, Flutter, game engines) rather than natively, and since I don't need to hand over my entire PC to an LLM yet, I didn't buy a Mac Mini. Since LLMs connect via accounts, the PC doesn't need to be high-performance. So, I resurrected a Surface Pro 4 with a broken screen from my storage, set up a Linux server, and installed Openclaw there. An N100 low-power barebone PC also looks good, and for more complex tasks (like project builds), a barebone PC with a high-performance CPU is fine (though with current RAM prices, a Mac Mini might actually be cheaper than a high-performance PC).

Since Openclaw takes full control over the PC, it is recommended to install it on a separate machine rather than your primary one. No matter how smart LLMs have become, they aren't perfect; since they operate on probabilistic reasoning, they can perform unwanted actions at any time. Openclaw informs users of this with a strong warning during installation.

---
# Simple Setup
Just install it, agree to the terms, connect your Codex account, and link a Telegram bot. You can easily create and manage a Telegram bot using the `BotFather` bot.
During the initial setup (Setup wizard), I was able to easily configure various settings visually (even though it's a CLI!), so I could start without much trouble.

Once the setup is complete and connected to Telegram (or another messaging app), chatting with the bot you created will have Openclaw receive the message, perform the task on the PC, and report the results back on Telegram. It feels like using ChatGPT via Telegram, but it's using my actual PC.

---
# Experience
I liked the feeling of talking to my PC as if talking to a friend through the GUI of an IM app I use daily.
It supports various complex settings (Skills, internal Cronjobs, and hundreds of others) and plugins, and being able to configure and manage these relatively easily in the dashboard (WebUI) was excellent. As expected, GUIs are bound to be more popular than CLIs.

Furthermore, while typical AI usage creates a separate session for each chat and performance degrades as the session gets longer, Openclaw allows for continuous work in a single session thanks to its own memory management solution. It seems to constantly swap context internally and store only necessary information, making it really feel like giving work to a person.

---
# Conclusion

For now, the hype is definitely exaggerated.
However, I want to give it credit from the perspective of "convenience."
A convenient tool created by technological advancement + laziness.

However, as it's a tool that processes automation through natural language, tasks can accumulate internally if you're not careful. This means tokens can be consumed at an insane rate before you know it. Even if you use the Codex Pro version, you need to manage Cronjobs and handle session and token management well. You must not forget that it's just a tool that provides easy memory management, agent management, and IM connection. Especially if you use other LLMs (Claude, Gemini), a good strategy would be to have Openclaw agents handled by Codex, and then have those agents use Claude/Gemini CLI for the actual tasks to split token consumption and handle work more intelligently.

I suddenly got lazy writing (ha, this is all a side effect of AI), so I'm ending this abruptly, but I'll add more content later when I have time.
