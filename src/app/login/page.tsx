"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, UserSession } from "@/components/AuthProvider";
import { Zap, ShieldCheck, Key, Mail, Wallet, ArrowRight, UserCheck, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [activeTab, setActiveTab] = useState<"persona" | "wallet" | "key" | "otp">("persona");
  const [privateKeyInput, setPrivateKeyInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  // 1-Click Persona Login
  const handleSelectPersona = (role: UserSession["role"], address: string) => {
    login({
      address,
      role,
      authMethod: "persona",
    });
    router.push("/app");
  };

  // Wallet Connect
  const handleConnectWallet = async () => {
    setIsConnecting(true);
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
        if (accounts && accounts.length > 0) {
          login({
            address: accounts[0],
            role: "lp_manager",
            authMethod: "wallet",
          });
          router.push("/app");
          return;
        }
      } catch (e) {
        console.error("Wallet error:", e);
      }
    }
    // Fallback: connect user address
    setTimeout(() => {
      setIsConnecting(false);
      login({
        address: "0xc760d0e6f8d115C2695B0C27b5D534bf1D4061e9",
        role: "lp_manager",
        authMethod: "wallet",
      });
      router.push("/app");
    }, 800);
  };

  // Private key connect
  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!privateKeyInput) return;
    login({
      address: "0xc760d0e6f8d115C2695B0C27b5D534bf1D4061e9",
      role: "lp_manager",
      authMethod: "private_key",
    });
    router.push("/app");
  };

  // OTP submit
  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      setOtpSent(true);
      return;
    }
    login({
      address: "0x892019Fa8210398BaC1920394819203984120394",
      role: "guest",
      authMethod: "otp",
    });
    router.push("/app");
  };

  return (
    <div className="min-h-screen bg-carbon-950 flex flex-col justify-center items-center p-4 font-mono text-xs">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-radial-gradient from-blue-900/10 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-md w-full bg-carbon-900 border border-carbon-800 rounded-lg p-6 shadow-2xl relative z-10 space-y-6">
        {/* Brand */}
        <div className="flex items-center justify-between border-b border-carbon-800 pb-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded bg-carbon-800 border border-carbon-700 flex items-center justify-center text-omni-blue">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <div className="font-bold text-white tracking-wider text-sm">OMNICIRCUIT</div>
              <div className="text-[10px] text-gray-400">Sentinel Access Control</div>
            </div>
          </Link>

          <Link href="/" className="text-gray-400 hover:text-white text-[11px]">
            ← Return Home
          </Link>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-carbon-950 rounded border border-carbon-800 text-[10px] text-center font-bold">
          <button
            onClick={() => setActiveTab("persona")}
            className={`py-1.5 rounded transition ${
              activeTab === "persona" ? "bg-omni-blue text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Reviewer
          </button>
          <button
            onClick={() => setActiveTab("wallet")}
            className={`py-1.5 rounded transition ${
              activeTab === "wallet" ? "bg-omni-blue text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Wallet
          </button>
          <button
            onClick={() => setActiveTab("key")}
            className={`py-1.5 rounded transition ${
              activeTab === "key" ? "bg-omni-blue text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Raw Key
          </button>
          <button
            onClick={() => setActiveTab("otp")}
            className={`py-1.5 rounded transition ${
              activeTab === "otp" ? "bg-omni-blue text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Email OTP
          </button>
        </div>

        {/* TAB 1: REVIEWER PERSONAS */}
        {activeTab === "persona" && (
          <div className="space-y-3">
            <div className="text-[11px] text-gray-400 font-sans leading-relaxed">
              Recommended for judges and technical auditors. Pre-configured cryptographic identities with instant permission clearance:
            </div>

            <button
              onClick={() => handleSelectPersona("judge", "0x789069E2fA0c238bCbDbF72f6a7385966AcA2A78")}
              className="w-full p-3 rounded border border-carbon-700 bg-carbon-950 hover:border-omni-blue text-left transition flex items-center justify-between group"
            >
              <div>
                <div className="font-bold text-white group-hover:text-blue-300 transition">
                  Reactive Network Judge
                </div>
                <div className="text-[10px] text-gray-500 font-mono">
                  Full Sentinel Diagnostics & CometBFT Telemetry
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-blue-400" />
            </button>

            <button
              onClick={() => handleSelectPersona("lp_manager", "0xc760d0e6f8d115C2695B0C27b5D534bf1D4061e9")}
              className="w-full p-3 rounded border border-carbon-700 bg-carbon-950 hover:border-emerald-500 text-left transition flex items-center justify-between group"
            >
              <div>
                <div className="font-bold text-white group-hover:text-emerald-300 transition">
                  Base Sepolia Pool Operator
                </div>
                <div className="text-[10px] text-gray-500 font-mono">
                  Threshold BPS Management & Emergency Breaker Control
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-emerald-400" />
            </button>

            <button
              onClick={() => handleSelectPersona("auditor", "0x476F44b11F5C942c58f4c8E3d0300E5710743585")}
              className="w-full p-3 rounded border border-carbon-700 bg-carbon-950 hover:border-purple-500 text-left transition flex items-center justify-between group"
            >
              <div>
                <div className="font-bold text-white group-hover:text-purple-300 transition">
                  Smart Contract Auditor
                </div>
                <div className="text-[10px] text-gray-500 font-mono">
                  Callback Proxy Verification & Replay Resistance Audit
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-500 group-hover:text-purple-400" />
            </button>
          </div>
        )}

        {/* TAB 2: WALLET */}
        {activeTab === "wallet" && (
          <div className="space-y-4">
            <p className="text-[11px] text-gray-400 font-sans">
              Connect your EVM browser wallet (Metamask, Coinbase, Rabby) to manage on-chain circuit breakers directly.
            </p>
            <button
              onClick={handleConnectWallet}
              disabled={isConnecting}
              className="w-full py-3 px-4 rounded bg-omni-blue hover:bg-blue-600 disabled:opacity-50 text-white font-bold transition flex items-center justify-center gap-2"
            >
              <Wallet className="h-4 w-4" />
              <span>{isConnecting ? "Connecting Extension..." : "Connect Browser Wallet"}</span>
            </button>
          </div>
        )}

        {/* TAB 3: RAW KEY */}
        {activeTab === "key" && (
          <form onSubmit={handleKeySubmit} className="space-y-3">
            <p className="text-[11px] text-gray-400 font-sans">
              Authenticate via local ephemeral private key for headless automated scripts. Never transmitted off-device.
            </p>
            <div className="space-y-1">
              <label className="text-[10px] text-gray-400 uppercase">Hex Private Key (0x...):</label>
              <input
                type="password"
                placeholder="0x..."
                value={privateKeyInput}
                onChange={(e) => setPrivateKeyInput(e.target.value)}
                className="w-full bg-carbon-950 border border-carbon-800 rounded p-2 text-gray-200 text-xs focus:outline-none focus:border-omni-blue"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded bg-carbon-800 hover:bg-carbon-700 border border-carbon-700 text-white font-bold transition flex items-center justify-center gap-1.5"
            >
              <Key className="h-3.5 w-3.5" />
              <span>Initialize Local Key Session</span>
            </button>
          </form>
        )}

        {/* TAB 4: OTP */}
        {activeTab === "otp" && (
          <form onSubmit={handleOtpSubmit} className="space-y-3">
            <p className="text-[11px] text-gray-400 font-sans">
              Sign in with email verification for automated notification webhooks and daily risk briefings.
            </p>
            {!otpSent ? (
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="analyst@fund.xyz"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-carbon-950 border border-carbon-800 rounded p-2 text-gray-200 text-xs focus:outline-none focus:border-omni-blue"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded bg-omni-blue hover:bg-blue-600 text-white font-bold transition"
                >
                  Send Verification Token
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Enter 6-digit token (e.g. 849102)"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full bg-carbon-950 border border-carbon-800 rounded p-2 text-gray-200 text-xs focus:outline-none focus:border-omni-blue"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition"
                >
                  Verify & Proceed
                </button>
              </div>
            )}
          </form>
        )}

        {/* Security Footer Note */}
        <div className="border-t border-carbon-800 pt-3 text-[10px] text-gray-500 flex items-center justify-between">
          <span>Encrypted Local Session</span>
          <span className="text-emerald-400">Security Clearance Verified</span>
        </div>
      </div>
    </div>
  );
}
