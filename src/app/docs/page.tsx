"use client";

import React, { useState, useEffect } from "react";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import { BookOpen, Shield, Code, Cpu, Layers, Lock, Copy, Check, ExternalLink } from "lucide-react";
import { NETWORKS, CONTRACT_ADDRESSES } from "@/lib/constants";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const sections = [
    { id: "overview", label: "1. Executive Overview" },
    { id: "topology", label: "2. 3-Contract Topology" },
    { id: "engine", label: "3. Reactive Omni CometBFT" },
    { id: "proxy", label: "4. Callback Proxy Protocol" },
    { id: "abi", label: "5. ABI & Contract Specs" },
    { id: "security", label: "6. Security & Threat Model" },
  ];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col bg-carbon-950">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interactive Sticky Sidebar (3 cols) */}
          <aside className="lg:col-span-3 sticky top-24 bg-carbon-900 border border-carbon-800 rounded-lg p-4 font-mono text-xs space-y-4">
            <div className="flex items-center gap-2 text-white font-bold pb-2 border-b border-carbon-800">
              <BookOpen className="h-4 w-4 text-omni-blue" />
              <span>TECHNICAL REFERENCE</span>
            </div>

            <nav className="space-y-1">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveSection(s.id);
                    const el = document.getElementById(s.id);
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`w-full text-left px-3 py-2 rounded transition flex items-center justify-between ${
                    activeSection === s.id
                      ? "bg-omni-blue/15 text-blue-300 font-bold border border-omni-blue/30"
                      : "text-gray-400 hover:text-gray-200 hover:bg-carbon-800"
                  }`}
                >
                  <span>{s.label}</span>
                </button>
              ))}
            </nav>

            <div className="pt-3 border-t border-carbon-800 text-[11px] text-gray-500 space-y-1.5">
              <div>Ecosystem: Reactive Omni</div>
              <div>Origin: Base Sepolia (84532)</div>
              <div>Sentinel: Lasna (5318007)</div>
            </div>
          </aside>

          {/* Main Content Area (9 cols) */}
          <article className="lg:col-span-9 space-y-12 font-sans text-sm text-gray-300 leading-relaxed">
            {/* SECTION 1 */}
            <section id="overview" className="space-y-4 scroll-mt-28">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-carbon-900 border border-carbon-800 text-xs font-mono text-omni-blue">
                <span>SECTION 01</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white font-mono">
                Executive Overview : Sub-Second Defense
              </h1>
              <p>
                Decentralized exchanges operating on modern Layer 2 rollups produce blocks at speeds under one second. Specifically, Base Sepolia processes blocks every 200 milliseconds following the Denim network upgrade. While this enables high transaction throughput, it leaves liquidity pools vulnerable to multi-block toxic extraction when off-chain keeper networks lag behind.
              </p>
              <div className="bg-carbon-900 border border-carbon-800 rounded-lg p-4 font-mono text-xs space-y-2">
                <div className="text-white font-bold">Latency Benchmark Comparison:</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-carbon-950 p-3 rounded border border-emerald-500/30">
                    <span className="text-[10px] text-emerald-400 uppercase font-bold block">OmniCircuit Loop</span>
                    <span className="text-xl font-bold text-white tabular-nums">~1.395s</span>
                    <p className="text-[11px] text-gray-400 mt-1">Reactive Omni + Base Sepolia</p>
                  </div>
                  <div className="bg-carbon-950 p-3 rounded border border-carbon-800">
                    <span className="text-[10px] text-amber-400 uppercase font-bold block">Off-Chain Relayers</span>
                    <span className="text-xl font-bold text-gray-200 tabular-nums">~14.800s</span>
                    <p className="text-[11px] text-gray-400 mt-1">Mempool queue + cron delay</p>
                  </div>
                  <div className="bg-carbon-950 p-3 rounded border border-carbon-800">
                    <span className="text-[10px] text-red-400 uppercase font-bold block">Chainlink Automation</span>
                    <span className="text-xl font-bold text-gray-200 tabular-nums">~28.500s</span>
                    <p className="text-[11px] text-gray-400 mt-1">Multi-block OCR consensus</p>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 2 */}
            <section id="topology" className="space-y-4 scroll-mt-28 border-t border-carbon-800 pt-8">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-carbon-900 border border-carbon-800 text-xs font-mono text-omni-cyan">
                <span>SECTION 02</span>
              </div>
              <h2 className="text-2xl font-bold text-white font-mono">
                3-Contract Cryptographic Separation
              </h2>
              <p>
                To avoid single-point failure modes, OmniCircuit separates responsibilities across three autonomous smart contracts:
              </p>

              <div className="space-y-4 font-mono text-xs">
                <div className="bg-carbon-900 border border-carbon-800 rounded p-4">
                  <div className="flex items-center justify-between text-blue-400 font-bold mb-1">
                    <span>1. OriginPool.sol (Origin Chain: Base Sepolia)</span>
                    <span>Chain ID: 84532</span>
                  </div>
                  <p className="text-gray-300 font-sans text-xs">
                    Maintains asset reserves $x$ and $y$. When a swap occurs, single-block price impact is calculated. If the drawdown exceeds <code>thresholdBps</code> (default: 300 bps / 3.0%), the contract emits:
                  </p>
                  <pre className="mt-2 p-2.5 bg-carbon-950 rounded text-gray-300 overflow-x-auto">
{`event EmergencyAnomalyDetected(
    address indexed pool,
    uint256 priceDropBps,
    uint256 currentReserveA,
    uint256 currentReserveB,
    uint256 timestamp
);`}
                  </pre>
                </div>

                <div className="bg-carbon-900 border border-carbon-800 rounded p-4">
                  <div className="flex items-center justify-between text-purple-400 font-bold mb-1">
                    <span>2. OmniCircuitReactive.sol (Sentinel Chain: Reactive Lasna)</span>
                    <span>Chain ID: 5318007</span>
                  </div>
                  <p className="text-gray-300 font-sans text-xs">
                    Inherits <code>AbstractReactive</code>. Subscribed directly to <code>EmergencyAnomalyDetected</code>. Executes <code>react(LogRecord memory log_)</code> inside the next 1-second CometBFT block. Invokes <code>SYSTEM.requestCallbackV_1_0()</code> targeting the destination contract.
                  </p>
                </div>

                <div className="bg-carbon-900 border border-carbon-800 rounded p-4">
                  <div className="flex items-center justify-between text-emerald-400 font-bold mb-1">
                    <span>3. OmniCircuitCallback.sol (Destination Chain: Base Sepolia)</span>
                    <span>Chain ID: 84532</span>
                  </div>
                  <p className="text-gray-300 font-sans text-xs">
                    Inherits <code>AbstractCallback</code>. Verifies caller authentication via <code>onlyServiceProvider</code> and <code>onlyCallbackSender</code>. Invokes <code>originPool.tripCircuitBreaker()</code> to freeze withdrawals and swaps.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 3 */}
            <section id="engine" className="space-y-4 scroll-mt-28 border-t border-carbon-800 pt-8">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-carbon-900 border border-carbon-800 text-xs font-mono text-purple-400">
                <span>SECTION 03</span>
              </div>
              <h2 className="text-2xl font-bold text-white font-mono">
                Reactive Omni CometBFT Consensus
              </h2>
              <p>
                Previous iterations of Reactive Network operated on ~7-second block times. Reactive Omni replaces this architecture with a CometBFT consensus engine:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs">
                <li>
                  <strong className="text-white">Block Time:</strong> Reduced from ~7 seconds to ~1 second.
                </li>
                <li>
                  <strong className="text-white">Instant Finality:</strong> Blocks are finalized upon validator quorum without waiting for probabilistic confirmation windows.
                </li>
                <li>
                  <strong className="text-white">Event Ingestion:</strong> Reactive validators ingest origin EVM logs directly into consensus, eliminating off-chain relayer discrepancies.
                </li>
              </ul>
            </section>

            {/* SECTION 4 */}
            <section id="proxy" className="space-y-4 scroll-mt-28 border-t border-carbon-800 pt-8">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-carbon-900 border border-carbon-800 text-xs font-mono text-emerald-400">
                <span>SECTION 04</span>
              </div>
              <h2 className="text-2xl font-bold text-white font-mono">
                Callback Proxy Authentication Protocol
              </h2>
              <p>
                Destination contracts never trust unauthenticated external callers. The Reactive Signer posts callback transactions through the official Callback Proxy:
              </p>

              <div className="bg-carbon-900 border border-carbon-800 rounded p-4 font-mono text-xs space-y-3">
                <div className="text-gray-300 font-bold">Base Sepolia Callback Proxy:</div>
                <div className="flex items-center justify-between p-2 rounded bg-carbon-950 border border-carbon-800 text-blue-300">
                  <span>{NETWORKS.BASE_SEPOLIA.callbackProxy}</span>
                  <button
                    onClick={() => handleCopy(NETWORKS.BASE_SEPOLIA.callbackProxy, "proxy")}
                    className="text-gray-400 hover:text-white"
                  >
                    {copiedKey === "proxy" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>

                <div className="text-gray-400 text-[11px] leading-relaxed font-sans">
                  Rule: The proxy replaces the first 160 bits (address) of the callback payload with the address of the reactive contract that requested the execution. The destination function must declare <code>address reactiveSender_</code> as its first parameter.
                </div>
              </div>
            </section>

            {/* SECTION 5 */}
            <section id="abi" className="space-y-4 scroll-mt-28 border-t border-carbon-800 pt-8">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-carbon-900 border border-carbon-800 text-xs font-mono text-amber-400">
                <span>SECTION 05</span>
              </div>
              <h2 className="text-2xl font-bold text-white font-mono">
                ABI & Contract Interface Specifications
              </h2>

              <div className="space-y-4 font-mono text-xs">
                {/* Method 1 */}
                <div className="bg-carbon-900 border border-carbon-800 rounded p-4 space-y-2">
                  <div className="text-white font-bold">OriginPool::swap(bool isBuyA, uint256 amountIn)</div>
                  <p className="text-gray-400 font-sans text-xs">
                    Executes spot swap. Emits EmergencyAnomalyDetected if price drop exceeds thresholdBps.
                  </p>
                </div>

                {/* Method 2 */}
                <div className="bg-carbon-900 border border-carbon-800 rounded p-4 space-y-2">
                  <div className="text-white font-bold">OmniCircuitReactive::react(LogRecord memory log_)</div>
                  <p className="text-gray-400 font-sans text-xs">
                    Invoked by SYSTEM (0x8888...8888). Decodes anomaly parameters and issues requestCallbackV_1_0.
                  </p>
                </div>

                {/* Method 3 */}
                <div className="bg-carbon-900 border border-carbon-800 rounded p-4 space-y-2">
                  <div className="text-white font-bold">OmniCircuitCallback::emergencyTrip(address reactiveSender_, uint256 priceDropBps_, uint256 originBlock_)</div>
                  <p className="text-gray-400 font-sans text-xs">
                    Restricted callback method. Verifies sender and calls OriginPool::tripCircuitBreaker().
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 6 */}
            <section id="security" className="space-y-4 scroll-mt-28 border-t border-carbon-800 pt-8">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-carbon-900 border border-carbon-800 text-xs font-mono text-red-400">
                <span>SECTION 06</span>
              </div>
              <h2 className="text-2xl font-bold text-white font-mono">
                Security & Threat Model
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                <div className="p-4 rounded bg-carbon-900 border border-carbon-800 space-y-1.5">
                  <span className="text-white font-bold">Replay Attack Prevention</span>
                  <p className="text-gray-400 font-sans text-xs">
                    Each emergency callback carries the unique origin block number and event transaction hash. Duplicate deliveries are discarded.
                  </p>
                </div>

                <div className="p-4 rounded bg-carbon-900 border border-carbon-800 space-y-1.5">
                  <span className="text-white font-bold">Gas Starvation Mitigation</span>
                  <p className="text-gray-400 font-sans text-xs">
                    Destination contracts maintain pre-funded gas reserves in the callback proxy to prevent out-of-gas reverts during peak volatility.
                  </p>
                </div>

                <div className="p-4 rounded bg-carbon-900 border border-carbon-800 space-y-1.5">
                  <span className="text-white font-bold">Spoofing Immunity</span>
                  <p className="text-gray-400 font-sans text-xs">
                    The destination function enforces both onlyServiceProvider and onlyCallbackSender modifiers. Arbitrary externally owned accounts cannot trigger circuit activation.
                  </p>
                </div>

                <div className="p-4 rounded bg-carbon-900 border border-carbon-800 space-y-1.5">
                  <span className="text-white font-bold">Manual Governance Override</span>
                  <p className="text-gray-400 font-sans text-xs">
                    The pool owner retains an emergency reset function to unfreeze liquidity once market conditions stabilize.
                  </p>
                </div>
              </div>
            </section>
          </article>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
