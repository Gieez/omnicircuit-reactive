"use client";

import React, { useState } from "react";
import { Cpu, Terminal, Copy, Check, Play, Zap, Code } from "lucide-react";
import { keccak256, toHex, encodeFunctionData } from "viem";
import { OmniCircuitCallback_ABI } from "@/contracts/contractsABI";
import { CONTRACT_ADDRESSES, NETWORKS } from "@/lib/constants";

export default function WireSimulatorPage() {
  const [eventSig, setEventSig] = useState(
    "EmergencyAnomalyDetected(address,uint256,uint256,uint256,uint256)"
  );
  const [calculatedTopic, setCalculatedTopic] = useState<string>(() => {
    try {
      return keccak256(toHex("EmergencyAnomalyDetected(address,uint256,uint256,uint256,uint256)"));
    } catch {
      return "";
    }
  });

  const [simDropBps, setSimDropBps] = useState<number>(784);
  const [simBlockNumber, setSimBlockNumber] = useState<number>(22849150);
  const [packedCalldata, setPackedCalldata] = useState<string>("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleComputeTopic = () => {
    try {
      const hash = keccak256(toHex(eventSig.trim()));
      setCalculatedTopic(hash);
    } catch (e) {
      setCalculatedTopic("Error calculating keccak256");
    }
  };

  const handlePackPayload = () => {
    try {
      // abi encode emergencyTrip(address(0), simDropBps, simBlockNumber)
      const calldata = encodeFunctionData({
        abi: OmniCircuitCallback_ABI,
        functionName: "emergencyTrip",
        args: [
          "0x0000000000000000000000000000000000000000",
          BigInt(simDropBps),
          BigInt(simBlockNumber),
        ],
      });
      setPackedCalldata(calldata);
    } catch (e: any) {
      setPackedCalldata("Error packing calldata: " + e.message);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Header */}
      <div className="bg-carbon-900 border border-carbon-800 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-carbon-800 border border-carbon-700 text-omni-blue">
              <Cpu className="h-4 w-4" />
            </span>
            <h1 className="text-base font-bold text-white tracking-wide uppercase">
              WIRE PAYLOAD & TOPIC0 DEBUGGER
            </h1>
          </div>
          <p className="text-gray-400 text-xs font-sans mt-1">
            Test and verify low-level event subscriptions, Topic0 signatures, and 160-bit callback proxy calldata layouts.
          </p>
        </div>

        <span className="text-[10px] uppercase bg-carbon-800 border border-carbon-700 px-2 py-0.5 rounded text-gray-400">
          Developer Sandbox
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Event Signature Hash (6 cols) */}
        <div className="lg:col-span-6 bg-carbon-900 border border-carbon-800 rounded-lg p-5 space-y-4">
          <div className="border-b border-carbon-800 pb-2 flex items-center justify-between">
            <span className="font-bold text-white uppercase text-xs flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5 text-omni-cyan" />
              1. Event Topic0 Generator
            </span>
            <span className="text-[10px] text-gray-500">keccak256</span>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-gray-400 uppercase">Event Signature String:</label>
            <input
              type="text"
              value={eventSig}
              onChange={(e) => setEventSig(e.target.value)}
              className="w-full bg-carbon-950 border border-carbon-800 rounded p-2 text-white text-xs focus:outline-none focus:border-omni-blue"
            />
            <button
              onClick={handleComputeTopic}
              className="px-3 py-1.5 rounded bg-carbon-800 hover:bg-carbon-700 border border-carbon-700 text-gray-200 transition"
            >
              Recalculate Topic0 Hash
            </button>
          </div>

          <div className="p-3 bg-carbon-950 border border-carbon-800 rounded space-y-1">
            <div className="flex items-center justify-between text-[10px] text-gray-400">
              <span>SUBSCRIBED TOPIC0 HASH:</span>
              <button
                onClick={() => handleCopy(calculatedTopic, "topic")}
                className="text-gray-400 hover:text-white flex items-center gap-1"
              >
                {copiedKey === "topic" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>Copy</span>
              </button>
            </div>
            <div className="text-omni-cyan font-bold break-all text-[11px]">
              {calculatedTopic}
            </div>
          </div>
        </div>

        {/* Right Column: Callback Calldata Packer (6 cols) */}
        <div className="lg:col-span-6 bg-carbon-900 border border-carbon-800 rounded-lg p-5 space-y-4">
          <div className="border-b border-carbon-800 pb-2 flex items-center justify-between">
            <span className="font-bold text-white uppercase text-xs flex items-center gap-2">
              <Code className="h-3.5 w-3.5 text-emerald-400" />
              2. Callback Payload Packer
            </span>
            <span className="text-[10px] text-gray-500">160-bit Placeholder</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 uppercase">Price Drop (BPS):</label>
              <input
                type="number"
                value={simDropBps}
                onChange={(e) => setSimDropBps(parseInt(e.target.value) || 0)}
                className="w-full bg-carbon-950 border border-carbon-800 rounded p-2 text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 uppercase">Origin Block Number:</label>
              <input
                type="number"
                value={simBlockNumber}
                onChange={(e) => setSimBlockNumber(parseInt(e.target.value) || 0)}
                className="w-full bg-carbon-950 border border-carbon-800 rounded p-2 text-white"
              />
            </div>
          </div>

          <button
            onClick={handlePackPayload}
            className="w-full py-2 rounded bg-omni-blue hover:bg-blue-600 text-white font-bold transition flex items-center justify-center gap-2"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Generate requestCallbackV_1_0 Payload</span>
          </button>

          {packedCalldata && (
            <div className="p-3 bg-carbon-950 border border-carbon-800 rounded space-y-1">
              <div className="flex items-center justify-between text-[10px] text-gray-400">
                <span>ABI-ENCODED CALLDATA:</span>
                <button
                  onClick={() => handleCopy(packedCalldata, "calldata")}
                  className="text-gray-400 hover:text-white flex items-center gap-1"
                >
                  {copiedKey === "calldata" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>Copy</span>
                </button>
              </div>
              <div className="text-emerald-400 break-all text-[10px] max-h-24 overflow-y-auto">
                {packedCalldata}
              </div>
              <div className="text-[10px] text-gray-500 pt-1">
                Notice: Bytes 4-36 contain address(0) which Reactive Signer proxy overwrites on delivery.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
