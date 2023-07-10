import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getAllCanClaimAzukis() {
    return await this.prisma.azuki.findMany({
      where: { canClaim: true },
      select: { tokenId: true, thumbnailUrl: true },
      orderBy: { tokenId: 'asc' },
    });
  }

  async getAzukiDetails(tokenId: number) {
    return await this.prisma.azuki.findUnique({
      where: { tokenId },
      select: { canClaim: true, thumbnailUrl: true },
    });
  }
}
