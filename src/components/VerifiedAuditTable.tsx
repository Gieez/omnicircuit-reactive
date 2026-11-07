"use client";

import React, { useState } from "react";
import { TelemetryLog, NETWORKS } from "@/lib/constants";
import { ExternalLink, Copy, Check, Terminal, Filter } from "lucide-react";

interface Props {
  logs: TelemetryLog[];
}

export default function VerifiedAuditTable({ logs }: Props) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getExplorerUrl = (chain: string, hash: string) => {
    if (chain.toLowerCase().includes("lasna")) {
      return `${NETWORKS.REACTIVE_LASNA.explorer}/tx/${hash}`;
    }
    return `${NETWORKS.BASE_SEPOLIA.explorer}/tx/${hash}`;
  };

  const getBadgeStyle = (type: TelemetryLog["type"]) => {
    switch (type) {
      case "SWAP":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "ANOMALY_TRIGGERED":
        return "bg-red-500/15 text-red-400 border-red-500/30 font-bold";
      case "REACTIVE_DISPATCH":
        return "bg-purple-500/15 text-purple-400 border-purple-500/30";
      case "CALLBACK_EXECUTED":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-bold";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="bg-carbon-900 border border-carbon-700 rounded-lg p-5 shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-carbon-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-carbon-800 border border-carbon-700 text-omni-blue">
            <Terminal className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-bold text-white tracking-wide">
              VERIFIED AUDIT LEDGER & TX TRACE
            </h3>
            <p className="text-[11px] font-mono text-gray-400">
              Cryptographic Transaction Records across Base Sepolia (Origin) & Reactive Lasna (Sentinel)
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-carbon-800 text-gray-400 border border-carbon-700">
          {logs.length} Recorded Traces
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-carbon-800 rounded">
        <table className="w-full text-left border-collapse font-mono text-xs">
          <thead>
            <tr className="bg-carbon-950 border-b border-carbon-800 text-[10px] text-gray-400 uppercase">
              <th className="py-2.5 px-3">Time</th>
              <th className="py-2.5 px-3">Event Signature</th>
              <th className="py-2.5 px-3">Network</th>
              <th className="py-2.5 px-3">Tx Hash</th>
              <th className="py-2.5 px-3">Block #</th>
              <th className="py-2.5 px-3">Δ Latency</th>
              <th className="py-2.5 px-3">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-carbon-800/80 bg-carbon-950/40">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-carbon-800/40 transition-colors">
                <td className="py-2.5 px-3 text-gray-400 whitespace-nowrap text-[11px]">
                  {log.timestamp}
                </td>

                <td className="py-2.5 px-3 whitespace-nowrap">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] border ${getBadgeStyle(
                      log.type
                    )}`}
                  >
                    {log.type}
                  </span>
                </td>

                <td className="py-2.5 px-3 text-gray-300 whitespace-nowrap text-[11px]">
                  {log.chain}
                </td>

                <td className="py-2.5 px-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span className="text-gray-300 font-medium">
                      {log.txHash.slice(0, 6)}...{log.txHash.slice(-4)}
                    </span>
                    <button
                      onClick={() => handleCopy(log.txHash, log.id)}
                      className="text-gray-500 hover:text-gray-200 transition"
                      title="Copy Hash"
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
                      className="text-gray-500 hover:text-omni-blue transition"
                      title="Open in Explorer"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </td>

                <td className="py-2.5 px-3 text-gray-400 tabular-nums">
                  #{log.blockNumber.toLocaleString()}
                </td>

                <td className="py-2.5 px-3 text-gray-200 tabular-nums font-bold">
                  {log.deltaMs === 0 ? "0ms" : `+${log.deltaMs}ms`}
                </td>

                <td className="py-2.5 px-3 text-gray-300 text-[11px] max-w-xs truncate">
                  {log.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
