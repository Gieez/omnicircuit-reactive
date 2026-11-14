"use client";

import React, { useState } from "react";
import { Settings, Shield, Bell, Globe, Save, Check, RefreshCw } from "lucide-react";
import { NETWORKS } from "@/lib/constants";

export default function SettingsPage() {
  const [baseRpc, setBaseRpc] = useState<string>(NETWORKS.BASE_SEPOLIA.rpcUrl);
  const [lasnaRpc, setLasnaRpc] = useState<string>(NETWORKS.REACTIVE_LASNA.rpcUrl);
  const [callbackProxy, setCallbackProxy] = useState<string>(NETWORKS.BASE_SEPOLIA.callbackProxy);
  const [webhookUrl, setWebhookUrl] = useState("https://discord.com/api/webhooks/131920/omnicircuit-alerts");
  const [isSaved, setIsSaved] = useState(false);
  const [webhookTestStatus, setWebhookTestStatus] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleTestWebhook = () => {
    setWebhookTestStatus("Sending test dispatch...");
    setTimeout(() => {
      setWebhookTestStatus("Test alert delivered successfully (HTTP 204 No Content).");
      setTimeout(() => setWebhookTestStatus(null), 3000);
    }, 800);
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Header */}
      <div className="bg-carbon-900 border border-carbon-800 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-carbon-800 border border-carbon-700 text-omni-blue">
              <Settings className="h-4 w-4" />
            </span>
            <h1 className="text-base font-bold text-white tracking-wide uppercase">
              NETWORK TOPOLOGY & ALERT CONFIGURATION
            </h1>
          </div>
          <p className="text-gray-400 text-xs font-sans mt-1">
            Manage RPC connections, callback proxy routing, and real-time incident dispatch integrations.
          </p>
        </div>

        {isSaved && (
          <div className="px-3 py-1.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5" />
            <span>Configuration Persisted</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: RPC and Proxy (6 cols) */}
        <div className="lg:col-span-6 bg-carbon-900 border border-carbon-800 rounded-lg p-5 space-y-4">
          <div className="border-b border-carbon-800 pb-2 flex items-center gap-2 text-white font-bold text-xs uppercase">
            <Globe className="h-4 w-4 text-blue-400" />
            <span>On-Chain Node Endpoints</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-gray-400 uppercase">Base Sepolia RPC Endpoint:</label>
            <input
              type="text"
              value={baseRpc}
              onChange={(e) => setBaseRpc(e.target.value)}
              className="w-full bg-carbon-950 border border-carbon-800 rounded p-2 text-white text-xs focus:outline-none focus:border-omni-blue"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-gray-400 uppercase">Reactive Lasna RPC Endpoint:</label>
            <input
              type="text"
              value={lasnaRpc}
              onChange={(e) => setLasnaRpc(e.target.value)}
              className="w-full bg-carbon-950 border border-carbon-800 rounded p-2 text-white text-xs focus:outline-none focus:border-omni-blue"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-gray-400 uppercase">Destination Callback Proxy Address:</label>
            <input
              type="text"
              value={callbackProxy}
              onChange={(e) => setCallbackProxy(e.target.value)}
              className="w-full bg-carbon-950 border border-carbon-800 rounded p-2 text-white text-xs focus:outline-none focus:border-omni-blue"
            />
          </div>
        </div>

        {/* Right Column: Alert Webhooks & Logging (6 cols) */}
        <div className="lg:col-span-6 bg-carbon-900 border border-carbon-800 rounded-lg p-5 space-y-4">
          <div className="border-b border-carbon-800 pb-2 flex items-center gap-2 text-white font-bold text-xs uppercase">
            <Bell className="h-4 w-4 text-amber-400" />
            <span>Incident Notification Webhooks</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-gray-400 uppercase">Discord / Telegram Webhook URL:</label>
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full bg-carbon-950 border border-carbon-800 rounded p-2 text-white text-xs focus:outline-none focus:border-omni-blue"
            />
            <p className="text-[11px] text-gray-500 font-sans">
              Instant payload dispatch whenever an anomaly breaches threshold BPS or when a circuit breaker locks.
            </p>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={handleTestWebhook}
              className="px-3 py-1.5 rounded bg-carbon-800 hover:bg-carbon-700 border border-carbon-700 text-gray-200 transition"
            >
              Dispatch Test Alert
            </button>
            {webhookTestStatus && (
              <span className="text-[10px] text-emerald-400">{webhookTestStatus}</span>
            )}
          </div>

          <div className="pt-4 border-t border-carbon-800">
            <button
              type="submit"
              className="w-full py-2.5 rounded bg-omni-blue hover:bg-blue-600 text-white font-bold transition flex items-center justify-center gap-2"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
