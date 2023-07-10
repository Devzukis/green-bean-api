import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { GetRecentClaimsDto } from './dto';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('v1/check/:tokenId')
  findOneAzuki(@Param('tokenId') tokenId: string) {
    return this.appService.getAzukiDetails(parseInt(tokenId));
  }

  @Get('v1/can-claim')
  getAzukisThatCanClaim() {
    return this.appService.getAllCanClaimAzukis();
  }

  @Get('/v1/recent-claims')
  getAzukisThatClaimed(@Query() query: GetRecentClaimsDto) {
    return this.appService.getRecentClaims(query.take, query.skip);
  }
}
