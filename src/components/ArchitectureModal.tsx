"use client";

import React from "react";
import { X, Layers, ShieldCheck, Zap, ArrowRight, ExternalLink } from "lucide-react";
import { NETWORKS } from "@/lib/constants";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ArchitectureModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-carbon-900 border border-carbon-700 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 font-mono text-xs flex flex-col gap-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-carbon-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-carbon-800 border border-carbon-700 text-omni-blue">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">
                OMNICIRCUIT ARCHITECTURE & CONTRACT TOPOLOGY
              </h2>
              <p className="text-[11px] text-gray-400">
                End-to-End Cryptographic Loop under Reactive Omni Engine
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded bg-carbon-800 hover:bg-carbon-700 text-gray-400 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Visual Architecture Diagram */}
        <div className="bg-carbon-950 border border-carbon-800 rounded p-4 text-[11px] leading-relaxed">
          <div className="text-gray-400 font-semibold mb-3 uppercase tracking-wider text-[10px]">
            DATA & EXECUTION FLOW:
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-center">
            {/* Box 1 */}
            <div className="flex-1 bg-carbon-900 border border-blue-500/40 rounded p-3 text-left">
              <span className="text-[9px] text-blue-400 uppercase font-bold block mb-1">
                BASE SEPOLIA (ORIGIN)
              </span>
              <div className="font-bold text-white text-xs mb-1">OriginPool.sol</div>
              <p className="text-[10px] text-gray-400">
                Executes DEX swaps. If price drop ≥ 300 bps (3%), emits <code className="text-blue-300">EmergencyAnomalyDetected</code>.
              </p>
            </div>

            <div className="hidden sm:flex text-gray-500 items-center justify-center">
              <ArrowRight className="h-4 w-4 text-omni-blue" />
            </div>

            {/* Box 2 */}
            <div className="flex-1 bg-carbon-900 border border-purple-500/40 rounded p-3 text-left">
              <span className="text-[9px] text-purple-400 uppercase font-bold block mb-1">
                REACTIVE LASNA (OMNI)
              </span>
              <div className="font-bold text-white text-xs mb-1">OmniCircuitReactive.sol</div>
              <p className="text-[10px] text-gray-400">
                Subscribed to anomaly topic. Runs <code className="text-purple-300">react()</code> in ~1s CometBFT block. Calls <code className="text-purple-300">SYSTEM.requestCallbackV_1_0()</code>.
              </p>
            </div>

            <div className="hidden sm:flex text-gray-500 items-center justify-center">
              <ArrowRight className="h-4 w-4 text-emerald-400" />
            </div>

            {/* Box 3 */}
            <div className="flex-1 bg-carbon-900 border border-emerald-500/40 rounded p-3 text-left">
              <span className="text-[9px] text-emerald-400 uppercase font-bold block mb-1">
                BASE SEPOLIA (DESTINATION)
              </span>
              <div className="font-bold text-white text-xs mb-1">OmniCircuitCallback.sol</div>
              <p className="text-[10px] text-gray-400">
                Verified through Base Callback Proxy. Authenticates sender & freezes <code className="text-emerald-300">OriginPool</code> in 200ms.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Contract Details Accordion */}
        <div className="space-y-3">
          {/* Contract 1 */}
          <div className="border border-carbon-800 rounded p-3 bg-carbon-950/60">
            <div className="flex items-center justify-between font-bold text-gray-200 mb-1">
              <span className="text-blue-400">1. OriginPool.sol (Solidity ^0.8.29)</span>
              <span className="text-[10px] text-gray-500">Base Sepolia #84532</span>
            </div>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              DEX liquidity pool holding asset reserves with constant-product math ($x \cdot y = k$). Emits real-time swap logs. When a large dump is detected, emits the high-priority event that Reactive Omni is subscribed to.
            </p>
          </div>

          {/* Contract 2 */}
          <div className="border border-carbon-800 rounded p-3 bg-carbon-950/60">
            <div className="flex items-center justify-between font-bold text-gray-200 mb-1">
              <span className="text-purple-400">2. OmniCircuitReactive.sol (Solidity ^0.8.29)</span>
              <span className="text-[10px] text-gray-500">Reactive Lasna #5318007</span>
            </div>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              Inherits <code className="text-gray-300">AbstractReactive</code>. Subscribed to event topic at the network level. When the event occurs on Base Sepolia, the Reactive node executes <code className="text-gray-300">react()</code> and immediately requests an authenticated callback to the destination chain.
            </p>
          </div>

          {/* Contract 3 */}
          <div className="border border-carbon-800 rounded p-3 bg-carbon-950/60">
            <div className="flex items-center justify-between font-bold text-gray-200 mb-1">
              <span className="text-emerald-400">3. OmniCircuitCallback.sol (Solidity ^0.8.29)</span>
              <span className="text-[10px] text-gray-500">Base Sepolia #84532</span>
            </div>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              Inherits <code className="text-gray-300">AbstractCallback</code>. Receives the emergency callback from the Reactive Callback Proxy (<code className="text-gray-300">{NETWORKS.BASE_SEPOLIA.callbackProxy}</code>). Verifies the origin sender and instantly locks the pool.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-carbon-800 pt-3 flex items-center justify-between text-gray-400 text-[11px]">
          <span>Track 1: Every Second Counts (Low-Latency DeFi)</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded bg-carbon-800 hover:bg-carbon-700 text-white font-semibold transition"
          >
            Close Specs
          </button>
        </div>
      </div>
    </div>
  );
}
