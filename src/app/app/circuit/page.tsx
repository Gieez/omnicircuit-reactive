"use client";

import React, { useState } from "react";
import { ShieldAlert, ShieldCheck, AlertTriangle, Zap, Fuel, RefreshCw, Lock, Unlock, ExternalLink } from "lucide-react";
import { CONTRACT_ADDRESSES, NETWORKS } from "@/lib/constants";

export default function CircuitBreakerPage() {
  const [isTripped, setIsTripped] = useState<boolean>(false);
  const [gasProxyEth, setGasProxyEth] = useState<number>(0.050);
  const [gasLasnaReact, setGasLasnaReact] = useState<number>(0.500);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [lastAction, setLastAction] = useState<string>("Sentinel armed. No emergency breaches recorded.");

  const handleManualTrip = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsTripped(true);
      setIsProcessing(false);
      setLastAction("Manual emergency override tripped by operator. OriginPool FROZEN.");
    }, 600);
  };

  const handleResetCircuit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsTripped(false);
      setIsProcessing(false);
      setLastAction("Circuit breaker reset confirmed by pool owner. Normal trading resumed.");
    }, 600);
  };

  const handleTopUpGas = () => {
    setGasProxyEth((prev) => parseFloat((prev + 0.05).toFixed(3)));
    setGasLasnaReact((prev) => parseFloat((prev + 0.5).toFixed(3)));
    setLastAction("Gas reserves topped up: +0.05 ETH on Base Sepolia Proxy, +0.5 REACT on Lasna.");
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Header */}
      <div className="bg-carbon-900 border border-carbon-800 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-carbon-800 border border-carbon-700 text-red-400">
              <ShieldAlert className="h-4 w-4" />
            </span>
            <h1 className="text-base font-bold text-white tracking-wide uppercase">
              EMERGENCY CIRCUIT BREAKER & GAS TANK
            </h1>
          </div>
          <p className="text-gray-400 text-xs font-sans mt-1">
            Manual emergency trip controls, destination execution locks, and callback proxy pre-paid gas reserves.
          </p>
        </div>

        <div className={`px-3 py-1.5 rounded border font-bold flex items-center gap-2 self-start sm:self-auto ${
          isTripped
            ? "bg-red-500/15 border-red-500/50 text-red-400 animate-pulse"
            : "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
        }`}>
          {isTripped ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
          <span>{isTripped ? "CIRCUIT FROZEN (TRIPPED)" : "CIRCUIT ARMED & READY"}</span>
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Manual Action Controls (6 cols) */}
        <div className="lg:col-span-6 bg-carbon-900 border border-carbon-800 rounded-lg p-5 space-y-5">
          <div className="border-b border-carbon-800 pb-3 flex items-center justify-between">
            <span className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              Manual Operator Controls
            </span>
            <span className="text-[10px] text-gray-500">Multisig / Direct Call</span>
          </div>

          <div className="p-4 rounded bg-carbon-950 border border-carbon-800 space-y-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-gray-200">Emergency Manual Stop</span>
                <p className="text-gray-400 text-[11px] font-sans leading-relaxed">
                  Triggers immediate call to <code>tripCircuitBreaker()</code> on Base Sepolia. Use this in black-swan depeg scenarios where external oracles or cross-chain events require immediate liquidity lockup.
                </p>
              </div>
            </div>

            {isTripped ? (
              <button
                onClick={handleResetCircuit}
                disabled={isProcessing}
                className="w-full py-3 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold transition flex items-center justify-center gap-2"
              >
                {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Unlock className="h-4 w-4" />}
                <span>RESET CIRCUIT & RESUME POOL</span>
              </button>
            ) : (
              <button
                onClick={handleManualTrip}
                disabled={isProcessing}
                className="w-full py-3 rounded bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-red-900/30"
              >
                {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ShieldAlert className="h-4 w-4" />}
                <span>EMERGENCY TRIP : HALT ALL SWAPS</span>
              </button>
            )}
          </div>

          {/* Activity Banner */}
          <div className="p-3 bg-carbon-950 border border-carbon-800 rounded text-[11px] text-gray-400 flex items-center justify-between">
            <span className="text-gray-500 uppercase text-[10px]">Recent Signal:</span>
            <span className="text-gray-200 truncate">{lastAction}</span>
          </div>
        </div>

        {/* Right Column: Callback Proxy Gas Tank (6 cols) */}
        <div className="lg:col-span-6 bg-carbon-900 border border-carbon-800 rounded-lg p-5 space-y-5">
          <div className="border-b border-carbon-800 pb-3 flex items-center justify-between">
            <span className="font-bold text-white uppercase tracking-wider text-xs flex items-center gap-2">
              <Fuel className="h-4 w-4 text-omni-blue" />
              Pre-Paid Gas Tank Reserves
            </span>
            <button
              onClick={handleTopUpGas}
              className="text-[10px] text-omni-blue hover:underline font-bold"
            >
              + Deposit Gas
            </button>
          </div>

          <div className="space-y-3">
            {/* Base Sepolia Proxy Gas */}
            <div className="p-3.5 rounded bg-carbon-950 border border-carbon-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 uppercase block">Base Sepolia Callback Proxy</span>
                <span className="text-base font-bold text-white tabular-nums">
                  {gasProxyEth.toFixed(3)} <span className="text-xs text-blue-400">ETH</span>
                </span>
                <span className="text-[10px] text-gray-500 block">Covers ~100 emergency callbacks</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                ADEQUATE
              </span>
            </div>

            {/* Reactive Lasna Payer Gas */}
            <div className="p-3.5 rounded bg-carbon-950 border border-carbon-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 uppercase block">Reactive Lasna Payer Balance</span>
                <span className="text-base font-bold text-white tabular-nums">
                  {gasLasnaReact.toFixed(3)} <span className="text-xs text-omni-cyan">REACT</span>
                </span>
                <span className="text-[10px] text-gray-500 block">Pays validator react() gas</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
          </div>

          {/* Proxy Address Reference */}
          <div className="p-3 bg-carbon-950 border border-carbon-800 rounded text-[11px] space-y-1">
            <div className="flex justify-between text-gray-400">
              <span>Base Callback Proxy:</span>
              <a
                href={`${NETWORKS.BASE_SEPOLIA.explorer}/address/${NETWORKS.BASE_SEPOLIA.callbackProxy}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-omni-blue flex items-center gap-1"
              >
                <span>{NETWORKS.BASE_SEPOLIA.callbackProxy.slice(0, 10)}...{NETWORKS.BASE_SEPOLIA.callbackProxy.slice(-6)}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Lasna System Contract:</span>
              <span className="text-gray-300">0x8888888888888888888888888888888888888888</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
