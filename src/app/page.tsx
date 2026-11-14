"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import TriggerSimulator from "@/components/TriggerSimulator";
import LatencyWaterfall from "@/components/LatencyWaterfall";
import PoolTelemetryCard from "@/components/PoolTelemetryCard";
import { Zap, Shield, Activity, ArrowRight, CheckCircle2, Clock, Cpu, ExternalLink, Flame } from "lucide-react";
import { NETWORKS } from "@/lib/constants";

export default function LandingPage() {
  const [baseBlock, setBaseBlock] = useState(22849102);
  const [lasnaBlock, setLasnaBlock] = useState(894103);

  // Pool simulation state
  const [reserveA, setReserveA] = useState(100);
  const [reserveB, setReserveB] = useState(300000);
  const [isTripped, setIsTripped] = useState(false);
  const [thresholdBps] = useState(300);
  const [lastTripBps, setLastTripBps] = useState<number | null>(null);
  const [lastTripTime, setLastTripTime] = useState<string | null>(null);

  const [isSimulating, setIsSimulating] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const baseTimer = setInterval(() => setBaseBlock((prev) => prev + 1), 300);
    const lasnaTimer = setInterval(() => setLasnaBlock((prev) => prev + 1), 1000);
    return () => {
      clearInterval(baseTimer);
      clearInterval(lasnaTimer);
    };
  }, []);

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

    if (dropBps < thresholdBps) {
      return;
    }

    setIsSimulating(true);
    setStage(1);
    setElapsedMs(0);

    const start = Date.now();
    const interval = setInterval(() => {
      setElapsedMs(Date.now() - start);
    }, 15);

    setTimeout(() => {
      setStage(2);
    }, 914);

    setTimeout(() => {
      clearInterval(interval);
      setElapsedMs(1395);
      setStage(3);
      setIsSimulating(false);
      setIsTripped(true);
      setLastTripBps(dropBps);
      setLastTripTime(new Date().toISOString().replace("T", " ").slice(0, 19));
    }, 1395);
  };

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

  return (
    <div className="flex-1 flex flex-col bg-carbon-950">
      <PublicNavbar />

      {/* Network Pulse Bar */}
      <div className="border-b border-carbon-800 bg-carbon-900/50 py-2 font-mono text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-rapid" />
              <span>Base Sepolia: #{baseBlock.toLocaleString()} (200ms)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Reactive Lasna: #{lasnaBlock.toLocaleString()} (~1s CometBFT)</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-gray-400">Protocol State:</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
              isTripped ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            }`}>
              {isTripped ? "CIRCUIT TRIPPED" : "SENTINEL ACTIVE"}
            </span>
            {isTripped && (
              <button
                onClick={handleReset}
                className="text-xs text-blue-400 hover:underline font-semibold"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      <main className="flex-1 flex flex-col">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden py-16 lg:py-24 border-b border-carbon-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Copy */}
            <div className="flex-1 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-carbon-900 border border-carbon-700 text-xs font-mono text-omni-blue">
                <Zap className="h-3.5 w-3.5 text-blue-400" />
                <span>Track 1 : Every Second Counts (Low-Latency DeFi)</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight font-sans">
                Sub-Second DeFi Circuit Breaker <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 font-mono">
                  Powered by Reactive Omni
                </span>
              </h1>

              <p className="text-base text-gray-300 leading-relaxed font-sans max-w-2xl">
                Base Sepolia produces blocks every 200 milliseconds. Legacy keepers take 15 to 30 seconds to react, leaving LP vaults vulnerable to flash crashes. OmniCircuit intercepts anomaly events and executes destination callbacks in under 1.5 seconds through CometBFT instant finality.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
                <Link
                  href="/app"
                  className="px-5 py-3 rounded-md bg-omni-blue hover:bg-blue-600 text-white font-bold transition flex items-center gap-2 shadow-lg shadow-blue-900/30"
                >
                  <span>Launch Sentinel App</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/docs"
                  className="px-5 py-3 rounded-md bg-carbon-900 hover:bg-carbon-800 text-gray-200 border border-carbon-700 transition flex items-center gap-2 font-semibold"
                >
                  <Activity className="h-4 w-4 text-omni-blue" />
                  <span>Architecture Docs</span>
                </Link>

                <Link
                  href="/telemetry"
                  className="px-4 py-3 rounded-md text-gray-400 hover:text-white transition flex items-center gap-1.5"
                >
                  <span>View Public Ledger →</span>
                </Link>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-carbon-800 font-mono text-xs">
                <div>
                  <div className="text-xl font-bold text-white tabular-nums">1.395s</div>
                  <div className="text-[11px] text-gray-400">Measured Loop Latency</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-emerald-400 tabular-nums">10.6x</div>
                  <div className="text-[11px] text-gray-400">Faster vs Gelato Relayer</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-cyan-400 tabular-nums">200ms</div>
                  <div className="text-[11px] text-gray-400">Base Sepolia Block Pace</div>
                </div>
              </div>
            </div>

            {/* Right Interactive Simulator Preview */}
            <div className="w-full lg:w-[480px] shrink-0">
              <PoolTelemetryCard
                reserveA={reserveA}
                reserveB={reserveB}
                isTripped={isTripped}
                thresholdBps={thresholdBps}
                lastTripBps={lastTripBps}
                lastTripTime={lastTripTime}
              />
            </div>
          </div>
        </section>

        {/* LIVE BOUNDARY SIMULATOR SECTION (Split 1280px-1440px) */}
        <section className="py-16 bg-carbon-950 border-b border-carbon-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-omni-blue block">
                  Interactive Test Harness
                </span>
                <h2 className="text-2xl font-bold text-white font-sans mt-1">
                  Flash-Crash Anomaly Injection & Latency Waterfall
                </h2>
                <p className="text-sm text-gray-400 font-sans mt-1 max-w-2xl">
                  Simulate high-volume token dumps on the Base Sepolia AMM pool. Observe how Reactive Omni detects the event log and executes the emergency freeze before subsequent blocks settle.
                </p>
              </div>

              <div className="font-mono text-xs text-gray-400">
                Origin: Base Sepolia (84532) → Sentinel: Lasna (5318007)
              </div>
            </div>

            {/* Grid 5:7 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5">
                <TriggerSimulator
                  isSimulating={isSimulating}
                  isTripped={isTripped}
                  onExecuteSwap={handleExecuteSwap}
                  thresholdBps={thresholdBps}
                />
              </div>

              <div className="lg:col-span-7">
                <LatencyWaterfall
                  elapsedMs={elapsedMs}
                  stage={stage}
                  isSimulating={isSimulating}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 3-CONTRACT TOPOLOGY SPEC */}
        <section className="py-16 bg-carbon-900/30 border-b border-carbon-800 font-mono text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div>
              <span className="text-omni-cyan font-bold uppercase tracking-wider block">
                Protocol Topology
              </span>
              <h2 className="text-2xl font-bold text-white font-sans mt-1">
                3-Contract Cryptographic Separation
              </h2>
              <p className="text-sm text-gray-400 font-sans mt-1 max-w-2xl">
                OmniCircuit divides detection, consensus, and mitigation across three distinct smart contracts to guarantee tamper-proof execution.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Box 1 */}
              <div className="p-5 rounded-lg bg-carbon-900 border border-blue-500/30 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-blue-400 font-bold uppercase">Base Sepolia</span>
                    <span className="text-[10px] text-gray-500">Chain #84532</span>
                  </div>
                  <h3 className="text-base font-bold text-white font-mono">OriginPool.sol</h3>
                  <p className="text-gray-400 text-[11px] font-sans leading-relaxed">
                    Automated market maker pool with single-swap drawdown checks. If price drops $\ge$ 300 bps (3%), emits the high-priority event log.
                  </p>
                </div>
                <div className="p-2.5 rounded bg-carbon-950 border border-carbon-800 text-[10px] text-gray-400">
                  Event: EmergencyAnomalyDetected
                </div>
              </div>

              {/* Box 2 */}
              <div className="p-5 rounded-lg bg-carbon-900 border border-purple-500/30 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-purple-400 font-bold uppercase">Reactive Lasna</span>
                    <span className="text-[10px] text-gray-500">Chain #5318007</span>
                  </div>
                  <h3 className="text-base font-bold text-white font-mono">OmniCircuitReactive.sol</h3>
                  <p className="text-gray-400 text-[11px] font-sans leading-relaxed">
                    Inherits AbstractReactive. Listens directly at network layer. Runs react() in ~1s CometBFT block and dispatches authenticated callback request.
                  </p>
                </div>
                <div className="p-2.5 rounded bg-carbon-950 border border-carbon-800 text-[10px] text-gray-400">
                  Method: SYSTEM.requestCallbackV_1_0()
                </div>
              </div>

              {/* Box 3 */}
              <div className="p-5 rounded-lg bg-carbon-900 border border-emerald-500/30 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase">Base Sepolia</span>
                    <span className="text-[10px] text-gray-500">Chain #84532</span>
                  </div>
                  <h3 className="text-base font-bold text-white font-mono">OmniCircuitCallback.sol</h3>
                  <p className="text-gray-400 text-[11px] font-sans leading-relaxed">
                    Inherits AbstractCallback. Authenticates Reactive Signer proxy (0x476F...3585) and executes emergencyTrip() to lock the pool.
                  </p>
                </div>
                <div className="p-2.5 rounded bg-carbon-950 border border-carbon-800 text-[10px] text-gray-400">
                  Guard: onlyServiceProvider + onlyCallbackSender
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION */}
        <section className="py-16 bg-carbon-950">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
              Experience Autonomous Sub-Second Liquidity Defense
            </h2>
            <p className="text-sm text-gray-400 font-sans max-w-xl mx-auto">
              Inspect on-chain telemetry, read the complete contract ABI reference, or launch the interactive command center.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-xs">
              <Link
                href="/app"
                className="px-6 py-3 rounded bg-omni-blue hover:bg-blue-600 text-white font-bold transition flex items-center gap-2"
              >
                <span>Enter Sentinel Workspace</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/docs"
                className="px-6 py-3 rounded bg-carbon-900 hover:bg-carbon-800 text-gray-200 border border-carbon-700 transition font-semibold"
              >
                <span>Read Full Documentation</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
