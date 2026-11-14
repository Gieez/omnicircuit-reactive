import React from "react";
import Link from "next/link";
import { Zap, ExternalLink, ShieldCheck, Github } from "lucide-react";
import { NETWORKS } from "@/lib/constants";

export default function PublicFooter() {
  return (
    <footer className="border-t border-carbon-800 bg-carbon-950 font-mono text-xs text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold tracking-wider">
              <Zap className="h-4 w-4 text-omni-blue" />
              <span>OMNICIRCUIT</span>
            </div>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              Sub-second autonomous circuit breaker for high-velocity DeFi pools on Base Sepolia, powered by Reactive Omni CometBFT consensus.
            </p>
            <div className="text-[10px] text-gray-500">
              Contract Standard: Solidity ^0.8.29 / Omni-Lib
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-gray-300 tracking-wider">Protocol Routes</span>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/" className="hover:text-white transition">Platform Overview</Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-white transition">Architecture Docs & ABI</Link>
              </li>
              <li>
                <Link href="/telemetry" className="hover:text-white transition">Public Telemetry Ledger</Link>
              </li>
              <li>
                <Link href="/app" className="hover:text-white transition">Sentinel Command Center</Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-gray-300 tracking-wider">Networks</span>
            <ul className="space-y-1.5 text-[11px]">
              <li className="flex items-center justify-between">
                <span>Base Sepolia:</span>
                <span className="text-gray-300 font-semibold">200ms blocks</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Reactive Lasna:</span>
                <span className="text-omni-cyan font-semibold">~1s blocks</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Callback Proxy:</span>
                <span className="text-gray-400">0x476F...3585</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Reaction Latency:</span>
                <span className="text-emerald-400 font-bold">1.395s</span>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold text-gray-300 tracking-wider">Hackathon Reference</span>
            <p className="text-[11px] text-gray-400">
              Built for Reactive Omni Buildathon 2026.
              Track: Every Second Counts (Low-Latency DeFi).
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://github.com/Gieez/omnicircuit-reactive"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-gray-300 hover:text-white transition"
              >
                <Github className="h-3.5 w-3.5" />
                <span>GitHub Source</span>
              </a>
              <a
                href="https://dorahacks.io/hackathon/reactive-omni-buildathon"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-400 hover:underline transition"
              >
                <span>DoraHacks</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-carbon-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div>
            OmniCircuit Protocol : Autonomous On-Chain Security
          </div>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>CometBFT Instant Finality Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
