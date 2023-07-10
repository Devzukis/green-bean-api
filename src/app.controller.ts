import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

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
}
