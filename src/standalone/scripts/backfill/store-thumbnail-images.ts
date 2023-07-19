import { NestFactory } from '@nestjs/core';
import { NftTokenType } from 'alchemy-sdk';
import { AppModule } from '../../../app.module';
import { GreenBeanService } from '../../../services/green-bean.service';
import { alchemy } from '../../../utils/alchemy';
import { AZUKI_CONTRACT_ADDRESS } from '../../../constants';

// store the thumbnail images for all Azukis
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const greenBeanService = app.get(GreenBeanService);
  for (let i = 0; i < 10000; i++) {
    const data = await alchemy.nft.getNftMetadata(AZUKI_CONTRACT_ADDRESS, i, {
      tokenType: NftTokenType.ERC721,
    });
    const thumbnailUrl = data.media[0].thumbnail;
    await greenBeanService.updateAzuki({
      tokenId: i,
      thumbnailUrl: data.media[0].thumbnail,
    });
    console.log(`${i}: ${thumbnailUrl}`);
  }
  await app.close();
}

bootstrap();
