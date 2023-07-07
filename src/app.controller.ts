import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // TODO: Deprecate
  @Get('check/:tokenId')
  findOne(@Param('tokenId') tokenId: string) {
    return this.appService.checkAzuki(parseInt(tokenId));
  }

  @Get('v1/check/:tokenId')
  findOneAzuki(@Param('tokenId') tokenId: string) {
    return this.appService.getAzukiDetails(parseInt(tokenId));
  }

  // TODO: Deprecate
  @Get('unclaimed')
  getUnclaimed() {
    return this.appService.getUnclaimed();
  }

  @Get('v1/can-claim')
  getAzukisThatCanClaim() {
    return this.appService.getAllCanClaimAzukis();
  }
}
