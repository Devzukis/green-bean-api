// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import { NestFactory } from '@nestjs/core';
import { Alchemy, AlchemySubscription, Network } from 'alchemy-sdk';
import { decodeFunctionData } from 'viem';
import { AppModule } from '../app.module';
import { GREEN_BEAN_ADDRESS } from '../services/green-bean.service';
import { greenBeanAbi } from '../abis/green-bean-abi';

const alchemy = new Alchemy({
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
});

async function bootstrap() {
  console.log('starting GreenBean indexer');
  await NestFactory.createApplicationContext(AppModule);

  alchemy.ws.on(
    {
      method: AlchemySubscription.MINED_TRANSACTIONS,
      addresses: [{ to: GREEN_BEAN_ADDRESS }],
    },
    (tx) => {
      try {
        console.log(JSON.stringify(tx));
        const value = decodeFunctionData({
          abi: greenBeanAbi,
          data: tx.input as `0x${string}`,
        });
        console.log(value);
        if (value.functionName === 'claim') {
          for (const tokenId of value.args) {
            console.log(tokenId);
            this.greenBeanService.updateAzuki({ tokenId, canClaim: false });
          }
        }
      } catch (err) {
        console.error(err);
      }
    },
  );
}

bootstrap();
