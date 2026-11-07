"use client";

import React, { useState } from "react";
import { Play, Flame, Shield, ArrowDownRight, RefreshCw, Zap } from "lucide-react";

interface Props {
  isSimulating: boolean;
  isTripped: boolean;
  onExecuteSwap: (dumpEthAmount: number) => void;
  thresholdBps: number;
}

export default function TriggerSimulator({
  isSimulating,
  isTripped,
  onExecuteSwap,
  thresholdBps,
}: Props) {
  const [customEth, setCustomEth] = useState<number>(35);

  // Approximate price drop calculation given current pool (100 ETH & 300,000 USDC)
  const calculateDrop = (ethIn: number) => {
    const reserveA = 100;
    const reserveB = 300000;
    const oldRatio = reserveB / reserveA;
    const amountOut = (reserveB * ethIn) / (reserveA + ethIn);
    const newRatio = (reserveB - amountOut) / (reserveA + ethIn);
    const dropBps = ((oldRatio - newRatio) / oldRatio) * 10000;
    return Math.max(0, Math.round(dropBps));
  };

  const currentDropBps = calculateDrop(customEth);
  const willTrip = currentDropBps >= thresholdBps;

  return (
    <div className="bg-carbon-900 border border-carbon-700 rounded-lg p-5 shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-carbon-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-carbon-800 border border-carbon-700 text-amber-400">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-bold text-white tracking-wide">
              EXECUTION TRIGGER CONSOLE
            </h3>
            <p className="text-[11px] font-mono text-gray-400">
              Inject Simulated Flash-Dumps to Test Reactive Omni Sub-Second Loop
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono uppercase bg-carbon-800 px-2 py-0.5 rounded text-gray-400 border border-carbon-700">
          Interactive Lab
        </span>
      </div>

      {/* Quick Presets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-xs">
        {/* Preset 1: Normal Swap */}
        <button
          onClick={() => {
            setCustomEth(1);
            onExecuteSwap(1);
          }}
          disabled={isSimulating || isTripped}
          className="p-3 rounded border border-carbon-700 bg-carbon-950 hover:bg-carbon-800/80 disabled:opacity-50 text-left transition flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between w-full mb-1">
            <span className="font-bold text-gray-200">Normal Trade</span>
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">
              0.3% Drop
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mb-2">1.0 ETH Swap. Stays well under safety threshold.</p>
          <span className="text-[10px] text-omni-blue group-hover:underline flex items-center gap-1 font-semibold">
            Test Safe Trade →
          </span>
        </button>

        {/* Preset 2: Moderate Slip */}
        <button
          onClick={() => {
            setCustomEth(8);
            onExecuteSwap(8);
          }}
          disabled={isSimulating || isTripped}
          className="p-3 rounded border border-carbon-700 bg-carbon-950 hover:bg-carbon-800/80 disabled:opacity-50 text-left transition flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between w-full mb-1">
            <span className="font-bold text-gray-200">Market Volatility</span>
            <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-1.5 py-0.5 rounded">
              2.4% Drop
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mb-2">8.0 ETH Swap. Monitored, but sub-threshold.</p>
          <span className="text-[10px] text-amber-400 group-hover:underline flex items-center gap-1 font-semibold">
            Test Volatility →
          </span>
        </button>

        {/* Preset 3: Flash Crash Attack */}
        <button
          onClick={() => {
            setCustomEth(35);
            onExecuteSwap(35);
          }}
          disabled={isSimulating || isTripped}
          className="p-3 rounded border border-red-500/40 bg-red-950/20 hover:bg-red-950/40 disabled:opacity-50 text-left transition flex flex-col justify-between group relative overflow-hidden"
        >
          <div className="flex items-center justify-between w-full mb-1">
            <span className="font-bold text-red-200 flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 text-red-400" />
              Flash Attack
            </span>
            <span className="text-[10px] text-red-300 font-bold bg-red-500/20 px-1.5 py-0.5 rounded border border-red-500/30">
              7.8% Drop
            </span>
          </div>
          <p className="text-[11px] text-red-200/80 mb-2">35.0 ETH Dump. Breaches 3% limit. Fires sub-second circuit!</p>
          <span className="text-[10px] text-red-400 group-hover:underline flex items-center gap-1 font-bold">
            Simulate Breach Attack →
          </span>
        </button>
      </div>

      {/* Custom Slider Console */}
      <div className="bg-carbon-950 border border-carbon-800 rounded p-4 font-mono">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-gray-400">CUSTOM SWAP VOLUME:</span>
          <span className="text-white font-bold tabular-nums">
            {customEth.toFixed(1)} ETH (~${(customEth * 3000).toLocaleString()})
          </span>
        </div>

        <input
          type="range"
          min="1"
          max="50"
          step="1"
          value={customEth}
          onChange={(e) => setCustomEth(parseFloat(e.target.value))}
          disabled={isSimulating || isTripped}
          className="w-full accent-blue-500 h-1.5 bg-carbon-800 rounded-lg cursor-pointer disabled:opacity-50"
        />

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-carbon-800/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-[11px]">CALCULATED DROP:</span>
            <span
              className={`font-bold tabular-nums ${
                willTrip ? "text-red-400" : "text-emerald-400"
              }`}
            >
              {(currentDropBps / 100).toFixed(2)}% ({currentDropBps} bps)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-[11px]">CIRCUIT ACTION:</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                willTrip
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              }`}
            >
              {willTrip ? "TRIGGER BREAKER (<1.5s)" : "IGNORE / NORMAL"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Fire Action Button */}
      <button
        onClick={() => onExecuteSwap(customEth)}
        disabled={isSimulating || isTripped}
        className={`w-full py-3 px-4 rounded font-mono font-bold text-sm tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-lg ${
          isTripped
            ? "bg-carbon-800 text-gray-500 cursor-not-allowed border border-carbon-700"
            : willTrip
            ? "bg-red-600 hover:bg-red-500 text-white shadow-red-900/30 border border-red-400"
            : "bg-omni-blue hover:bg-blue-600 text-white shadow-blue-900/30 border border-blue-400"
        }`}
      >
        {isSimulating ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>DISPATCHING EVENT LOOP THROUGH REACTIVE OMNI...</span>
          </>
        ) : isTripped ? (
          <>
            <Shield className="h-4 w-4" />
            <span>CIRCUIT ALREADY TRIPPED (RESET TO RE-TEST)</span>
          </>
        ) : (
          <>
            <Play className="h-4 w-4 fill-current" />
            <span>FIRE SWAP & BENCHMARK LATENCY LOOP</span>
          </>
        )}
      </button>
    </div>
  );
}
