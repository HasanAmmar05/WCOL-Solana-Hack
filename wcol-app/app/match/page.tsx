"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useState, useEffect } from "react";
import Link from "next/link";

import oraclesData from "../../data/oracles.json";
import predictionsData from "../../data/predictions.json";

// Merge base oracle data with today's prediction picks
const oracles = oraclesData.map(o => {
  const pick = (predictionsData.today.oracle_picks as any)[o.id];
  return {
    id: o.id,
    name: o.name,
    type: o.type,
    outcome: pick?.outcome || "unknown",
    confidence: pick?.confidence || 0,
    note: pick?.note || "NO FORECAST SUBMITTED"
  };
});

type BackedState = {
  status: "idle" | "loading" | "success" | "error";
  tx?: string;
  explorerUrl?: string;
  mintedAt?: string;
  errorMsg?: string;
};

export default function MatchPage() {
  const { login, authenticated, user } = usePrivy();
  const [backedOracle, setBackedOracle] = useState<string | null>(null);
  const [backState, setBackState] = useState<BackedState>({ status: "idle" });
  const [pendingOracle, setPendingOracle] = useState<string | null>(null);

  useEffect(() => {
    if (authenticated && pendingOracle) {
      mintFanProof(pendingOracle);
      setPendingOracle(null);
    }
  }, [authenticated, pendingOracle]);

  async function handleBack(oracleId: string) {
    if (!authenticated) {
      setPendingOracle(oracleId);
      login();
      return;
    }
    await mintFanProof(oracleId);
  }

  async function mintFanProof(oracleId: string) {
    setBackedOracle(oracleId);
    setBackState({ status: "loading" });

    try {
      const oracle = oracles.find(o => o.id === oracleId)!;
      const outcomeMap: Record<string, number> = { home_win: 0, draw: 1, away_win: 2 };
      const walletAddress = user?.wallet?.address || "demo_fan_wallet";

      const res = await fetch("/api/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fan_wallet: walletAddress,
          oracle_id: oracleId,
          match_id: "today",
          backed_outcome: outcomeMap[oracle.outcome] ?? 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Minting failed");

      setBackState({
        status: "success",
        tx: data.tx_signature,
        explorerUrl: data.explorer_url,
        mintedAt: data.minted_at,
      });
    } catch (err: unknown) {
      setBackState({ status: "error", errorMsg: err instanceof Error ? err.message : "Unknown error" });
    }
  }

  const formatOutcome = (outcome: string) => {
    if (outcome === "home_win") return "Spain Wins";
    if (outcome === "away_win") return "Saudi Arabia Wins";
    if (outcome === "draw") return "Draw";
    return outcome;
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      {/* Match Header */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-4 text-xs font-medium tracking-wide uppercase text-neutral-500">
          <div className="flex items-center gap-2 text-white">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Live
          </div>
          <span className="text-neutral-800">•</span>
          Group Stage
          <span className="text-neutral-800">•</span>
          01:00 MYT
        </div>
        <h1 className="text-white text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Spain <span className="text-neutral-600 font-normal mx-2">vs</span> Saudi Arabia
        </h1>
        <p className="text-neutral-400 text-lg max-w-2xl">
          Back an oracle before kickoff. Your selection is permanently anchored to Solana.
        </p>
      </div>

      {/* Oracle grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {oracles.map((oracle) => {
          const isBacked = backedOracle === oracle.id && backState.status === "success";
          const isLoading = backedOracle === oracle.id && backState.status === "loading";
          const isDisabled = backState.status === "loading" || (backedOracle !== null && backState.status === "success");
          const isOtherBacked = backedOracle !== null && backedOracle !== oracle.id && backState.status === "success";

          return (
            <div 
              key={oracle.id} 
              className={`bg-[#0A0A0A] border rounded-xl p-6 flex flex-col transition-all duration-300
                ${isBacked ? 'border-neutral-500 shadow-sm shadow-white/5' : 'border-neutral-800 hover:border-neutral-600'} 
                ${isOtherBacked ? "opacity-30 grayscale pointer-events-none" : ""}`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-sm">
                    {oracle.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-base">{oracle.name}</h3>
                    <p className="text-neutral-500 text-xs">{oracle.type}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-neutral-500 text-xs uppercase tracking-widest font-medium mb-2">Prediction</p>
                <div className="text-2xl font-semibold text-white tracking-tight">
                  {formatOutcome(oracle.outcome)}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-neutral-500 text-xs font-medium">Confidence</span>
                  <span className="text-white text-sm font-medium">{oracle.confidence}%</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${oracle.confidence}%` }}></div>
                </div>
              </div>

              <div className="text-sm text-neutral-400 leading-relaxed mb-8 flex-grow">
                "{oracle.note}"
              </div>

              <div className="mt-auto pt-4 border-t border-neutral-800/50">
                {isBacked ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-sm text-white font-medium">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-neutral-400">
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      FanProof Minted
                    </div>
                    <a href={backState.explorerUrl} target="_blank" rel="noreferrer" className="text-neutral-400 text-xs hover:text-white transition-colors flex items-center gap-1">
                      View on Solana Explorer 
                      <span className="text-[10px]">↗</span>
                    </a>
                  </div>
                ) : (
                  <button 
                    className="w-full py-2.5 px-4 bg-white text-black text-sm font-medium rounded-lg hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    onClick={() => handleBack(oracle.id)}
                    disabled={isDisabled}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        Confirming...
                      </>
                    ) : "Back this oracle"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
