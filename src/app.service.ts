import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getUnclaimed() {
    const unclaimedAzukis = await this.prisma.azuki.findMany({
      where: { canClaim: true },
      select: { tokenId: true },
    });
    return { tokenIds: unclaimedAzukis.map((azuki) => azuki.tokenId) };
  }

  async checkAzuki(tokenId: number) {
    const data = await this.prisma.azuki.findUnique({
      where: { tokenId },
      select: { canClaim: true },
    });
    return { canClaim: data?.canClaim };
  }
}
