# 🛠️ Solana Workshop Kit

Build on Solana with AI in minutes — **clone, add your key, run opencode.** No install scripts, nothing touched outside this folder.

This one self-contained kit bundles the [solana.new](https://www.solana.new) skills (32 of them: idea → build → launch)
ready for **[opencode](https://opencode.ai)**, wired to a shared **OpenAI-compatible** LLM endpoint.
Each student uses their **own** API key, so nobody burns someone else's budget.

Everything lives **inside the repo**: the skills are in `.claude/skills/`, the provider config is in `opencode.json`.
opencode discovers them automatically when you run it from this folder — there's nothing to install.

---

## ⚡ Quickstart (3 steps)

```bash
# 1. Clone
git clone https://github.com/JingYuan0926/solana-workshop-kit.git
cd solana-workshop-kit

# 2. Add YOUR key — paste it into key.txt (you each get your own; never share it)
cp key.txt.example key.txt        # then open key.txt and paste your sk-... key

# 3. Run opencode FROM this folder (it reads your key + skills + provider automatically)
opencode
```

Don't have opencode yet?

```bash
curl -fsSL https://opencode.ai/install | bash
```

In opencode, pick the model **`rapidscreen/claude-sonnet-4-6`** (the cheaper one) and try:

> *"What should I build for the Solana hackathon?"*

Type `/` to see the bundled skills — they also **auto-activate** based on what you ask.

---

## 🔀 Pick your phase (agents)

Press **`Tab`** in opencode to switch between agents. Alongside the built-in `build` and `plan`, this kit adds
three phase agents (all pinned to the cheaper sonnet), so you can steer the session to the right stage:

| Agent | Use it for | Leans on skills like |
|---|---|---|
| **`idea`** | discover & validate what to build | find-next-crypto-idea, validate-idea, competitive-landscape |
| **`ship`** | scaffold, build, debug your app | scaffold-project, build-defi-protocol, debug-program |
| **`launch`** | deploy, pitch, submit | deploy-to-mainnet, create-pitch-deck, submit-to-hackathon |

- **In the TUI:** `Tab` cycles agents (current agent shows at the bottom).
- **One-shot from the CLI:** `opencode run --agent idea "I want to build a DeFi app — what should I make?"`
- Each phase agent is locked to `claude-sonnet-4-6`. To let the model picker choose instead, delete that
  agent's `"model"` line in `opencode.json`.

---

## 💸 Models & cost

Your key is on a shared LiteLLM proxy with a **$25 budget**. Two models — **use Sonnet**, it's cheaper on every axis:

| Model | Input / 1M | Output / 1M |
|---|---|---|
| **`claude-sonnet-4-6`** ✅ default | **$3** | **$15** |
| `claude-opus-4.6` | $5 | $25 |

The default in `opencode.json` is already set to Sonnet.

> ⚠️ **opencode will show your cost as `$0.00`.** That's cosmetic — opencode can't price a custom proxy's
> models, so it can't compute spend. You're still being billed against the $25 budget. Track real usage on
> the proxy side, not opencode's display.

---

## 🧠 What you get — 32 skills

| Phase | Skills |
|---|---|
| **Idea** | find-next-crypto-idea · validate-idea · competitive-landscape · defillama-research · colosseum-copilot · solana-beginner · learn |
| **Build** | scaffold-project · build-defi-protocol · build-data-pipeline · build-mobile · launch-token · debug-program · build-with-claude · product-review · roast-my-product · design-taste · frontend-design-guidelines · …and more |
| **Launch** | deploy-to-mainnet · create-pitch-deck · submit-to-hackathon · apply-grant · marketing-video |

Just ask in plain English (*"scaffold my project"*, *"roast my product"*, *"deploy to mainnet"*) — the matching skill kicks in.

---

## 🔐 Key handling (important)

- Your key is **personal**. Put it in **`key.txt`** (copy `key.txt.example` → `key.txt`, paste your `sk-...` key).
- `key.txt` is **gitignored**, so your key is never committed. `opencode.json` reads it via `{file:./key.txt}`,
  so the key never lives in any tracked file.
- **No `export`, no `.env`, no shell setup.** opencode reads `key.txt` directly every time you launch it from
  this folder — set it once and it persists with the kit. (opencode does not read `.env` files.)
- Prefer an environment variable instead? Change `opencode.json`'s `apiKey` to `{env:LITELLM_API_KEY}` and
  `export LITELLM_API_KEY=sk-...` in the same shell before running opencode.

---

## 📦 What's in the kit (nothing hidden, nothing global)

```
solana-workshop-kit/
├── opencode.json          # litellm provider + default model (sonnet), reads key.txt
├── .claude/
│   ├── skills/            # all 32 skills (auto-discovered by opencode)
│   └── data/              # shared knowledge base the skills read
├── key.txt.example        # copy to key.txt and paste your key
├── .gitignore             # ignores key.txt (your secret)
└── README.md
```

This kit installs **nothing** on your system — no global skills, no `~/.codex`, no telemetry, and it never
edits your `~/.claude/settings.json`. Delete the folder and it's gone. opencode (and Claude Code) read
`.claude/skills/` straight out of the cloned repo.

---

## 🆘 Troubleshooting

- **401 / "No api key passed in"** → your `key.txt` is missing or empty. Create it (`cp key.txt.example key.txt`), paste your `sk-...` key, save, then **restart opencode** (it reads the key at startup). The file should contain nothing but the key.
- **Provider/model missing** → run `opencode` from **inside** this repo (or a subfolder of it) so it picks up this repo's `opencode.json`.
- **Skills not showing** → make sure the folder is a git repo (a clone always is) and you're inside it; opencode finds `.claude/skills/` by walking up to the git root.
- **Catalog lookups** → solana.new's public bundle omits the `data/catalogs/*.json` ecosystem catalogs, so `navigate-skills` / `competitive-landscape` fall back to live web search — same behaviour as the official install.
- **Prefer Claude Code?** It reads the same `.claude/skills/` — just run `claude` from this folder instead.

---

*Skills by [SendAI](https://www.sendai.fun) & [Superteam](https://superteam.fun) via [solana.new](https://www.solana.new). Packaged for opencode.*
