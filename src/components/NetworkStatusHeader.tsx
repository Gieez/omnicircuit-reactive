"use client";

import React, { useEffect, useState } from "react";
import { Shield, Radio, Activity, Zap, ExternalLink } from "lucide-react";
import { NETWORKS } from "@/lib/constants";

interface Props {
  isTripped: boolean;
  onReset: () => void;
  onOpenArch: () => void;
}

export default function NetworkStatusHeader({ isTripped, onReset, onOpenArch }: Props) {
  const [baseBlock, setBaseBlock] = useState(22849102);
  const [lasnaBlock, setLasnaBlock] = useState(894103);

  // Simulate realistic block cadence: Base Sepolia updates every ~200-400ms, Lasna every ~1s
  useEffect(() => {
    const baseInterval = setInterval(() => {
      setBaseBlock((prev) => prev + 1);
    }, 400);

    const lasnaInterval = setInterval(() => {
      setLasnaBlock((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(baseInterval);
      clearInterval(lasnaInterval);
    };
  }, []);

  return (
    <header className="border-b border-carbon-700 bg-carbon-900/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Logo & Project Identity */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded bg-carbon-800 border border-carbon-600 flex items-center justify-center text-omni-blue shadow-inner">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold tracking-wider text-base text-white">
                  OMNICIRCUIT
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-omni-blue/15 text-omni-blue border border-omni-blue/30 uppercase">
                  Reactive Omni
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-carbon-800 text-gray-400 border border-carbon-700">
                  Track 1: Every Second Counts
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono tracking-tight">
                Autonomous Sub-Second DeFi Circuit Breaker & Liquidity Sentinel
              </p>
            </div>
          </div>

          {/* Real-time Block Tickers & State */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-mono">
            {/* Base Sepolia Ticker */}
            <div className="bg-carbon-800/80 border border-carbon-700 rounded px-2.5 py-1.5 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-rapid" />
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 leading-none">BASE SEPOLIA (200ms)</span>
                <span className="font-bold text-gray-200 tabular-nums">#{baseBlock.toLocaleString()}</span>
              </div>
            </div>

            {/* Reactive Lasna Ticker */}
            <div className="bg-carbon-800/80 border border-carbon-700 rounded px-2.5 py-1.5 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" style={{ animationDuration: '2s' }} />
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 leading-none">REACTIVE LASNA (~1s)</span>
                <span className="font-bold text-gray-200 tabular-nums">#{lasnaBlock.toLocaleString()}</span>
              </div>
            </div>

            {/* Defense Status Beacon */}
            <div className={`border rounded px-3 py-1.5 flex items-center gap-2 transition-colors ${
              isTripped 
                ? "bg-omni-crimson/15 border-omni-crimson/50 text-omni-crimson" 
                : "bg-omni-emerald/15 border-omni-emerald/40 text-omni-emerald"
            }`}>
              <Shield className="h-3.5 w-3.5" />
              <span className="font-bold uppercase tracking-wider text-[11px]">
                {isTripped ? "CIRCUIT TRIPPED" : "SENTINEL ARMED"}
              </span>
            </div>

            {/* Action buttons */}
            <button
              onClick={onOpenArch}
              className="px-2.5 py-1.5 rounded border border-carbon-600 bg-carbon-800 hover:bg-carbon-700 text-gray-300 hover:text-white transition flex items-center gap-1.5 text-xs"
              title="Inspect 3-Contract Reactive Architecture"
            >
              <Activity className="h-3 w-3 text-omni-blue" />
              <span>Specs</span>
            </button>

            {isTripped && (
              <button
                onClick={onReset}
                className="px-2.5 py-1.5 rounded border border-omni-blue/40 bg-omni-blue/20 hover:bg-omni-blue/30 text-blue-200 transition text-xs font-semibold"
              >
                Reset Circuit
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
