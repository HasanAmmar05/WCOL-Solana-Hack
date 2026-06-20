# WorldCup Oracle League (WCOL)

**Track:** FIFA World Cup 2026  
**Tagline:** Predictions are screenshots. Ours are on-chain.

---

## Problem

Every World Cup, animals, mystics, and AIs claim they called the results — but
predictions are screenshots that anyone can backdate or fake. Fans have no way
to know who actually saw it coming before kickoff.

## Solution

WCOL commits every oracle prediction to Solana before kickoff with a tamper-proof
timestamp. Fans can back an oracle and receive a FanProof ticket — permanent on-chain
proof they picked before the match.

The chain is the referee.

---

## Live Demo

**Demo URL:** [Add Vercel URL here]  
**GitHub:** [Add GitHub URL here]  
**Program ID:** MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr (Memo) + Custom Anchor IDL  
**Network:** Solana devnet

---

## Solana Integration

| Instruction | Description |
|---|---|
| `commit_prediction` | Stores oracle prediction hash + Clock timestamp on-chain via Memo program |
| `mint_fan_proof` | Creates FanProof record proving fan backed oracle before kickoff |

Both instructions write to **Solana devnet** with real block timestamps.

---

## Demo Flow

1. **Leaderboard** — 5 oracles ranked by accuracy after 4 WC2026 matches
2. **Today's Match** — Spain v Saudi Arabia, 5 oracle picks side by side
3. **Back an Oracle** — Email login via Privy → FanProof minted on-chain
4. **Commit Oracle** — Admin commits Harimau Malaya prediction live → explorer link with timestamp before kickoff
5. **The Wow** — Timestamp on-chain proves prediction was made before kickoff, immutable

---

## Tech Stack

- **Blockchain:** Solana devnet
- **Frontend:** Next.js 15 + Tailwind CSS
- **Auth:** Privy (email login, embedded wallets)
- **On-chain:** @solana/web3.js + Solana Memo Program
- **RPC:** Helius devnet

---

## Team

Built with solana.new · Superteam MY Hackathon 2026
