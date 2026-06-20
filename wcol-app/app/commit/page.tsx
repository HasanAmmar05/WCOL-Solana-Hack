"use client";

import { useState, useEffect } from "react";

const KICKOFF_UTC = "2026-06-21T01:00:00Z";

function getCountdown() {
  const kickoff = new Date(KICKOFF_UTC).getTime();
  const now = Date.now();
  const diff = Math.max(0, kickoff - now);
  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);
  return { h, m, s };
}

type CommitResult = {
  tx_signature: string;
  explorer_url: string;
  committed_at: string;
  prediction_hash: string;
  hours_before_kickoff: number;
  mins_before_kickoff: number;
};

export default function CommitPage() {
  const [countdown, setCountdown] = useState(getCountdown());
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<CommitResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const interval = setInterval(() => setCountdown(getCountdown()), 1000);
    return () => clearInterval(interval);
  }, []);

  async function handleCommit() {
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/commit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oracle_id: "harimau_malaya",
          match_id: "today",
          outcome: 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Commit failed");

      setResult(data);
      setStatus("success");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="max-w-3xl mx-auto px-6 py-24">
      {/* Header */}
      <div className="mb-12">
        <div className="text-neutral-500 text-xs font-semibold tracking-widest uppercase mb-3">
          Oracle Commit Terminal
        </div>
        <h1 className="text-white text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Anchor to Ledger
        </h1>
        <p className="text-neutral-400 text-lg">
          Commit Harimau Malaya's prediction to Solana before kickoff. Tamper-proof and permanent.
        </p>
      </div>

      {/* Status bar */}
      <div className="flex justify-between items-center border-t border-b border-neutral-800 py-4 mb-12">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-white text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Devnet Connected
          </div>
        </div>
        <div className="text-neutral-500 text-sm font-mono">
          Kickoff in {countdown.h}h {pad(countdown.m)}m
        </div>
      </div>

      {/* Payload Box / Success State */}
      {status === "success" && result ? (
        <div className="bg-[#0A0A0A] border border-neutral-800 rounded-xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="text-white text-xl font-semibold tracking-tight">
              Anchored to Solana
            </div>
          </div>

          <div className="bg-black border border-neutral-800 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <div className="text-neutral-500 text-xs tracking-wider uppercase font-medium mb-1.5">Oracle</div>
                <div className="text-white text-sm font-medium">Harimau Malaya AI</div>
              </div>
              <div>
                <div className="text-neutral-500 text-xs tracking-wider uppercase font-medium mb-1.5">Prediction</div>
                <div className="text-white text-sm font-medium">Spain wins</div>
              </div>
              <div>
                <div className="text-neutral-500 text-xs tracking-wider uppercase font-medium mb-1.5">Committed</div>
                <div className="text-white text-sm">
                  {new Date(result.committed_at).toLocaleTimeString('en-US', { hour12: false, timeZone: 'Asia/Kuala_Lumpur' })} MYT
                </div>
              </div>
              <div>
                <div className="text-neutral-500 text-xs tracking-wider uppercase font-medium mb-1.5">Kickoff</div>
                <div className="text-white text-sm">01:00 MYT tonight</div>
              </div>
              <div>
                <div className="text-neutral-500 text-xs tracking-wider uppercase font-medium mb-1.5">Made before</div>
                <div className="text-white text-sm">{result.hours_before_kickoff}h {result.mins_before_kickoff}m early</div>
              </div>
              <div>
                <div className="text-neutral-500 text-xs tracking-wider uppercase font-medium mb-1.5">Hash</div>
                <div className="font-mono text-neutral-400 text-xs break-all">
                  {result.prediction_hash}
                </div>
              </div>
            </div>
          </div>

          <a href={result.explorer_url} target="_blank" rel="noreferrer" className="flex items-center justify-center w-full py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-neutral-200 transition-colors gap-2">
            View on Solana Explorer
            <span className="text-[10px]">↗</span>
          </a>
        </div>
      ) : (
        <div>
          <div className="bg-[#0A0A0A] border border-neutral-800 rounded-xl p-8 mb-8">
            <div className="text-neutral-500 text-xs font-semibold tracking-widest uppercase mb-6">
              Payload Preview
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-sm font-medium text-white">
                H
              </div>
              <span className="text-white text-base font-medium">Harimau Malaya AI</span>
            </div>
            
            <div className="text-white text-4xl font-bold tracking-tight mb-4">
              Spain wins
            </div>
            
            <div className="text-neutral-400 text-sm font-medium mb-6">
              82% certainty
            </div>
            
            <div className="bg-black border border-neutral-800 rounded-lg p-5">
              <div className="text-neutral-400 text-sm leading-relaxed font-mono">
                "Spain's squad depth, tactical discipline, and recent form give them a clear edge. Saudi Arabia's compact defensive block may hold for 20 minutes but Spain's pressing will break them down."
              </div>
            </div>
          </div>

          <button 
            className="w-full py-3 bg-white text-black text-base font-medium rounded-xl hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            onClick={handleCommit}
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Transmitting...
              </>
            ) : "Anchor to Solana Ledger"}
          </button>

          {status === "error" && (
            <div className="mt-4 border border-red-900/50 bg-red-900/10 p-4 text-center text-red-400 text-sm font-medium rounded-lg">
              Error: {errorMsg}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
