// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { greenBeanAbi } from '../abis/green-bean-abi';
import { PrismaService } from '../prisma.service';
import { client } from '../utils/client';
import { GREEN_BEAN_ADDRESS } from '../constants';

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

  async updateAzuki(data: Prisma.AzukiUpdateInput) {
    const tokenId = data.tokenId as number;
    return this.prisma.azuki.update({
      where: { tokenId },
      data,
    });
  }
}
