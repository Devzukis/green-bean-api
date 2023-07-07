import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getUnclaimed() {
    const unclaimedAzukis = await this.prisma.azuki.findMany({
      where: { canClaim: true },
      select: { tokenId: true },
      orderBy: { tokenId: 'asc' },
    });
    return { tokenIds: unclaimedAzukis.map((azuki) => azuki.tokenId) };
  }

  async getAllCanClaimAzukis() {
    return await this.prisma.azuki.findMany({
      where: { canClaim: true },
      select: { tokenId: true, thumbnailUrl: true },
      orderBy: { tokenId: 'asc' },
    });
  }

  async checkAzuki(tokenId: number) {
    const data = await this.prisma.azuki.findUnique({
      where: { tokenId },
      select: { canClaim: true },
    });
    return { canClaim: data?.canClaim };
  }

  async getAzukiDetails(tokenId: number) {
    return await this.prisma.azuki.findUnique({
      where: { tokenId },
      select: { canClaim: true, thumbnailUrl: true },
    });
  }
}
