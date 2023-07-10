import { createPublicClient, http } from 'viem';
import type { PublicClient } from 'viem';
import { mainnet } from 'viem/chains';

export const client: PublicClient = createPublicClient({
  chain: mainnet,
  transport: http(
    `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
  ),
});
