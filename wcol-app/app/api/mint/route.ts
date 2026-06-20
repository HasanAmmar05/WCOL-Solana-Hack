import { NextRequest, NextResponse } from "next/server";
import { Connection, Keypair, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import fs from "fs";
import path from "path";

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
  // Generate deterministic ephemeral keypair for demo
  const seed = Buffer.alloc(32, 42); // demo seed
  return Keypair.fromSeed(seed);
}

function getRPC(): string {
  return process.env.HELIUS_DEVNET_RPC || "https://api.devnet.solana.com";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fan_wallet, oracle_id, match_id, backed_outcome } = body;

    if (!oracle_id || !match_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const cluster =
      (process.env.NEXT_PUBLIC_CLUSTER as
        | "devnet"
        | "testnet"
        | "mainnet-beta") || "devnet";
    const rpcUrl = process.env.NEXT_PUBLIC_RPC || clusterApiUrl(cluster);
    const connection = new Connection(
      process.env.HELIUS_RPC || "https://api.devnet.solana.com",
      "confirmed"
    );
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
    const idl = JSON.parse(fs.readFileSync(
      path.join(process.cwd(), 'data/wcol.json'), 
      'utf8'
    ))

    const PROGRAM_ID = new PublicKey("3tSTD3jLywE8xsAcsR3G1xWowgvJiU5Guxvk3RSEySw8");
    idl.address = PROGRAM_ID.toBase58();
    const provider = new AnchorProvider(connection, wallet, {});
    const program = new Program(idl, provider);

    const [ticketPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("ticket"),
        new PublicKey(fan_wallet || adminKeypair.publicKey).toBuffer(), // If not specified, use admin as dummy
        Buffer.from(oracle_id),
        Buffer.from(match_id),
      ],
      new PublicKey(PROGRAM_ID),
    );

    // Call mintFanProof on-chain (using admin as the payer/signer for the hackathon demo to avoid browser wallet popups)
    const tx = await program.methods
      .mintFanProof(oracle_id, match_id, backed_outcome || 0)
      .accounts({
        ticket: ticketPda,
        fan: adminKeypair.publicKey, // We sign with admin for the demo so it executes server-side seamlessly
      })
      .signers([adminKeypair])
      .rpc();

    const explorerCluster = "devnet";
    const explorerUrl = `https://explorer.solana.com/tx/${tx}?cluster=${explorerCluster}`;
    const mintedAt = new Date().toISOString();

    return NextResponse.json({
      success: true,
      tx_signature: tx,
      explorer_url: explorerUrl,
      minted_at: mintedAt,
      oracle_id,
      match_id,
    });
  } catch (error: unknown) {
    console.error("Mint error:", error);
    const errMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Transaction failed: ${errMsg}` },
      { status: 500 },
    );
  }
}
