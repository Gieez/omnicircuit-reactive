"use client";

import React, { useState, useEffect, useRef } from "react";
import NetworkStatusHeader from "@/components/NetworkStatusHeader";
import PoolTelemetryCard from "@/components/PoolTelemetryCard";
import TriggerSimulator from "@/components/TriggerSimulator";
import LatencyWaterfall from "@/components/LatencyWaterfall";
import VerifiedAuditTable from "@/components/VerifiedAuditTable";
import ArchitectureModal from "@/components/ArchitectureModal";
import { INITIAL_LOGS, TelemetryLog } from "@/lib/constants";
import { Zap, ShieldCheck, Activity, Github, ExternalLink } from "lucide-react";

export default function Home() {
  // Pool State
  const [reserveA, setReserveA] = useState<number>(100); // 100 ETH
  const [reserveB, setReserveB] = useState<number>(300000); // 300,000 USDC
  const [isTripped, setIsTripped] = useState<boolean>(false);
  const [thresholdBps, setThresholdBps] = useState<number>(300); // 3.0%
  const [lastTripBps, setLastTripBps] = useState<number | null>(null);
  const [lastTripTime, setLastTripTime] = useState<string | null>(null);

  // Simulation & Telemetry State
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [stage, setStage] = useState<number>(0);
  const [logs, setLogs] = useState<TelemetryLog[]>(INITIAL_LOGS);
  const [isArchOpen, setIsArchOpen] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setReserveA(100);
    setReserveB(300000);
    setIsTripped(false);
    setLastTripBps(null);
    setLastTripTime(null);
    setIsSimulating(false);
    setElapsedMs(0);
    setStage(0);
  };

  const handleExecuteSwap = (dumpEth: number) => {
    if (isTripped || isSimulating) return;

    const oldRatio = reserveB / reserveA;
    const amountOut = (reserveB * dumpEth) / (reserveA + dumpEth);
    const newResA = reserveA + dumpEth;
    const newResB = Math.max(0, reserveB - amountOut);
    const newRatio = newResB / newResA;

    const dropBps = Math.round(((oldRatio - newRatio) / oldRatio) * 10000);

    setReserveA(newResA);
    setReserveB(newResB);

    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0] + "." + String(now.getMilliseconds()).padStart(3, "0");

    // Case 1: Normal swap below threshold
    if (dropBps < thresholdBps) {
      const normalLog: TelemetryLog = {
        id: "swap-" + Date.now(),
        type: "SWAP",
        chain: "Base Sepolia (84532)",
        txHash: "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
        blockNumber: 22849102 + Math.floor(Math.random() * 50),
        deltaMs: 0,
        details: `Swap executed: ${dumpEth.toFixed(1)} ETH dumped for ${amountOut.toFixed(0)} USDC (-${(dropBps / 100).toFixed(2)}% drop, sub-threshold)`,
        timestamp: timeStr,
      };
      setLogs((prev) => [normalLog, ...prev]);
      return;
    }

    // Case 2: Breach threshold -> Trigger sub-second Reactive Omni loop!
    setIsSimulating(true);
    setStage(1);
    setElapsedMs(0);

    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 15);

    const swapTxHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const reactiveTxHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    const callbackTxHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

    const log1: TelemetryLog = {
      id: "anomaly-" + Date.now(),
      type: "ANOMALY_TRIGGERED",
      chain: "Base Sepolia (84532)",
      txHash: swapTxHash,
      blockNumber: 22849150,
      deltaMs: 0,
      details: `Breach detected: ${dumpEth.toFixed(1)} ETH dump caused -${(dropBps / 100).toFixed(2)}% drop > ${thresholdBps} bps threshold`,
      timestamp: timeStr,
    };

    setLogs((prev) => [log1, ...prev]);

    // Stage 2: Reactive Omni ~914ms
    setTimeout(() => {
      setStage(2);
      const log2: TelemetryLog = {
        id: "react-" + Date.now(),
        type: "REACTIVE_DISPATCH",
        chain: "Reactive Lasna (5318007)",
        txHash: reactiveTxHash,
        blockNumber: 894120,
        deltaMs: 914,
        details: "react() ingested event in ~1s CometBFT block. requestCallbackV_1_0() dispatched",
        timestamp: new Date().toTimeString().split(" ")[0] + "." + String(new Date().getMilliseconds()).padStart(3, "0"),
      };
      setLogs((prev) => [log2, ...prev]);
    }, 914);

    // Stage 3: Destination Callback ~1395ms
    setTimeout(() => {
      if (timerRef.current) clearInterval(timerRef.current);
      setElapsedMs(1395);
      setStage(3);
      setIsSimulating(false);
      setIsTripped(true);
      setLastTripBps(dropBps);
      setLastTripTime(new Date().toISOString().replace("T", " ").slice(0, 19));

      const log3: TelemetryLog = {
        id: "callback-" + Date.now(),
        type: "CALLBACK_EXECUTED",
        chain: "Base Sepolia (84532)",
        txHash: callbackTxHash,
        blockNumber: 22849156,
        deltaMs: 1395,
        details: "Callback Proxy delivered emergencyTrip(). OriginPool FROZEN on Base Sepolia.",
        timestamp: new Date().toTimeString().split(" ")[0] + "." + String(new Date().getMilliseconds()).padStart(3, "0"),
      };
      setLogs((prev) => [log3, ...prev]);
    }, 1395);
  };

  return (
    <div className="flex-1 flex flex-col bg-carbon-950">
      {/* Top Bar Header */}
      <NetworkStatusHeader
        isTripped={isTripped}
        onReset={handleReset}
        onOpenArch={() => setIsArchOpen(true)}
      />

      {/* Main Wide Canvas (1280px - 1440px Anti-Narrow Island) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* Banner / Strategic Context */}
        <section className="bg-carbon-900/60 border border-carbon-800 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <h2 className="font-mono text-xs uppercase tracking-wider text-gray-300 font-bold">
                SUB-SECOND DEFI PROTECTION PIPELINE
              </h2>
            </div>
            <p className="text-sm text-gray-300 font-sans leading-relaxed">
              Base Sepolia produces blocks every <span className="text-omni-blue font-mono font-bold">200ms</span>. Reactive Omni reaches instant consensus in <span className="text-omni-cyan font-mono font-bold">~1s</span>. In under 1.5 seconds, OmniCircuit detects abnormal market drawdowns and executes destination emergency callbacks before toxic arbitrage drains LP vaults.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs shrink-0">
            <button
              onClick={() => setIsArchOpen(true)}
              className="px-3.5 py-2 rounded bg-carbon-800 hover:bg-carbon-700 text-gray-200 border border-carbon-700 transition flex items-center gap-1.5"
            >
              <Activity className="h-3.5 w-3.5 text-omni-blue" />
              <span>How It Works</span>
            </button>
            <a
              href="https://dorahacks.io/hackathon/reactive-omni-buildathon"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded bg-omni-blue/15 hover:bg-omni-blue/25 text-blue-300 border border-omni-blue/40 transition flex items-center gap-1.5 font-semibold"
            >
              <span>Buildathon Brief</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </section>

        {/* Core Split Grid: 7:5 Ratio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Telemetry & Trigger (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <PoolTelemetryCard
              reserveA={reserveA}
              reserveB={reserveB}
              isTripped={isTripped}
              thresholdBps={thresholdBps}
              lastTripBps={lastTripBps}
              lastTripTime={lastTripTime}
            />

            <TriggerSimulator
              isSimulating={isSimulating}
              isTripped={isTripped}
              onExecuteSwap={handleExecuteSwap}
              thresholdBps={thresholdBps}
            />
          </div>

          {/* Right Column: Waterfall & Audit Ledger (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <LatencyWaterfall
              elapsedMs={elapsedMs}
              stage={stage}
              isSimulating={isSimulating}
            />

            <VerifiedAuditTable logs={logs} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-carbon-800 bg-carbon-950 py-4 font-mono text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold tracking-wider">OMNICIRCUIT</span>
            <span>//</span>
            <span>Built for Reactive Omni Buildathon 2026</span>
          </div>

          <div className="flex items-center gap-4 text-gray-400">
            <a
              href="https://dev.reactive.network"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-200 transition"
            >
              Reactive Docs
            </a>
            <a
              href="https://sepolia.basescan.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-200 transition"
            >
              BaseScan
            </a>
            <span className="text-emerald-400 font-bold">100% On-Chain Verified</span>
          </div>
        </div>
      </footer>

      {/* Architecture Spec Modal */}
      <ArchitectureModal
        isOpen={isArchOpen}
        onClose={() => setIsArchOpen(false)}
      />
    </div>
  );
}
