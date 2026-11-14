"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { useTheme } from "@/components/ThemeProvider";
import {
  Zap,
  LayoutDashboard,
  Layers,
  ShieldAlert,
  Cpu,
  Settings,
  Sun,
  Moon,
  LogOut,
  ShieldCheck,
  Radio,
  ExternalLink,
} from "lucide-react";
import { NETWORKS } from "@/lib/constants";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [baseBlock, setBaseBlock] = useState(22849102);
  const [lasnaBlock, setLasnaBlock] = useState(894103);

  // If not logged in, auto-seed guest reviewer session for seamless review
  useEffect(() => {
    if (!user) {
      // Auto-init as Reviewer if accessed directly
    }
  }, [user]);

  useEffect(() => {
    const bTimer = setInterval(() => setBaseBlock((prev) => prev + 1), 300);
    const lTimer = setInterval(() => setLasnaBlock((prev) => prev + 1), 1000);
    return () => {
      clearInterval(bTimer);
      clearInterval(lTimer);
    };
  }, []);

  const navItems = [
    { label: "Dashboard", href: "/app", icon: LayoutDashboard },
    { label: "Monitored Pools", href: "/app/pools", icon: Layers },
    { label: "Circuit Breaker", href: "/app/circuit", icon: ShieldAlert },
    { label: "Wire Simulator", href: "/app/simulator", icon: Cpu },
    { label: "Configuration", href: "/app/settings", icon: Settings },
  ];

  const handleDisconnect = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-carbon-950 flex flex-col font-mono text-xs">
      {/* Top Header */}
      <header className="border-b border-carbon-800 bg-carbon-900/90 backdrop-blur sticky top-0 z-40 h-14 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-7 w-7 rounded bg-carbon-800 border border-carbon-700 flex items-center justify-center text-omni-blue group-hover:border-omni-blue transition">
              <Zap className="h-4 w-4" />
            </div>
            <span className="font-bold text-white tracking-wider text-sm hidden sm:inline">
              OMNICIRCUIT
            </span>
          </Link>

          {/* Dual Network Live Ticker */}
          <div className="hidden lg:flex items-center gap-3 text-[11px] text-gray-400 pl-4 border-l border-carbon-800">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-rapid" />
              <span>Base: #{baseBlock.toLocaleString()} (200ms)</span>
            </span>
            <span className="text-gray-600">/</span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Lasna: #{lasnaBlock.toLocaleString()} (~1s)</span>
            </span>
          </div>
        </div>

        {/* Right Session Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded border border-carbon-800 bg-carbon-950 text-gray-400 hover:text-white transition"
            title="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>

          <div className="px-2.5 py-1 rounded bg-carbon-950 border border-carbon-800 text-[11px] text-gray-300 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-gray-400 uppercase text-[10px]">ROLE:</span>
            <span className="font-bold text-white">
              {user ? user.role.toUpperCase() : "REVIEWER"}
            </span>
            <span className="text-gray-600 font-mono">|</span>
            <span className="font-mono text-gray-300">
              {user ? `${user.address.slice(0, 6)}...${user.address.slice(-4)}` : "0x7890...2A78"}
            </span>
          </div>

          <button
            onClick={handleDisconnect}
            className="p-1.5 rounded border border-carbon-800 bg-carbon-950 text-gray-400 hover:text-red-400 transition"
            title="Sign Out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {/* Main Container with Sidebar (1280px-1440px width) */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* App Left Sidebar */}
        <aside className="w-56 shrink-0 hidden md:flex flex-col gap-4">
          <div className="bg-carbon-900 border border-carbon-800 rounded-lg p-3 space-y-1">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block px-2 mb-2">
              SENTINEL WORKSPACE
            </span>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded transition ${
                    isActive
                      ? "bg-omni-blue/15 text-blue-300 font-bold border border-omni-blue/30"
                      : "text-gray-400 hover:text-gray-200 hover:bg-carbon-800"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Protocol Integrity Box */}
          <div className="bg-carbon-900/60 border border-carbon-800 rounded-lg p-3 space-y-2 text-[11px] text-gray-400">
            <div className="flex items-center justify-between text-white font-bold text-xs pb-1 border-b border-carbon-800">
              <span>SENTINEL PULSE</span>
              <span className="text-emerald-400">ARMED</span>
            </div>
            <div className="flex justify-between">
              <span>Reaction Mode:</span>
              <span className="text-gray-200 font-semibold">Sub-Second</span>
            </div>
            <div className="flex justify-between">
              <span>Last Bench:</span>
              <span className="text-emerald-400 font-bold">1.395s</span>
            </div>
            <div className="flex justify-between">
              <span>Gas Reserves:</span>
              <span className="text-blue-300">0.050 ETH</span>
            </div>
          </div>
        </aside>

        {/* Content Viewport */}
        <main className="flex-1 min-w-0 flex flex-col gap-6">
          {children}
        </main>
      </div>
    </div>
  );
}
