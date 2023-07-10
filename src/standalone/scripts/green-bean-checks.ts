import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { GreenBeanService } from '../../services/green-bean.service';

// Initialize the db with canClaim statuses for all Azukis
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const greenBeanService = app.get(GreenBeanService);
  for (let i = 0; i < 10000; i++) {
    const canClaimStatus = await greenBeanService.checkGreenBean(i);
    await greenBeanService.createAzuki({
      tokenId: i,
      canClaim: canClaimStatus,
    });
    console.log(`${i}: ${canClaimStatus}`);
  }
  await app.close();
}

bootstrap();
