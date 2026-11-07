"use client";

import React from "react";
import { ShieldCheck, ShieldAlert, AlertTriangle, ArrowUpDown, Lock, Unlock, ExternalLink } from "lucide-react";
import { CONTRACT_ADDRESSES, NETWORKS } from "@/lib/constants";

interface Props {
  reserveA: number;
  reserveB: number;
  isTripped: boolean;
  thresholdBps: number;
  lastTripBps: number | null;
  lastTripTime: string | null;
}

export default function PoolTelemetryCard({
  reserveA,
  reserveB,
  isTripped,
  thresholdBps,
  lastTripBps,
  lastTripTime,
}: Props) {
  const spotPrice = reserveB / reserveA;
  const totalLiquidityUsd = reserveA * spotPrice + reserveB;

  return (
    <div className="bg-carbon-900 border border-carbon-700 rounded-lg p-5 shadow-xl flex flex-col gap-4">
      {/* Title & Badge */}
      <div className="flex items-center justify-between border-b border-carbon-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-carbon-800 border border-carbon-700 text-omni-blue">
            <ArrowUpDown className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-bold text-white tracking-wide">
              BASE SEPOLIA ETH/USDC VOLATILE VAULT
            </h3>
            <p className="text-[11px] font-mono text-gray-400">
              Target Origin Pool (Chain ID 84532)
            </p>
          </div>
        </div>

        {/* Status Pill */}
        <div
          className={`px-3 py-1 rounded text-xs font-mono font-bold flex items-center gap-1.5 border transition-all ${
            isTripped
              ? "bg-red-500/15 border-red-500/50 text-red-400 animate-pulse"
              : "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
          }`}
        >
          {isTripped ? (
            <>
              <ShieldAlert className="h-3.5 w-3.5 text-red-400" />
              <span>CIRCUIT FROZEN</span>
            </>
          ) : (
            <>
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>ACTIVE SENTINEL</span>
            </>
          )}
        </div>
      </div>

      {/* Reserves & Spot Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        {/* Reserve ETH */}
        <div className="bg-carbon-950 border border-carbon-800 rounded p-3">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block">RESERVE ASSET A</span>
          <span className="text-lg font-bold text-gray-100 tabular-nums">
            {reserveA.toFixed(2)} <span className="text-xs text-omni-blue">ETH</span>
          </span>
          <span className="text-[10px] text-gray-500 block">Base Native Asset</span>
        </div>

        {/* Reserve USDC */}
        <div className="bg-carbon-950 border border-carbon-800 rounded p-3">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block">RESERVE ASSET B</span>
          <span className="text-lg font-bold text-gray-100 tabular-nums">
            ${reserveB.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
          <span className="text-[10px] text-gray-500 block">USDC Stable Reserve</span>
        </div>

        {/* Spot Price */}
        <div className="bg-carbon-950 border border-carbon-800 rounded p-3">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block">IMPLIED SPOT PRICE</span>
          <span className="text-lg font-bold text-omni-cyan tabular-nums">
            ${spotPrice.toFixed(2)}
          </span>
          <span className="text-[10px] text-gray-500 block">TVL ~${(totalLiquidityUsd / 1000).toFixed(0)}k</span>
        </div>

        {/* Circuit Threshold */}
        <div className="bg-carbon-950 border border-carbon-800 rounded p-3">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider block">CIRCUIT SENSITIVITY</span>
          <span className="text-lg font-bold text-amber-400 tabular-nums">
            {(thresholdBps / 100).toFixed(1)}% <span className="text-xs text-gray-400">({thresholdBps} bps)</span>
          </span>
          <span className="text-[10px] text-gray-500 block">Max 1-Block Delta</span>
        </div>
      </div>

      {/* Emergency Alert Banner when Tripped */}
      {isTripped && (
        <div className="bg-red-950/40 border border-red-500/40 rounded p-3.5 flex items-start gap-3 text-red-200 text-xs font-mono">
          <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <div className="font-bold text-red-300 uppercase tracking-wider">
              Emergency Circuit Breaker Triggered & Confirmed
            </div>
            <p className="text-red-300/90 text-[11px] leading-relaxed">
              Price drop of <span className="font-bold underline">{(lastTripBps || 784) / 100}%</span> exceeded the safety threshold of {(thresholdBps / 100).toFixed(1)}%. Reactive Omni intercepted the event in ~0.9s and executed the destination callback on Base Sepolia. All withdrawals & dumping are locked.
            </p>
            {lastTripTime && (
              <span className="text-[10px] text-red-400/80 block">
                Tripped at: {lastTripTime} UTC
              </span>
            )}
          </div>
        </div>
      )}

      {/* Contract Addresses Specs */}
      <div className="pt-2 border-t border-carbon-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-gray-400 gap-2">
        <div className="flex items-center gap-1.5 truncate">
          <span className="text-gray-500">Origin Contract:</span>
          <a
            href={`${NETWORKS.BASE_SEPOLIA.explorer}/address/${CONTRACT_ADDRESSES.ORIGIN_POOL}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-omni-blue transition flex items-center gap-1 truncate"
          >
            <span>{CONTRACT_ADDRESSES.ORIGIN_POOL.slice(0, 8)}...{CONTRACT_ADDRESSES.ORIGIN_POOL.slice(-6)}</span>
            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        </div>

        <div className="flex items-center gap-1.5 truncate">
          <span className="text-gray-500">Reactive Sentinel:</span>
          <a
            href={`${NETWORKS.REACTIVE_LASNA.explorer}/address/${CONTRACT_ADDRESSES.OMNI_REACTIVE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-emerald-400 transition flex items-center gap-1 truncate"
          >
            <span>{CONTRACT_ADDRESSES.OMNI_REACTIVE.slice(0, 8)}...{CONTRACT_ADDRESSES.OMNI_REACTIVE.slice(-6)}</span>
            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        </div>
      </div>
    </div>
  );
}
