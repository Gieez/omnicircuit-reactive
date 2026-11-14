"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Moon, Sun, ArrowRight, ShieldCheck, Terminal, BookOpen, Activity, User, LogOut } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/components/AuthProvider";

export default function PublicNavbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const navLinks = [
    { label: "Overview", href: "/" },
    { label: "Documentation", href: "/docs" },
    { label: "Public Telemetry", href: "/telemetry" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-carbon-800 bg-carbon-950/90 dark:bg-carbon-950/90 backdrop-blur transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-8 w-8 rounded bg-carbon-900 border border-carbon-700 flex items-center justify-center text-omni-blue group-hover:border-omni-blue transition shadow-inner">
            <Zap className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono font-bold tracking-wider text-sm text-gray-100 dark:text-gray-100 flex items-center gap-1.5">
              OMNICIRCUIT
              <span className="text-[10px] px-1 py-0.2 rounded font-mono font-semibold bg-blue-500/10 text-omni-blue border border-blue-500/20">
                OMNI v1
              </span>
            </span>
            <span className="text-[10px] font-mono text-gray-400">
              Base 200ms : Reactive 1s
            </span>
          </div>
        </Link>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-1 font-mono text-xs">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded transition ${
                  isActive
                    ? "bg-carbon-800 text-white font-semibold border border-carbon-700"
                    : "text-gray-400 hover:text-gray-200 hover:bg-carbon-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA / Controls */}
        <div className="flex items-center gap-2.5 font-mono text-xs">
          {/* Light/Dark Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded border border-carbon-700 bg-carbon-900 hover:bg-carbon-800 text-gray-400 hover:text-gray-200 transition"
            title="Toggle Light / Dark mode"
          >
            {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/app"
                className="px-3 py-1.5 rounded bg-carbon-800 border border-carbon-700 hover:border-carbon-600 text-gray-200 flex items-center gap-1.5 transition"
              >
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{user.address.slice(0, 6)}...{user.address.slice(-4)}</span>
              </Link>
              <button
                onClick={logout}
                className="p-1.5 rounded border border-carbon-800 bg-carbon-900 hover:bg-carbon-800 text-gray-400 hover:text-red-400 transition"
                title="Disconnect"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1.5 rounded bg-carbon-900 hover:bg-carbon-800 text-gray-300 border border-carbon-700 transition flex items-center gap-1.5"
            >
              <User className="h-3 w-3" />
              <span>Sign In</span>
            </Link>
          )}

          <Link
            href="/app"
            className="px-3.5 py-1.5 rounded bg-omni-blue hover:bg-blue-600 text-white font-semibold transition flex items-center gap-1.5 shadow-sm"
          >
            <span>Launch Sentinel</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
