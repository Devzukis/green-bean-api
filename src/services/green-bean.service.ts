// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import { Injectable } from '@nestjs/common';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { greenBeanAbi } from '../abis/green-bean-abi';
import { PrismaService } from '../prisma.service';

export const GREEN_BEAN_ADDRESS = '0xdfaA1A2d917DF08eA9eAe22Fec2Dd729aA93f97b';

const client = createPublicClient({
  chain: mainnet,
  transport: http(
    `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
  ),
});

@Injectable()
export class GreenBeanService {
  constructor(private prisma: PrismaService) {}

  async checkGreenBean(tokenId: number) {
    const data = await client.readContract({
      address: GREEN_BEAN_ADDRESS,
      abi: greenBeanAbi,
      functionName: 'getCanClaims',
      args: [[BigInt(tokenId)]],
    });
    return data[0];
  }

  async createAzuki({
    tokenId,
    canClaim,
  }: {
    tokenId: number;
    canClaim: boolean;
  }) {
    return this.prisma.azuki.upsert({
      where: { tokenId },
      create: { tokenId, canClaim },
      update: { canClaim },
    });
  }

  async updateAzuki({
    tokenId,
    canClaim,
  }: {
    tokenId: number;
    canClaim: boolean;
  }) {
    return this.prisma.azuki.update({
      where: { tokenId },
      data: { canClaim },
    });
  }
}
