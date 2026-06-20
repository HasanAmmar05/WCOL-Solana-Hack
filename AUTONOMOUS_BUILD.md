# WCOL — Autonomous Build Agent
# Paste this ENTIRE file as your first and only message into solana.new
# Claude Code runs continuously until the demo works. Do not interrupt.
# Only stop and ask the human if you need a Privy App ID or Helius API key.

---

## YOUR IDENTITY

You are an autonomous Solana build agent with one job: ship a working
WorldCup Oracle League demo by 4PM. You do not stop between phases. You
do not ask for permission to continue. You fix your own errors. If one
approach fails twice, you switch to the fallback immediately.

The only time you pause and ask the human is:
1. You need a Privy App ID (takes them 2 minutes at dashboard.privy.io)
2. You need a Helius API key (takes them 2 minutes at dev.helius.xyz)
3. A hardware/environment issue you cannot resolve

Everything else: solve it yourself and keep moving.

After every phase print: ✓ PHASE [N] COMPLETE — [one line summary]
After every on-chain action print the full Solana explorer link.

---

## WHAT YOU ARE BUILDING

**WorldCup Oracle League (WCOL)**
Tagline: "Predictions are screenshots. Ours are on-chain."

The core problem (one sentence, memorise this for the demo):
"Every World Cup, animals, mystics, and AIs all claim they called it —
but predictions are screenshots that anyone can backdate or fake.
Fans have no way to know who actually saw it coming."

Why Solana is the ONLY answer:
A prediction hash committed to Solana BEFORE kickoff is permanently
timestamped and tamper-proof. That is not possible with a screenshot,
a tweet, or a database. The chain is the referee.

The demo loop that must work at the end:
1. User sees leaderboard — oracles ranked by accuracy, real WC2026 data
2. User sees today's match with 5 oracle picks side by side
3. User clicks "Back this oracle" → email login → NFT mints → explorer link
4. Admin commits a fresh AI oracle prediction live on-chain → explorer link
   shows timestamp BEFORE kickoff — the wow moment
5. Leaderboard updates to show the AI oracle committed before kickoff

If all 5 work cleanly — you are done. Not before.

---

## TECHNICAL CONSTANTS — DO NOT CHANGE THESE

```
Network:          Solana devnet
RPC:              Helius devnet (or https://api.devnet.solana.com as fallback)
Auth:             Privy — email login, embedded wallet, no Phantom required
NFT:              Metaplex Core (single asset mint, lightweight)
Frontend:         Next.js + Tailwind CSS
Storage:          oracles.json + predictions.json + tickets.json (flat files)
Anchor version:   Latest stable
Node version:     18+
```

---

## SEED DATA — HARDCODE THIS, DO NOT FETCH

### Oracles (5 only)
```json
[
  {
    "id": "harimau_malaya",
    "name": "🐯 Harimau Malaya AI",
    "type": "AI",
    "region": "Malaysia",
    "description": "Malaysian AI oracle with regional flair",
    "accuracy": 4,
    "total": 4
  },
  {
    "id": "opus_octopus",
    "name": "🐙 Opus the Octopus",
    "type": "AI Animal",
    "region": "Global",
    "description": "Claude-powered successor to Paul the Octopus",
    "accuracy": 3,
    "total": 4
  },
  {
    "id": "opta_super",
    "name": "💻 Opta Supercomputer",
    "type": "Stats Model",
    "region": "Europe",
    "description": "Statistical supercomputer — missed Czechia 1-1 draw",
    "accuracy": 3,
    "total": 4
  },
  {
    "id": "polymarket",
    "name": "🧠 The Crowd",
    "type": "Prediction Market",
    "region": "Global",
    "description": "Polymarket crowd wisdom — adapts fastest after each match",
    "accuracy": 4,
    "total": 4
  },
  {
    "id": "greenstone",
    "name": "🔮 Greenstone Lobo",
    "type": "Mystic",
    "region": "India",
    "description": "Vedic astrologer — predicts England to win",
    "accuracy": 2,
    "total": 4
  }
]
```

### Played matches (for leaderboard accuracy)
```json
[
  { "id": "m1", "home": "Mexico", "away": "South Africa", "home_code": "MEX", "away_code": "RSA", "result": "home_win", "score": "2-0", "date": "2026-06-11" },
  { "id": "m2", "home": "Germany", "away": "Curaçao", "home_code": "GER", "away_code": "CUW", "result": "home_win", "score": "7-1", "date": "2026-06-14" },
  { "id": "m3", "home": "Switzerland", "away": "Bosnia", "home_code": "SUI", "away_code": "BIH", "result": "home_win", "score": "4-1", "date": "2026-06-18" },
  { "id": "m4", "home": "Canada", "away": "Qatar", "home_code": "CAN", "away_code": "QAT", "result": "home_win", "score": "6-0", "date": "2026-06-18" }
]
```

### Oracle predictions for played matches
```json
{
  "harimau_malaya": ["home_win","home_win","home_win","home_win"],
  "opus_octopus":   ["home_win","home_win","draw","home_win"],
  "opta_super":     ["home_win","home_win","away_win","home_win"],
  "polymarket":     ["home_win","home_win","home_win","home_win"],
  "greenstone":     ["home_win","draw","away_win","home_win"]
}
```
(index matches the played matches array above)

### Today's demo match
```json
{
  "id": "today",
  "home": "Spain",
  "away": "Saudi Arabia",
  "home_code": "ESP",
  "away_code": "KSA",
  "kickoff_utc": "2026-06-21T01:00:00Z",
  "oracle_picks": {
    "harimau_malaya": { "outcome": "home_win", "confidence": 82, "note": "Spain's squad depth too strong" },
    "opus_octopus":   { "outcome": "home_win", "confidence": 74, "note": "Historical record favours Spain" },
    "opta_super":     { "outcome": "home_win", "confidence": 78, "note": "Spain 78% win probability" },
    "polymarket":     { "outcome": "home_win", "confidence": 71, "note": "Market consensus: Spain wins" },
    "greenstone":     { "outcome": "draw",      "confidence": 55, "note": "Stars misaligned for clean win" }
  }
}
```

---

## PHASE 1 — ENVIRONMENT SETUP

```bash
# Scaffold with solana.new
npx solana-new@latest wcol --template anchor-next
cd wcol

# Install all deps
pnpm install
pnpm add @metaplex-foundation/mpl-core \
         @metaplex-foundation/umi \
         @metaplex-foundation/umi-bundle-defaults \
         @privy-io/react-auth \
         @solana/web3.js \
         @coral-xyz/anchor

# Generate a program keypair
solana-keygen new --outfile program-keypair.json --no-bip39-passphrase

# Generate admin wallet (for committing predictions in demo)
solana-keygen new --outfile admin-keypair.json --no-bip39-passphrase

# Fund both on devnet
solana airdrop 3 $(solana-keygen pubkey program-keypair.json) --url devnet
solana airdrop 3 $(solana-keygen pubkey admin-keypair.json) --url devnet

# Write seed data files
mkdir -p data
# Write oracles.json, matches.json, predictions.json from the seed data above
```

Write the three seed JSON files to `data/` directory now using the exact
seed data from the SEED DATA section above.

**Self-check:** Both wallets funded. Three JSON files in data/. Scaffold running.

**If airdrop fails:** Try https://faucet.solana.com — paste the pubkey, get SOL.

✓ Print PHASE 1 COMPLETE when done.

---

## PHASE 2 — ANCHOR PROGRAM

**Goal:** Two working instructions deployed to devnet with explorer links.

Create `programs/wcol/src/lib.rs`:

```rust
use anchor_lang::prelude::*;

declare_id!("REPLACE_WITH_PROGRAM_KEYPAIR_PUBKEY");

#[program]
pub mod wcol {
    use super::*;

    /// Commit an oracle prediction before kickoff.
    /// The Clock timestamp is the tamper-proof proof.
    pub fn commit_prediction(
        ctx: Context<CommitPrediction>,
        oracle_id: String,
        match_id: String,
        outcome: u8, // 0=home_win 1=draw 2=away_win
        prediction_hash: [u8; 32],
    ) -> Result<()> {
        let prediction = &mut ctx.accounts.prediction;
        let clock = Clock::get()?;

        prediction.oracle_id = oracle_id;
        prediction.match_id = match_id;
        prediction.outcome = outcome;
        prediction.prediction_hash = prediction_hash;
        prediction.committed_at = clock.unix_timestamp;
        prediction.committer = ctx.accounts.committer.key();
        prediction.bump = ctx.bumps.prediction;

        msg!(
            "Prediction committed: oracle={} match={} outcome={} at={}",
            prediction.oracle_id,
            prediction.match_id,
            prediction.outcome,
            prediction.committed_at
        );

        Ok(())
    }

    /// Mint a FanProof NFT — proof a fan backed an oracle before kickoff.
    pub fn mint_fan_proof(
        ctx: Context<MintFanProof>,
        oracle_id: String,
        match_id: String,
        backed_outcome: u8,
    ) -> Result<()> {
        let ticket = &mut ctx.accounts.ticket;
        let clock = Clock::get()?;

        ticket.fan = ctx.accounts.fan.key();
        ticket.oracle_id = oracle_id.clone();
        ticket.match_id = match_id.clone();
        ticket.backed_outcome = backed_outcome;
        ticket.minted_at = clock.unix_timestamp;
        ticket.bump = ctx.bumps.ticket;

        msg!(
            "FanProof minted: fan={} oracle={} match={} at={}",
            ticket.fan,
            ticket.oracle_id,
            ticket.match_id,
            ticket.minted_at
        );

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(oracle_id: String, match_id: String)]
pub struct CommitPrediction<'info> {
    #[account(
        init,
        payer = committer,
        space = 8 + PredictionCommit::INIT_SPACE,
        seeds = [b"pred", oracle_id.as_bytes(), match_id.as_bytes()],
        bump
    )]
    pub prediction: Account<'info, PredictionCommit>,

    #[account(mut)]
    pub committer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(oracle_id: String, match_id: String)]
pub struct MintFanProof<'info> {
    #[account(
        init,
        payer = fan,
        space = 8 + FanProofTicket::INIT_SPACE,
        seeds = [b"ticket", fan.key().as_ref(), oracle_id.as_bytes(), match_id.as_bytes()],
        bump
    )]
    pub ticket: Account<'info, FanProofTicket>,

    #[account(mut)]
    pub fan: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct PredictionCommit {
    #[max_len(32)]
    pub oracle_id: String,
    #[max_len(64)]
    pub match_id: String,
    pub outcome: u8,
    pub prediction_hash: [u8; 32],
    pub committed_at: i64,
    pub committer: Pubkey,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct FanProofTicket {
    pub fan: Pubkey,
    #[max_len(32)]
    pub oracle_id: String,
    #[max_len(64)]
    pub match_id: String,
    pub backed_outcome: u8,
    pub minted_at: i64,
    pub bump: u8,
}
```

Update `Anchor.toml`:
```toml
[programs.devnet]
wcol = "REPLACE_WITH_PROGRAM_KEYPAIR_PUBKEY"

[provider]
cluster = "devnet"
wallet = "./admin-keypair.json"
```

Build and deploy:
```bash
anchor build
anchor deploy --provider.cluster devnet
```

**Self-check:** Deploy outputs a Program ID. Copy it. Update `declare_id!()`.
Redeploy if needed. Print the explorer link:
`https://explorer.solana.com/address/[PROGRAM_ID]?cluster=devnet`

**If deploy fails (insufficient SOL):** `solana airdrop 3 --keypair admin-keypair.json --url devnet`
**If build fails (space error):** Increase space calculation — add 100 to INIT_SPACE.
**If IDL errors:** Run `anchor build` again clean after fixing.

✓ Print PHASE 2 COMPLETE + program explorer link when done.

---

## PHASE 3 — TEST BOTH INSTRUCTIONS

Write `tests/wcol.ts` and run it to confirm both instructions work:

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Wcol } from "../target/types/wcol";
import * as crypto from "crypto";

describe("wcol", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Wcol as Program<Wcol>;

  it("commits a prediction", async () => {
    const oracleId = "harimau_malaya";
    const matchId = "today";
    const outcome = 0; // home_win
    const hash = Array.from(crypto.randomBytes(32));

    const [predPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("pred"), Buffer.from(oracleId), Buffer.from(matchId)],
      program.programId
    );

    const tx = await program.methods
      .commitPrediction(oracleId, matchId, outcome, hash)
      .accounts({ prediction: predPda, committer: provider.wallet.publicKey })
      .rpc();

    console.log("✓ commit_prediction tx:", tx);
    console.log(`  Explorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`);

    const account = await program.account.predictionCommit.fetch(predPda);
    console.log("  Committed at:", new Date(account.committedAt.toNumber() * 1000).toISOString());
  });

  it("mints a fan proof ticket", async () => {
    const oracleId = "harimau_malaya";
    const matchId = "today";
    const backedOutcome = 0;

    const [ticketPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("ticket"),
        provider.wallet.publicKey.toBuffer(),
        Buffer.from(oracleId),
        Buffer.from(matchId),
      ],
      program.programId
    );

    const tx = await program.methods
      .mintFanProof(oracleId, matchId, backedOutcome)
      .accounts({ ticket: ticketPda, fan: provider.wallet.publicKey })
      .rpc();

    console.log("✓ mint_fan_proof tx:", tx);
    console.log(`  Explorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`);
  });
});
```

```bash
anchor test --skip-local-validator -- --provider.cluster devnet
```

**Self-check:** Both tests pass. Two explorer links printed. Both transactions
visible on devnet explorer. If yes — Phase 3 complete.

**If test fails with AccountNotFound:** The PDA derivation may mismatch.
Check seeds match exactly between program and test.
**If test fails with insufficient funds:** Airdrop more SOL to admin-keypair.

✓ Print PHASE 3 COMPLETE + both explorer links when done.

---

## PHASE 4 — FRONTEND: /leaderboard (DEFAULT PAGE)

**Goal:** Leaderboard renders with real oracle accuracy data. No on-chain calls needed here — pure seed data display. Get this working first because it's the first thing judges see.

Create `app/page.tsx` (the leaderboard):

```tsx
// Compute accuracy from seed data
// oracles sorted by accuracy desc
// Show: rank, oracle name+emoji, type, accuracy %, correct/total
// Highlight #1 in gold, #2 silver, #3 bronze
// Subtext: "After 4 matches played · Live World Cup 2026"
// Nav links to /match and /commit
```

Design requirements:
- Dark background (#0f0f0f) — looks good on projector
- Solana green (#14F195) for accents
- Large clear text — readable from 5 metres
- Each oracle row: big emoji, name, accuracy bar, correct/total fraction
- Top oracle has a 🔥 badge
- "The Opta Supercomputer missed the Czechia 1-1 draw" as a subtle subtext
  under Opta's row — this is the narrative punchline

**Self-check:** Open localhost:3000. Leaderboard shows 5 oracles ranked correctly.
Harimau Malaya and Polymarket tied at top (4/4). Greenstone at bottom (2/4).

✓ Print PHASE 4 COMPLETE when done.

---

## PHASE 5 — FRONTEND: /match PAGE

**Goal:** Today's match with 5 oracle picks + working "Back" button that mints on-chain.

Create `app/match/page.tsx`:

Layout:
- Header: "⚽ Spain v Saudi Arabia · Tonight · Group Stage"
- Subtext: "Pick your oracle before kickoff — your backing is timestamped on Solana"
- 5 oracle cards in a grid (2+2+1 layout on desktop, stack on mobile):
  Each card shows:
  - Oracle emoji + name
  - Their pick: big text "🇪🇸 Spain wins" or "Draw"
  - Confidence bar (e.g. 82%)
  - Their quote/note
  - "Back [Oracle]" button — prominent, Solana green

On "Back [Oracle]" click:
1. If not logged in → Privy email modal fires
2. After login → wallet exists silently
3. Call `mint_fan_proof` instruction on-chain
4. Show success state:
   - "✅ FanProof minted!"
   - "You backed [Oracle Name] — [Spain wins] — before kickoff"
   - Explorer link: "View your proof on Solana ↗"
   - Small text: "This timestamp proves you picked before the match"
5. Button changes to "✓ Backed" — disable further clicks for this oracle

Privy setup in `app/providers.tsx`:
```tsx
"use client";
import { PrivyProvider } from "@privy-io/react-auth";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ["email"],
        appearance: { theme: "dark" },
        embeddedWallets: { createOnLogin: "users-without-wallets" },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
```

API route `app/api/mint/route.ts`:
- Receives: { fan_wallet, oracle_id, match_id, backed_outcome }
- Server-side: constructs and sends mint_fan_proof transaction
- Uses admin-keypair.json to pay for the account (fan's embedded wallet signs)
- Returns: { tx_signature, explorer_url }

**IMPORTANT:** The fan's Privy embedded wallet signs the transaction.
The admin wallet pays for rent (to avoid asking users to have SOL).
Use `feePayer: adminKeypair.publicKey` pattern.

**Self-check:** Click "Back Harimau Malaya". Email modal. Login. Transaction fires.
Explorer link appears. Click it. Transaction exists on devnet. Ticket PDA created.

**If Privy wallet can't sign Anchor tx:** Use a server-side signing pattern.
The API route receives the oracle/match/outcome, builds the tx server-side
with admin as both payer and authority, submits it, returns the signature.
The user identity is stored in the ticket PDA via their wallet address.

✓ Print PHASE 5 COMPLETE + a test mint explorer link when done.

---

## PHASE 6 — FRONTEND: /commit PAGE (THE WOW MOMENT)

**Goal:** Admin page that commits a fresh AI oracle prediction live on-chain.
This is the single most important demo moment. It must work perfectly.

Create `app/commit/page.tsx`:

Layout:
- Header: "🐯 Harimau Malaya is making its prediction"
- Match info: "Spain v Saudi Arabia — kickoff in [COUNTDOWN]"
- Oracle reasoning displayed:
  "Spain's squad depth, tactical discipline, and recent form give them
  a clear edge. Saudi Arabia's compact defensive block may hold for 20
  minutes but Spain's pressing will break them down. Prediction: Spain wins."
- Big prediction display: "🇪🇸 SPAIN WINS" in large text
- Confidence: 82%
- Button: "⛓️ Commit to Solana" — large, prominent, Solana green

On button click:
1. Show loading: "Committing prediction to Solana devnet..."
2. Call `commit_prediction` instruction server-side
3. Generate sha256 hash of the prediction text as the prediction_hash
4. Show success:
   ```
   ✅ Prediction committed on-chain

   Oracle:      Harimau Malaya AI
   Pick:        Spain wins
   Committed:   [EXACT TIME e.g. "14:23:07 MYT"]
   Kickoff:     01:00 MYT (tonight)

   This prediction was made [X hours] before kickoff.
   It cannot be changed. It cannot be backdated.

   View on Solana Explorer ↗
   [full explorer link]
   ```
5. Store the committed_at timestamp prominently
6. Show the prediction hash (first 8 chars): "Hash: a3f9b2c1..."

API route `app/api/commit/route.ts`:
- Server-side using admin-keypair.json
- Generates the prediction hash from prediction text
- Calls commit_prediction instruction
- Returns { tx, committed_at, explorer_url }

**Self-check:** Press "Commit to Solana". Within 5-10 seconds, success state
appears with a real explorer link. Open the link. Transaction exists.
The timestamp on-chain is BEFORE the match kickoff time.

**CRITICAL FOR DEMO:** Run this ONCE before the demo to pre-commit a prediction
so there's already one on-chain. Then show it during the demo as "this was
committed 2 hours ago — look at the timestamp." That's even more powerful
than committing live because it proves tamper-proof pre-kickoff commitment.

✓ Print PHASE 6 COMPLETE + commit explorer link when done.

---

## PHASE 7 — NAVIGATION + POLISH

Create a clean nav bar visible on all pages:

```
[⚽ WCOL]  [🏆 Leaderboard]  [Today's Match]  [🐯 Commit Oracle]
```

Polish requirements (projector readiness):
- All text minimum 16px, key stats 28px+
- Explorer links open in new tab
- Loading states on all async actions (spinner, not blank)
- Mobile responsive (judges may check phones)
- No console errors
- No broken layouts at 1280px width

Add to leaderboard page footer:
```
"Predictions are screenshots. Ours are on-chain."
Built with solana.new · Superteam MY Hackathon 2026
```

Add a subtle "🔴 Live" badge next to "Spain v Saudi Arabia" on the match page.

✓ Print PHASE 7 COMPLETE when done.

---

## PHASE 8 — DEPLOY TO VERCEL

```bash
# Push to GitHub first
git init
git add .
git commit -m "WCOL — WorldCup Oracle League — Superteam MY Hackathon 2026"
git remote add origin https://github.com/[USERNAME]/wcol
git push -u origin main

# Deploy to Vercel
npx vercel --prod
```

Set these environment variables in Vercel dashboard:
```
NEXT_PUBLIC_PRIVY_APP_ID=        [from dashboard.privy.io]
HELIUS_DEVNET_RPC=               [from dev.helius.xyz or use https://api.devnet.solana.com]
NEXT_PUBLIC_PROGRAM_ID=          [the deployed program ID from Phase 2]
ADMIN_KEYPAIR_SECRET=            [JSON array of admin keypair secret key bytes]
NEXT_PUBLIC_CLUSTER=             devnet
```

**Self-check:** Visit the Vercel URL. All three pages load. Leaderboard renders.
Match page shows oracle picks. Commit page has the button.

✓ Print PHASE 8 COMPLETE + Vercel URL when done.

---

## PHASE 9 — FULL DEMO PATH TEST

Run through these 8 checkpoints in order. Fix anything that fails.
Do not move to Phase 10 until all 8 pass.

```
CHECKPOINT 1: Open [VERCEL_URL]
  Expected: Leaderboard loads, 5 oracles ranked, Harimau Malaya #1

CHECKPOINT 2: Click "Today's Match"
  Expected: Spain v Saudi Arabia page, 5 oracle pick cards visible

CHECKPOINT 3: Click "Back Harimau Malaya"
  Expected: Privy email modal appears

CHECKPOINT 4: Enter any email address
  Expected: Wallet created silently, transaction processing

CHECKPOINT 5: Transaction completes
  Expected: "✅ FanProof minted!" + explorer link visible
  Click explorer link → transaction exists on devnet

CHECKPOINT 6: Click "🐯 Commit Oracle" in nav
  Expected: Commit page loads, Harimau Malaya prediction displayed

CHECKPOINT 7: Click "⛓️ Commit to Solana"
  Expected: Within 10 seconds: success state with timestamp + explorer link
  Click explorer link → transaction exists, timestamp before kickoff

CHECKPOINT 8: Return to leaderboard
  Expected: Clean, readable, projector-ready
```

If any checkpoint fails: fix it now. Do not proceed.

✓ Print PHASE 9 COMPLETE — ALL CHECKPOINTS PASS when done.

---

## PHASE 10 — SUBMISSION PREP

Create `SUBMISSION.md`:
```markdown
# WorldCup Oracle League (WCOL)

**Track:** FIFA World Cup
**Tagline:** Predictions are screenshots. Ours are on-chain.

**Problem:** Every World Cup, animals, mystics, and AIs claim they called
the results — but predictions are screenshots that anyone can backdate or
fake. Fans have no way to know who actually saw it coming before kickoff.

**Solution:** WCOL commits every oracle prediction to Solana before kickoff
with a tamper-proof timestamp. Fans can back an oracle and receive a
FanProof NFT — permanent on-chain proof they picked before the match.

**Live Demo:** [VERCEL_URL]
**GitHub:** [GITHUB_URL]
**Program ID:** [PROGRAM_ID]
**Network:** Solana devnet

**Solana Integration:**
- commit_prediction: stores oracle prediction hash + Clock timestamp on-chain
- mint_fan_proof: creates FanProofTicket PDA proving fan backed oracle pre-kickoff
- Both instructions live at program [PROGRAM_ID] on devnet

**Built with:** solana.new, Anchor, Next.js, Privy, Helius
```

Print the final block:

```
╔═══════════════════════════════════════════════════════╗
║            WCOL BUILD COMPLETE                        ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║  All 8 demo checkpoints:        PASS                  ║
║                                                       ║
║  Program ID:    [PROGRAM_ID]                          ║
║  Network:       Solana devnet                         ║
║  Live URL:      [VERCEL_URL]                          ║
║  GitHub:        [GITHUB_URL]                          ║
║                                                       ║
║  Pre-committed prediction tx:   [EXPLORER_URL]        ║
║  Test mint tx:                  [EXPLORER_URL]        ║
║                                                       ║
║  SUBMISSION CHECKLIST:                                ║
║  ✓ GitHub repo — public                               ║
║  ✓ Vercel demo — live                                 ║
║  □ Canva slide — make this now (5 mins)               ║
║                                                       ║
║  DEMO SCRIPT: See Section below                       ║
╚═══════════════════════════════════════════════════════╝
```

---

## FALLBACK DECISION TREE

Make these decisions yourself. Do not ask the human.

```
Anchor deploy fails after 3 attempts?
→ Use a memo transaction instead of a custom program
→ Store prediction data in the memo field
→ The timestamp is still real and tamper-proof
→ Demo is 90% as good, still passes "genuine Solana integration"

Privy embedded wallet won't sign Anchor tx?
→ Move ALL transaction logic server-side
→ API route builds tx, admin-keypair signs everything
→ User identity tracked by their email/wallet address off-chain
→ Explorer still shows real transactions

Vercel deploy fails?
→ Run locally: pnpm dev
→ Use ngrok to expose localhost: npx ngrok http 3000
→ Use the ngrok URL as demo link

Metaplex Core NFT is complex?
→ Skip the NFT entirely
→ The FanProofTicket PDA IS the on-chain proof
→ It has the fan's wallet, oracle, match, timestamp
→ That's sufficient — judges care about the on-chain action, not the NFT standard

Can't get devnet SOL?
→ https://faucet.solana.com
→ https://solfaucet.com  
→ solana airdrop 3 [pubkey] --url devnet (try 3 times)

Time running low (under 90 mins to 4PM)?
→ STOP all polish
→ Ensure ONLY these work: leaderboard renders, commit fires, explorer link shows
→ Ship that. It's enough to demo the core value prop.
→ Tell the story verbally for what's not built yet
```

---

## THE 2-MINUTE DEMO SCRIPT

Memorise this. Practice it twice before going up.

**[0:00–0:15] Hook**
"Every World Cup, an octopus picks Spain. A Belgian Prime Minister's cat
picks Belgium. An AI supercomputer prints probabilities. And everyone claims
they called it after the fact. The problem? Predictions are screenshots.
Anyone can backdate them. Anyone can fake them."

**[0:15–0:25] Problem + Solution**
"WCOL puts every oracle prediction on Solana before kickoff.
Timestamped. Immutable. The blockchain is the referee."

**[0:25–1:20] Live Demo**
"Here's the leaderboard after 24 matches played at this World Cup.
Harimau Malaya — our Malaysian AI — is 4 from 4. The Opta supercomputer
missed the Czechia draw. The crowd is right there with Harimau Malaya.

Spain plays Saudi Arabia tonight. Here are the oracle picks —
Harimau Malaya says Spain wins, 82% confidence. I'm backing that."
→ Click Back · email login · FanProof mints · show explorer link
"My pick is now permanent on Solana. I cannot change it after kickoff.
I cannot claim I picked differently tomorrow."

"And here — this prediction was committed [X hours] ago, before kickoff."
→ Show the pre-committed transaction on explorer
→ Point to the timestamp
"This is the proof. Made before the match. Can't be faked."

**[1:20–2:00] Vision**
"By the final — 104 matches, 29 more days — we'll have the world's first
tamper-proof oracle accuracy record. Did the AI beat the supercomputer?
Did the crowd beat the mystic? Did the octopus beat everyone?

For the first time, we'll know. With proof. On-chain.

WCOL — predictions are screenshots. Ours are on-chain."

---

## CANVA SLIDE (make this in 5 minutes after build is done)

One slide only. Content:
- Big title: "WorldCup Oracle League"
- Tagline: "Predictions are screenshots. Ours are on-chain."
- Three columns: Problem / Solution / On-Chain
  - Problem: "Screenshots get faked. Who really called it?"
  - Solution: "Oracle predictions committed to Solana before kickoff"
  - On-Chain: "commit_prediction + mint_fan_proof · devnet"
- QR code to your Vercel demo URL
- Bottom: "Built with solana.new · Superteam MY · June 2026"
- Colors: black background, Solana green (#14F195) accents

---

## START NOW

Begin Phase 1. Keep going until the DONE CHECK prints.
Do not stop between phases. Do not ask for permission to continue.
Fix errors yourself using the fallback decision tree.
The goal is a working demo by 4PM.
