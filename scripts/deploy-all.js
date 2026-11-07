const { createWalletClient, createPublicClient, http, parseEther, formatEther } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');
const fs = require('fs');
const path = require('path');

const OriginPoolArt = require('../src/contracts/OriginPool.json');
const OmniCircuitReactiveArt = require('../src/contracts/OmniCircuitReactive.json');
const OmniCircuitCallbackArt = require('../src/contracts/OmniCircuitCallback.json');

// Networks
const BASE_SEPOLIA_CHAIN_ID = 84532;
const BASE_SEPOLIA_RPC = process.env.BASE_SEPOLIA_RPC || 'https://sepolia.base.org';
const BASE_CALLBACK_PROXY = '0x476F44b11F5C942c58f4c8E3d0300E5710743585';

const LASNA_CHAIN_ID = 5318007;
const LASNA_RPC = process.env.LASNA_RPC || 'https://lasna-rpc.rnk.dev/';
const LASNA_SYSTEM_ADDR = '0x8888888888888888888888888888888888888888';

async function main() {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    console.error('Error: PRIVATE_KEY environment variable not set.');
    console.log('Usage: PRIVATE_KEY=0x... node scripts/deploy-all.js');
    process.exit(1);
  }

  const account = privateKeyToAccount(privateKey.startsWith('0x') ? privateKey : '0x' + privateKey);
  console.log(`Deployer Address: ${account.address}`);

  const basePublic = createPublicClient({
    transport: http(BASE_SEPOLIA_RPC),
  });
  const baseWallet = createWalletClient({
    account,
    transport: http(BASE_SEPOLIA_RPC),
  });

  const lasnaPublic = createPublicClient({
    transport: http(LASNA_RPC),
  });
  const lasnaWallet = createWalletClient({
    account,
    transport: http(LASNA_RPC),
  });

  // Check balances
  const baseBal = await basePublic.getBalance({ address: account.address });
  const lasnaBal = await lasnaPublic.getBalance({ address: account.address });
  console.log(`Base Sepolia Balance: ${formatEther(baseBal)} ETH`);
  console.log(`Reactive Lasna Balance: ${formatEther(lasnaBal)} REACT`);

  if (baseBal === 0n) {
    console.warn('Warning: Base Sepolia balance is 0. Deployment requires testnet ETH.');
  }

  // 1. Deploy OriginPool on Base Sepolia
  console.log('\n--- Deploying OriginPool on Base Sepolia ---');
  const originTx = await baseWallet.deployContract({
    abi: OriginPoolArt.abi,
    bytecode: OriginPoolArt.bytecode,
  });
  console.log(`OriginPool Deploy Tx: ${originTx}`);
  const originReceipt = await basePublic.waitForTransactionReceipt({ hash: originTx });
  const originPoolAddress = originReceipt.contractAddress;
  console.log(`OriginPool Deployed to: ${originPoolAddress}`);

  // Topic0 of EmergencyAnomalyDetected
  // event EmergencyAnomalyDetected(address indexed pool, uint256 priceDropBps, uint256 currentReserveA, uint256 currentReserveB, uint256 timestamp)
  const { toEventHash } = require('viem');
  const emergencyTopic0 = '0x' + require('crypto').createHash('sha3-256') // or use keccak256
  // We can calculate via keccak256
  const { keccak256, toHex } = require('viem');
  const topic0 = keccak256(toHex('EmergencyAnomalyDetected(address,uint256,uint256,uint256,uint256)'));
  console.log(`Subscribed Topic0: ${topic0}`);

  console.log('\n--- Deployment Preparation Completed ---');
  console.log('Next steps: Deploy Callback and Reactive contracts once funded.');
}

if (require.main === module) {
  main().catch(console.error);
}
