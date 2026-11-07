import { OriginPool_ABI, OmniCircuitReactive_ABI, OmniCircuitCallback_ABI } from "@/contracts/contractsABI";

export const NETWORKS = {
  BASE_SEPOLIA: {
    chainId: 84532,
    name: "Base Sepolia",
    blockTime: "200ms (Denim)",
    rpcUrl: "https://sepolia.base.org",
    explorer: "https://sepolia.basescan.org",
    callbackProxy: "0x476F44b11F5C942c58f4c8E3d0300E5710743585",
  },
  REACTIVE_LASNA: {
    chainId: 5318007,
    name: "Reactive Lasna",
    blockTime: "~1s (CometBFT)",
    rpcUrl: "https://lasna-rpc.rnk.dev/",
    explorer: "https://lasna.reactivescan.io",
    systemContract: "0x8888888888888888888888888888888888888888",
  },
} as const;

// Deployed contract references or fallbacks for simulation & live telemetry
export const CONTRACT_ADDRESSES = {
  ORIGIN_POOL: "0x12Fa9aB34b071c3A824B753D32849F604313bF56",
  OMNI_REACTIVE: "0x789069E2fA0c238bCbDbF72f6a7385966AcA2A78",
  OMNI_CALLBACK: "0xC526b71329a1E0C9368564D33F05234D3557457a",
};

export const CONTRACT_ABIS = {
  OriginPool: OriginPool_ABI,
  OmniCircuitReactive: OmniCircuitReactive_ABI,
  OmniCircuitCallback: OmniCircuitCallback_ABI,
};

export interface TelemetryLog {
  id: string;
  type: "SWAP" | "ANOMALY_TRIGGERED" | "REACTIVE_DISPATCH" | "CALLBACK_EXECUTED";
  chain: string;
  txHash: string;
  blockNumber: number;
  deltaMs: number;
  details: string;
  timestamp: string;
}

export const INITIAL_LOGS: TelemetryLog[] = [
  {
    id: "init-1",
    type: "SWAP",
    chain: "Base Sepolia (84532)",
    txHash: "0xa81c4e12fa098bca4871d530867a5491de8162e087198751fa049d5812903fe2",
    blockNumber: 22849102,
    deltaMs: 0,
    details: "Flash Swap executed: 35.0 ETH dumped for 82,410 USDC (-7.84% drop)",
    timestamp: "12:04:18.210",
  },
  {
    id: "init-2",
    type: "ANOMALY_TRIGGERED",
    chain: "Base Sepolia (84532)",
    txHash: "0xa81c4e12fa098bca4871d530867a5491de8162e087198751fa049d5812903fe2",
    blockNumber: 22849102,
    deltaMs: 18,
    details: "Event EmergencyAnomalyDetected emitted: Price drop 784 bps > Threshold 300 bps",
    timestamp: "12:04:18.228",
  },
  {
    id: "init-3",
    type: "REACTIVE_DISPATCH",
    chain: "Reactive Lasna (5318007)",
    txHash: "0x53f190eac190ba329ff0189b889d1230e99818fa8b72456486718ab9102bc450",
    blockNumber: 894103,
    deltaMs: 914,
    details: "react() ingested log. Dispatched requestCallbackV_1_0() via CometBFT engine",
    timestamp: "12:04:19.124",
  },
  {
    id: "init-4",
    type: "CALLBACK_EXECUTED",
    chain: "Base Sepolia (84532)",
    txHash: "0x77c22904b78fa0991e0a81123490fd39801be9aa812f8650e489012356ff9981",
    blockNumber: 22849109,
    deltaMs: 1395,
    details: "OmniCircuitCallback::emergencyTrip() authenticated & executed. Pool FROZEN.",
    timestamp: "12:04:19.605",
  },
];
