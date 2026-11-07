const { createPublicClient, createWalletClient, http, formatEther, parseEther } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');
const OriginPoolArt = require('../src/contracts/OriginPool.json');

const BASE_SEPOLIA_RPC = process.env.BASE_SEPOLIA_RPC || 'https://sepolia.base.org';

async function main() {
  const privateKey = process.env.PRIVATE_KEY;
  const poolAddress = process.env.POOL_ADDRESS;

  if (!privateKey || !poolAddress) {
    console.log('Simulation trigger helper.');
    console.log('Usage: PRIVATE_KEY=0x... POOL_ADDRESS=0x... DUMP_ETH=35 node scripts/trigger-simulation.js');
    return;
  }

  const account = privateKeyToAccount(privateKey);
  const client = createPublicClient({ transport: http(BASE_SEPOLIA_RPC) });
  const wallet = createWalletClient({ account, transport: http(BASE_SEPOLIA_RPC) });

  const dumpEth = process.env.DUMP_ETH || '35';
  console.log(`Executing swap of ${dumpEth} ETH on pool ${poolAddress}...`);

  const tx = await wallet.writeContract({
    address: poolAddress,
    abi: OriginPoolArt.abi,
    functionName: 'swap',
    args: [false, parseEther(dumpEth)], // isBuyA = false (dump Token A)
  });

  console.log(`Swap Tx Hash: ${tx}`);
  const receipt = await client.waitForTransactionReceipt({ hash: tx });
  console.log(`Swap Confirmed in block #${receipt.blockNumber}. Status: ${receipt.status}`);
}

main().catch(console.error);
