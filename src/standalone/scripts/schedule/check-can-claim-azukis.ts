import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../../app.module';
import { GreenBeanService } from '../../../services/green-bean.service';

// The intention for this script is to be run on a schedule, to check if there are any azukis that have claimed their green beans via a smart contract
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const greenBeanService = app.get(GreenBeanService);

  const canClaimAzukis = await greenBeanService.getAzukis({ canClaim: true });
  await app.close();

  for (let i = 0; i < canClaimAzukis.length; i++) {
    const azuki = canClaimAzukis[i];

    const canClaimStatus = await greenBeanService.checkGreenBean(azuki.tokenId);
    console.log(`${i}: ${azuki.tokenId} - ${canClaimStatus}`);

    if (!canClaimStatus) {
      await greenBeanService.updateAzuki({
        tokenId: azuki.tokenId,
        canClaim: false,
      });
      console.log(`Updated ${azuki.tokenId} with canClaim: false`);
    }
  }
}

bootstrap();
