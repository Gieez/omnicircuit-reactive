"use client";

import React, { useState } from "react";
import { Layers, Plus, ShieldCheck, ShieldAlert, Edit2, Check, ArrowRight, ExternalLink } from "lucide-react";
import { CONTRACT_ADDRESSES, NETWORKS } from "@/lib/constants";

interface PoolConfig {
  id: string;
  name: string;
  pair: string;
  address: string;
  chain: string;
  tvl: string;
  thresholdBps: number;
  status: "PROTECTED" | "TRIPPED" | "STANDBY";
  lastCheck: string;
}

export default function PoolsPage() {
  const [pools, setPools] = useState<PoolConfig[]>([
    {
      id: "pool-1",
      name: "Primary ETH/USDC Vault",
      pair: "ETH / USDC",
      address: CONTRACT_ADDRESSES.ORIGIN_POOL,
      chain: "Base Sepolia (84532)",
      tvl: "$600,000",
      thresholdBps: 300,
      status: "PROTECTED",
      lastCheck: "1.2s ago",
    },
    {
      id: "pool-2",
      name: "cbBTC Reserve Anchor",
      pair: "cbBTC / USDC",
      address: "0x89Ba1029cfa0182bCa9102938102938410293810",
      chain: "Base Sepolia (84532)",
      tvl: "$1,250,000",
      thresholdBps: 250,
      status: "PROTECTED",
      lastCheck: "2.4s ago",
    },
    {
      id: "pool-3",
      name: "High-Beta AERO Pool",
      pair: "AERO / ETH",
      address: "0x42Ca789102839bCa019283ba019283ca019283da",
      chain: "Base Sepolia (84532)",
      tvl: "$340,000",
      thresholdBps: 450,
      status: "PROTECTED",
      lastCheck: "3.1s ago",
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newThreshold, setNewThreshold] = useState<number>(300);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [addName, setAddName] = useState("");
  const [addAddress, setAddAddress] = useState("");
  const [addPair, setAddPair] = useState("");
  const [addThreshold, setAddThreshold] = useState(300);

  const handleSaveThreshold = (id: string) => {
    setPools((prev) =>
      prev.map((p) => (p.id === id ? { ...p, thresholdBps: newThreshold } : p))
    );
    setEditingId(null);
  };

  const handleAddPool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName || !addAddress) return;

    const newPool: PoolConfig = {
      id: "pool-" + Date.now(),
      name: addName,
      pair: addPair || "TOKEN / ETH",
      address: addAddress,
      chain: "Base Sepolia (84532)",
      tvl: "$100,000",
      thresholdBps: addThreshold,
      status: "PROTECTED",
      lastCheck: "Just now",
    };

    setPools((prev) => [newPool, ...prev]);
    setShowAddModal(false);
    setAddName("");
    setAddAddress("");
    setAddPair("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-carbon-900 border border-carbon-800 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-carbon-800 border border-carbon-700 text-omni-blue">
              <Layers className="h-4 w-4" />
            </span>
            <h1 className="text-base font-bold text-white tracking-wide uppercase font-mono">
              MONITORED POOL REGISTRY & RISK MATRIX
            </h1>
          </div>
          <p className="text-gray-400 text-xs font-sans mt-1">
            Configure single-block drawdown limits (thresholdBps) and monitor on-chain vault protection status.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded bg-omni-blue hover:bg-blue-600 text-white font-bold transition flex items-center gap-2 self-start sm:self-auto shadow-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Register New Pool</span>
        </button>
      </div>

      {/* Pools Table */}
      <div className="bg-carbon-900 border border-carbon-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="bg-carbon-950 border-b border-carbon-800 text-[10px] text-gray-400 uppercase">
                <th className="py-3 px-4">Pool & Asset Pair</th>
                <th className="py-3 px-4">Contract Address</th>
                <th className="py-3 px-4">Network</th>
                <th className="py-3 px-4">TVL Monitored</th>
                <th className="py-3 px-4">Sensitivity (Threshold Bps)</th>
                <th className="py-3 px-4">Sentinel Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-carbon-800/80 bg-carbon-950/30">
              {pools.map((p) => (
                <tr key={p.id} className="hover:bg-carbon-800/40 transition">
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-bold text-white">{p.name}</div>
                    <div className="text-[11px] text-gray-400">{p.pair}</div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <a
                      href={`${NETWORKS.BASE_SEPOLIA.explorer}/address/${p.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-omni-blue flex items-center gap-1"
                    >
                      <span>{p.address.slice(0, 8)}...{p.address.slice(-6)}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </td>

                  <td className="py-3.5 px-4 text-gray-400 whitespace-nowrap">
                    {p.chain}
                  </td>

                  <td className="py-3.5 px-4 text-white font-bold tabular-nums">
                    {p.tvl}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {editingId === p.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={newThreshold}
                          onChange={(e) => setNewThreshold(parseInt(e.target.value) || 0)}
                          className="w-20 bg-carbon-950 border border-carbon-700 rounded px-2 py-1 text-white text-xs"
                          min="50"
                          max="2000"
                        />
                        <button
                          onClick={() => handleSaveThreshold(p.id)}
                          className="p-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white"
                          title="Save"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-400 tabular-nums">
                          {(p.thresholdBps / 100).toFixed(1)}% ({p.thresholdBps} bps)
                        </span>
                        <button
                          onClick={() => {
                            setEditingId(p.id);
                            setNewThreshold(p.thresholdBps);
                          }}
                          className="text-gray-500 hover:text-white"
                          title="Edit Sensitivity"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-max">
                      <ShieldCheck className="h-3 w-3" />
                      <span>{p.status}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => {
                        setEditingId(p.id);
                        setNewThreshold(p.thresholdBps);
                      }}
                      className="text-blue-400 hover:underline font-semibold"
                    >
                      Adjust Limit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Pool Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddPool}
            className="bg-carbon-900 border border-carbon-700 rounded-lg max-w-md w-full p-6 space-y-4 font-mono text-xs shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-carbon-800 pb-3">
              <h2 className="text-sm font-bold text-white tracking-wide uppercase">
                REGISTER MONITORED DEX POOL
              </h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 uppercase">Pool Display Name:</label>
              <input
                type="text"
                placeholder="e.g. Unichain WETH/USDC Liquidity Vault"
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                className="w-full bg-carbon-950 border border-carbon-800 rounded p-2 text-white focus:outline-none focus:border-omni-blue"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 uppercase">Pair Identifier:</label>
              <input
                type="text"
                placeholder="e.g. WETH / USDC"
                value={addPair}
                onChange={(e) => setAddPair(e.target.value)}
                className="w-full bg-carbon-950 border border-carbon-800 rounded p-2 text-white focus:outline-none focus:border-omni-blue"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 uppercase">Contract Address (0x...):</label>
              <input
                type="text"
                placeholder="0x..."
                value={addAddress}
                onChange={(e) => setAddAddress(e.target.value)}
                className="w-full bg-carbon-950 border border-carbon-800 rounded p-2 text-white focus:outline-none focus:border-omni-blue font-mono"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 uppercase">Sensitivity Threshold (BPS):</label>
              <input
                type="number"
                value={addThreshold}
                onChange={(e) => setAddThreshold(parseInt(e.target.value) || 300)}
                className="w-full bg-carbon-950 border border-carbon-800 rounded p-2 text-white focus:outline-none focus:border-omni-blue"
                min="50"
                max="2000"
              />
              <span className="text-[10px] text-gray-500">
                {(addThreshold / 100).toFixed(1)}% price drop in 1 block triggers emergency circuit.
              </span>
            </div>

            <div className="border-t border-carbon-800 pt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 rounded bg-carbon-800 hover:bg-carbon-700 text-gray-300 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-omni-blue hover:bg-blue-600 text-white font-bold"
              >
                Save & Subscribe
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
