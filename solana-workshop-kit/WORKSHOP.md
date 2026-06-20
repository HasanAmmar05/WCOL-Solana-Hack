# 🚀 Solana Workshop — Participant Guide

Build a Solana app with AI in ~5 minutes. Follow these steps **in order**.

---

## 0. What you need

- A laptop (macOS, Linux, or Windows) with a terminal.
- **Your personal API key** — looks like `sk-...`, given to you by the organizers. It has a **$25 budget**. **Do not share it.**
- ~5 minutes.

---

## 1. Install opencode  *(once per machine)*

opencode is the AI agent that runs this kit.

| OS | Command |
|----|---------|
| **macOS** (Homebrew) | `brew install anomalyco/tap/opencode` |
| **macOS / Linux** (any) | `curl -fsSL https://opencode.ai/install \| bash` |
| **Windows** | `scoop install opencode`  (or download from opencode.ai/download) |

Check it worked:
```bash
opencode --version
```
You should see a version like `1.17.8`.

---

## 2. Get the kit

```bash
git clone https://github.com/JingYuan0926/solana-workshop-kit.git
cd solana-workshop-kit
```

---

## 3. Add your key

```bash
cp key.txt.example key.txt
```
Now open **`key.txt`**, delete the placeholder, **paste your `sk-...` key**, and save.
The file should contain **only your key** — nothing else.

> 🔒 `key.txt` is gitignored, so your key stays private and is never committed.
> No `export`, no `.env`, no shell setup — opencode reads `key.txt` automatically.

---

## 4. Run it

```bash
opencode
```
**Run this from *inside* the `solana-workshop-kit` folder.**

✅ Look at the **bottom bar** — it must say:
```
Claude Sonnet 4.6 (cheaper — use this)  ·  RapidScreen (LiteLLM)
```
❌ If it says **`OpenCode Zen`** / **`Big Pickle`**, you launched it from the wrong folder.
Quit (`/exit`), `cd solana-workshop-kit`, and run `opencode` again.

---

## 5. Use it

**Pick a phase — press `Tab`** to cycle through agents:

| Agent | For | Try saying |
|-------|-----|-----------|
| **`idea`** | figure out *what* to build | *"I'm new to Solana — help me find a DeFi idea I can build this weekend."* |
| **`ship`** | scaffold, build, debug | *"Scaffold a Solana token-gated chat app."* |
| **`launch`** | deploy, pitch, submit | *"Write a pitch deck for my Solana project."* |

- Just describe what you want in plain English — the matching **skill** activates automatically.
- The **first** reply takes a few seconds (loading skills); after that it's fast.
- **Keep the default model (sonnet)** — it's the cheapest and best for stretching your $25.

To quit: type `/exit` (or press `Ctrl+C`).

---

## 🆘 Troubleshooting

| Problem | Fix |
|---------|-----|
| **"No api key passed in" / 401** | `key.txt` is missing or empty. Paste your `sk-...` key into it, save, and **restart opencode**. |
| **Bottom bar says "OpenCode Zen / Big Pickle"** | You're in the wrong folder. `cd solana-workshop-kit` and run `opencode` there. |
| **`Ctrl+X` / `Ctrl+P` shortcuts do nothing** | You're in an IDE's built-in terminal (VS Code / Cursor / Antigravity) — it eats those keys. Use the **macOS Terminal app** or **iTerm2** instead. (`Tab` works everywhere.) |
| **Cost shows `$0.00`** | Cosmetic — opencode can't price this custom model. You *are* spending the $25 budget; just can't see it here. |
| **First reply is slow** | One-time setup (downloads model data + a provider package). Later prompts are quick. Pre-run once before the session to warm it up. |
| **Skills don't show up** | Make sure you're inside the cloned kit folder (it's a git repo); opencode finds skills by walking up to the git root. |

---

## 💡 Tips

- **Stay on sonnet** unless you really need more power — it's ~40% cheaper than opus and keeps you inside the $25.
- Your key is **personal**. Don't share it or paste it into chats/screenshots.
- Everything lives inside this folder. Delete `solana-workshop-kit` and it's all gone — nothing is installed globally.

**Happy building! 🛠️**
