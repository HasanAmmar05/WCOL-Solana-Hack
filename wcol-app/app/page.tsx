"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const oracles = [
  { id: "harimau_malaya", name: "Harimau Malaya", type: "AI", region: "Malaysia", accuracy: 4, total: 4 },
  { id: "opus_octopus", name: "Opus Octopus", type: "AI Animal", region: "Global", accuracy: 3, total: 4 },
  { id: "opta_super", name: "Opta Model", type: "Stats Model", region: "Europe", accuracy: 3, total: 4 },
  { id: "polymarket", name: "Polymarket", type: "Prediction Market", region: "Global", accuracy: 4, total: 4 },
  { id: "greenstone", name: "Greenstone Lobo", type: "Mystic", region: "India", accuracy: 2, total: 4 },
];

export default function Leaderboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const ranked = [...oracles]
    .sort((a, b) => {
      const aPct = a.accuracy / a.total;
      const bPct = b.accuracy / b.total;
      if (bPct !== aPct) return bPct - aPct;
      return b.accuracy - a.accuracy;
    })
    .map((o, i) => ({ ...o, rank: i + 1 }));

  return (
    <div className="max-w-5xl mx-auto px-6 py-24">
      {/* Header section */}
      <div className="mb-16">
        <div className="text-neutral-500 text-xs font-semibold tracking-widest uppercase mb-3">
          Season 1
        </div>
        <h1 className="text-white text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Leaderboard
        </h1>
        <p className="text-neutral-400 text-lg max-w-xl">
          Predictions are screenshots. Ours are anchored to Solana. <br className="hidden md:block"/> 4 matches played so far.
        </p>
      </div>

      {/* Table */}
      <div className="border border-neutral-800 rounded-xl overflow-hidden bg-[#0A0A0A]">
        {/* Column headers */}
        <div className="grid grid-cols-12 gap-4 border-b border-neutral-800 bg-neutral-900/30 px-6 py-4 text-xs font-medium text-neutral-500 uppercase tracking-widest">
          <div className="col-span-2 md:col-span-1">#</div>
          <div className="col-span-6 md:col-span-5">Oracle</div>
          <div className="hidden md:block col-span-4">Category</div>
          <div className="col-span-4 md:col-span-2 text-right">Accuracy</div>
        </div>

        <div className="flex flex-col divide-y divide-neutral-800/50">
          {ranked.map((oracle, idx) => {
            const pct = Math.round((oracle.accuracy / oracle.total) * 100);
            const isFirst = idx === 0;
            
            return (
              <div key={oracle.id} className="grid grid-cols-12 gap-4 items-center px-6 py-5 hover:bg-neutral-900/30 transition-colors group">
                
                {/* Rank */}
                <div className="col-span-2 md:col-span-1 text-neutral-500 text-sm font-medium">
                  {oracle.rank}
                </div>
                
                {/* Name & Correct */}
                <div className="col-span-6 md:col-span-5 flex flex-col justify-center">
                  <div className="text-white text-base font-medium flex items-center gap-3">
                    {oracle.name}
                    {isFirst && (
                      <span className="bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                        Leader
                      </span>
                    )}
                  </div>
                  <div className="text-neutral-500 text-sm mt-0.5">
                    {oracle.accuracy}/{oracle.total} correct
                  </div>
                </div>

                {/* Category */}
                <div className="hidden md:flex col-span-4 items-center">
                  <span className="text-neutral-400 text-sm">
                    {oracle.type}
                  </span>
                </div>

                {/* Accuracy */}
                <div className="col-span-4 md:col-span-2 text-right">
                  <div className={`text-base font-semibold ${isFirst ? 'text-white' : 'text-neutral-300'}`}>
                    {pct}%
                  </div>
                </div>
                
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 flex justify-between items-center text-sm">
        <div className="text-neutral-500">
          Built with solana.new
        </div>
        <div className="flex items-center gap-2 text-neutral-400">
          <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full" />
          Devnet Connected
        </div>
      </div>
    </div>
  );
}
