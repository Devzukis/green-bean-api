import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('check/:tokenId')
  findOne(@Param('tokenId') tokenId: string) {
    return this.appService.checkAzuki(parseInt(tokenId));
  }

  @Get('unclaimed')
  getUnclaimed() {
    return this.appService.getUnclaimed();
  }
}
