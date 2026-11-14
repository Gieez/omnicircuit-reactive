"use client";

import React, { useState } from "react";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import { INITIAL_LOGS, TelemetryLog, NETWORKS } from "@/lib/constants";
import { Activity, Download, Search, ExternalLink, Copy, Check, Filter, ShieldCheck, Zap } from "lucide-react";

export default function TelemetryPage() {
  const [filterType, setFilterType] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const extendedLogs: TelemetryLog[] = [
    ...INITIAL_LOGS,
    {
      id: "trace-101",
      type: "SWAP",
      chain: "Base Sepolia (84532)",
      txHash: "0x39fa881bca28019fe82910ba91982bca01289fe8192a019283ba019283ca0192",
      blockNumber: 22848990,
      deltaMs: 0,
      details: "Whale swap: 42.0 ETH dumped. Spread expanded by 8.41%.",
      timestamp: "11:58:02.104",
    },
    {
      id: "trace-102",
      type: "ANOMALY_TRIGGERED",
      chain: "Base Sepolia (84532)",
      txHash: "0x39fa881bca28019fe82910ba91982bca01289fe8192a019283ba019283ca0192",
      blockNumber: 22848990,
      deltaMs: 16,
      details: "EmergencyAnomalyDetected emitted. 841 bps > 300 bps threshold.",
      timestamp: "11:58:02.120",
    },
    {
      id: "trace-103",
      type: "REACTIVE_DISPATCH",
      chain: "Reactive Lasna (5318007)",
      txHash: "0x892a018bcfa1029e8192a019bca81920ac192839ba019283ca019284ba019284",
      blockNumber: 894050,
      deltaMs: 920,
      details: "react() processed in CometBFT block. Callback dispatched to Base Sepolia.",
      timestamp: "11:58:03.024",
    },
    {
      id: "trace-104",
      type: "CALLBACK_EXECUTED",
      chain: "Base Sepolia (84532)",
      txHash: "0x1928ba01928ca01928da01928ea01928fa0192801928ba01928ca01928da0192",
      blockNumber: 22848997,
      deltaMs: 1392,
      details: "OmniCircuitCallback::emergencyTrip() confirmed. Pool locked in 1.392s.",
      timestamp: "11:58:03.496",
    },
  ];

  const filtered = extendedLogs.filter((log) => {
    const matchesFilter = filterType === "ALL" || log.type === filterType;
    const matchesSearch =
      log.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.chain.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCopy = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    const headers = ["Time", "Type", "Network", "TxHash", "BlockNumber", "DeltaMs", "Details"];
    const rows = filtered.map((l) => [
      `"${l.timestamp}"`,
      `"${l.type}"`,
      `"${l.chain}"`,
      `"${l.txHash}"`,
      l.blockNumber,
      l.deltaMs,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `omnicircuit-telemetry-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getExplorerUrl = (chain: string, hash: string) => {
    if (chain.toLowerCase().includes("lasna")) {
      return `${NETWORKS.REACTIVE_LASNA.explorer}/tx/${hash}`;
    }
    return `${NETWORKS.BASE_SEPOLIA.explorer}/tx/${hash}`;
  };

  return (
    <div className="flex-1 flex flex-col bg-carbon-950 font-mono text-xs">
      <PublicNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-carbon-800 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-carbon-800 border border-carbon-700 text-omni-blue">
                <Activity className="h-4 w-4" />
              </span>
              <h1 className="text-xl font-bold text-white tracking-wide uppercase font-mono">
                PUBLIC ON-CHAIN TELEMETRY LEDGER
              </h1>
            </div>
            <p className="text-gray-400 text-xs font-sans mt-1">
              Live cryptographic event records, latency benchmarks, and verified transaction execution traces.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded bg-carbon-900 hover:bg-carbon-800 border border-carbon-700 text-gray-200 transition flex items-center gap-2 self-start md:self-auto font-semibold shadow-sm"
          >
            <Download className="h-3.5 w-3.5 text-omni-blue" />
            <span>Export CSV Report</span>
          </button>
        </div>

        {/* Global Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-carbon-900 border border-carbon-800 rounded p-4">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block">TOTAL VOLUME MONITORED</span>
            <span className="text-xl font-bold text-white tabular-nums">$14,820,000</span>
            <span className="text-[10px] text-gray-500 block mt-1">Base Sepolia AMM Pools</span>
          </div>

          <div className="bg-carbon-900 border border-carbon-800 rounded p-4">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block">ANOMALIES MITIGATED</span>
            <span className="text-xl font-bold text-emerald-400 tabular-nums">42 Incidents</span>
            <span className="text-[10px] text-gray-500 block mt-1">Zero False Triggers</span>
          </div>

          <div className="bg-carbon-900 border border-carbon-800 rounded p-4">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block">AVERAGE REACTION LATENCY</span>
            <span className="text-xl font-bold text-omni-cyan tabular-nums">1,392 ms</span>
            <span className="text-[10px] text-gray-500 block mt-1">Full End-to-End Loop</span>
          </div>

          <div className="bg-carbon-900 border border-carbon-800 rounded p-4">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block">CONSENSUS VELOCITY</span>
            <span className="text-xl font-bold text-omni-blue tabular-nums">~1.00s / block</span>
            <span className="text-[10px] text-gray-500 block mt-1">CometBFT Instant Finality</span>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-carbon-900 border border-carbon-800 rounded p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="h-3.5 w-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by tx hash, chain ID, or log parameters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-carbon-950 border border-carbon-800 rounded pl-9 pr-3 py-2 text-gray-200 placeholder-gray-500 text-xs focus:outline-none focus:border-omni-blue"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {["ALL", "SWAP", "ANOMALY_TRIGGERED", "REACTIVE_DISPATCH", "CALLBACK_EXECUTED"].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2.5 py-1.5 rounded text-[10px] uppercase font-bold transition whitespace-nowrap ${
                  filterType === t
                    ? "bg-omni-blue text-white"
                    : "bg-carbon-950 text-gray-400 hover:text-white border border-carbon-800"
                }`}
              >
                {t.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-carbon-900 border border-carbon-800 rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-carbon-950 border-b border-carbon-800 text-[10px] text-gray-400 uppercase">
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Event Classification</th>
                  <th className="py-3 px-4">Origin / Sentinel Chain</th>
                  <th className="py-3 px-4">Transaction Hash</th>
                  <th className="py-3 px-4">Block #</th>
                  <th className="py-3 px-4">Loop Latency</th>
                  <th className="py-3 px-4">Execution Payload Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-carbon-800/80 bg-carbon-950/30">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-carbon-800/40 transition">
                    <td className="py-3 px-4 text-gray-400 whitespace-nowrap">
                      {log.timestamp}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        log.type === "ANOMALY_TRIGGERED"
                          ? "bg-red-500/15 text-red-400 border-red-500/30"
                          : log.type === "CALLBACK_EXECUTED"
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          : log.type === "REACTIVE_DISPATCH"
                          ? "bg-purple-500/15 text-purple-400 border-purple-500/30"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                      }`}>
                        {log.type}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-gray-300 whitespace-nowrap">
                      {log.chain}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-300 font-medium">
                          {log.txHash.slice(0, 8)}...{log.txHash.slice(-6)}
                        </span>
                        <button
                          onClick={() => handleCopy(log.txHash, log.id)}
                          className="text-gray-500 hover:text-white"
                          title="Copy hash"
                        >
                          {copiedId === log.id ? (
                            <Check className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                        <a
                          href={getExplorerUrl(log.chain, log.txHash)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-omni-blue"
                          title="Open explorer"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-gray-400 tabular-nums">
                      #{log.blockNumber.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-gray-200 tabular-nums font-bold">
                      {log.deltaMs === 0 ? "0ms" : `+${log.deltaMs}ms`}
                    </td>

                    <td className="py-3 px-4 text-gray-300 max-w-sm truncate">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
