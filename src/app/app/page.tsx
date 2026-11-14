"use client";

import React, { useState } from "react";
import PoolTelemetryCard from "@/components/PoolTelemetryCard";
import TriggerSimulator from "@/components/TriggerSimulator";
import LatencyWaterfall from "@/components/LatencyWaterfall";
import VerifiedAuditTable from "@/components/VerifiedAuditTable";
import { INITIAL_LOGS, TelemetryLog } from "@/lib/constants";
import { ShieldCheck, ShieldAlert, Zap, AlertTriangle, Play, RefreshCw, Layers } from "lucide-react";

export default function AppDashboardPage() {
  const [reserveA, setReserveA] = useState(100);
  const [reserveB, setReserveB] = useState(300000);
  const [isTripped, setIsTripped] = useState(false);
  const [thresholdBps, setThresholdBps] = useState(300);
  const [lastTripBps, setLastTripBps] = useState<number | null>(null);
  const [lastTripTime, setLastTripTime] = useState<string | null>(null);

  const [isSimulating, setIsSimulating] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [stage, setStage] = useState(0);
  const [logs, setLogs] = useState<TelemetryLog[]>(INITIAL_LOGS);

  const handleReset = () => {
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

    if (dropBps < thresholdBps) {
      const normalLog: TelemetryLog = {
        id: "swap-" + Date.now(),
        type: "SWAP",
        chain: "Base Sepolia (84532)",
        txHash: "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
        blockNumber: 22849102 + Math.floor(Math.random() * 50),
        deltaMs: 0,
        details: `Swap: ${dumpEth.toFixed(1)} ETH for ${amountOut.toFixed(0)} USDC (-${(dropBps / 100).toFixed(2)}% drop)`,
        timestamp: timeStr,
      };
      setLogs((prev) => [normalLog, ...prev]);
      return;
    }

    setIsSimulating(true);
    setStage(1);
    setElapsedMs(0);

    const start = Date.now();
    const interval = setInterval(() => {
      setElapsedMs(Date.now() - start);
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
      details: `Breach detected: ${dumpEth.toFixed(1)} ETH dump caused -${(dropBps / 100).toFixed(2)}% drop > ${thresholdBps} bps`,
      timestamp: timeStr,
    };
    setLogs((prev) => [log1, ...prev]);

    setTimeout(() => {
      setStage(2);
      const log2: TelemetryLog = {
        id: "react-" + Date.now(),
        type: "REACTIVE_DISPATCH",
        chain: "Reactive Lasna (5318007)",
        txHash: reactiveTxHash,
        blockNumber: 894120,
        deltaMs: 914,
        details: "react() processed in CometBFT block. requestCallbackV_1_0() dispatched",
        timestamp: new Date().toTimeString().split(" ")[0] + "." + String(new Date().getMilliseconds()).padStart(3, "0"),
      };
      setLogs((prev) => [log2, ...prev]);
    }, 914);

    setTimeout(() => {
      clearInterval(interval);
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
    <div className="space-y-6">
      {/* Title & Quick Status Bar */}
      <div className="bg-carbon-900 border border-carbon-800 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-white tracking-wide uppercase font-mono">
            COMMAND CENTER : REAL-TIME DEFENSE GRID
          </h1>
          <p className="text-gray-400 text-xs font-sans mt-0.5">
            Active monitoring on Base Sepolia AMM Vault with sub-second Reactive Omni loop.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 rounded border text-xs font-mono font-bold flex items-center gap-2 ${
            isTripped 
              ? "bg-red-500/15 border-red-500/50 text-red-400 animate-pulse" 
              : "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
          }`}>
            {isTripped ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
            <span>{isTripped ? "CIRCUIT TRIPPED & FROZEN" : "SENTINEL ARMED & LISTENING"}</span>
          </div>

          {isTripped && (
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded bg-carbon-800 hover:bg-carbon-700 border border-carbon-600 text-white font-semibold text-xs"
            >
              Reset Circuit
            </button>
          )}
        </div>
      </div>

      {/* Grid: 5:7 split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Pool Telemetry & Trigger simulator */}
        <div className="lg:col-span-5 space-y-6">
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

        {/* Right Column: Latency Waterfall & Audit Table */}
        <div className="lg:col-span-7 space-y-6">
          <LatencyWaterfall
            elapsedMs={elapsedMs}
            stage={stage}
            isSimulating={isSimulating}
          />

          <VerifiedAuditTable logs={logs} />
        </div>
      </div>
    </div>
  );
}
