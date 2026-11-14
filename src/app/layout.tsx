import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "OmniCircuit | Sub-Second Autonomous DeFi Circuit Breaker",
  description: "Autonomous Sub-Second DeFi Circuit Breaker & Liquidity Sentinel on Base Sepolia powered by Reactive Omni CometBFT consensus",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-carbon-950 text-gray-100 antialiased selection:bg-omni-blue selection:text-white min-h-screen flex flex-col font-sans transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
