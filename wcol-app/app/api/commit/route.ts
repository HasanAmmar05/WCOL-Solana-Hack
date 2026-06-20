import { NextRequest, NextResponse } from "next/server";
import { Connection, Keypair, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { createHash } from "crypto";

// Use relative path to workspace root
import idl from "../../../data/wcol.json";

const PROGRAM_ID = process.env.NEXT_PUBLIC_PROGRAM_ID || "PLACEHOLDER";

const PREDICTION_TEXT =
  "Spain's squad depth, tactical discipline, and recent form give them a clear edge. " +
  "Saudi Arabia's compact defensive block may hold for 20 minutes but Spain's pressing " +
  "will break them down. Prediction: Spain wins. Confidence: 82%.";

function getAdminKeypair(): Keypair {
  const secret = process.env.ADMIN_KEYPAIR_SECRET;
  if (secret) {
    try {
      const arr = JSON.parse(secret);
      return Keypair.fromSecretKey(Uint8Array.from(arr));
    } catch {
      // fall through
    }
  }
  // Demo seed
  const seed = Buffer.alloc(32, 42);
  return Keypair.fromSeed(seed);
}

function getRPC(): string {
  return process.env.HELIUS_DEVNET_RPC || "https://api.devnet.solana.com";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      oracle_id = "harimau_malaya",
      match_id = "today",
      outcome = 0,
    } = body;

    const cluster =
      (process.env.NEXT_PUBLIC_CLUSTER as
        | "devnet"
        | "testnet"
        | "mainnet-beta") || "devnet";
    const rpcUrl = process.env.NEXT_PUBLIC_RPC || clusterApiUrl(cluster);
    const connection = new Connection(rpcUrl, "confirmed");
    const adminKeypair = getAdminKeypair();
    const wallet = {
      publicKey: adminKeypair.publicKey,
      signTransaction: async (tx: any) => {
        tx.partialSign(adminKeypair);
        return tx;
      },
      signAllTransactions: async (txs: any[]) => {
        txs.forEach((tx) => tx.partialSign(adminKeypair));
        return txs;
      },
    };

    // Anchor setup
    const provider = new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
    });
    const program = new Program(idl as any, provider);

    // Generate sha256 hash of prediction text
    const hash = createHash("sha256").update(PREDICTION_TEXT).digest();
    const hashArray = Array.from(hash);

    const [predPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("pred"), Buffer.from(oracle_id), Buffer.from(match_id)],
      new PublicKey(PROGRAM_ID),
    );

    // Call commitPrediction on-chain
    const tx = await program.methods
      .commitPrediction(oracle_id, match_id, outcome, hashArray)
      .accounts({
        prediction: predPda,
        committer: adminKeypair.publicKey,
      })
      .signers([adminKeypair])
      .rpc();

    const explorerCluster = "devnet";
    const explorerUrl = `https://explorer.solana.com/tx/${tx}?cluster=${explorerCluster}`;
    const now = new Date();
    const committedAt = now.toISOString();

    // Time until kickoff
    const kickoff = new Date("2026-06-21T01:00:00Z");
    const msUntilKickoff = kickoff.getTime() - now.getTime();
    const hoursUntilKickoff = Math.floor(msUntilKickoff / (1000 * 60 * 60));
    const minsUntilKickoff = Math.floor(
      (msUntilKickoff % (1000 * 60 * 60)) / (1000 * 60),
    );

    return NextResponse.json({
      success: true,
      tx_signature: tx,
      explorer_url: explorerUrl,
      committed_at: committedAt,
      prediction_hash: hash.toString("hex"),
      hours_before_kickoff: hoursUntilKickoff,
      mins_before_kickoff: minsUntilKickoff,
      oracle_id,
      match_id,
    });
  } catch (error: unknown) {
    console.error("Commit error:", error);
    const errMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Commit failed: ${errMsg}` },
      { status: 500 },
    );
  }
}
