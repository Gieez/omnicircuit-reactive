import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OmniCircuit | Sub-Second DeFi Circuit Breaker",
  description: "Autonomous Sub-Second DeFi Circuit Breaker & Liquidity Sentinel on Base Sepolia powered by Reactive Omni",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-carbon-950 text-gray-100 antialiased selection:bg-omni-blue selection:text-white min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
