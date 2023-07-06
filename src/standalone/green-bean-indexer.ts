// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import { NestFactory } from '@nestjs/core';
import { Alchemy, AlchemySubscription, Network } from 'alchemy-sdk';
import { decodeFunctionData } from 'viem';
import { AppModule } from '../app.module';
import { GREEN_BEAN_ADDRESS } from '../services/green-bean.service';
import { greenBeanAbi } from '../abis/green-bean-abi';
import { GreenBeanService } from '../services/green-bean.service';

type AlchemyTransaction = {
  removed: boolean;
  transaction: {
    blockHash: string;
    blockNumber: string;
    from: string;
    gas: string;
    gasPrice: string;
    maxFeePerGas: string;
    maxPriorityFeePerGas: string;
    hash: string;
    input: `0x${string}`;
    nonce: string;
    to: string;
    transactionIndex: string;
    value: string;
    type: string;
    accessList: any[];
    chainId: string;
    v: string;
    r: string;
    s: string;
  };
};

const alchemy = new Alchemy({
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
});

async function bootstrap() {
  console.log('starting GreenBean indexer');
  const app = await NestFactory.createApplicationContext(AppModule);
  const greenBeanService = app.get(GreenBeanService);

  alchemy.ws.on(
    {
      method: AlchemySubscription.MINED_TRANSACTIONS,
      addresses: [{ to: GREEN_BEAN_ADDRESS }],
    },
    (tx: AlchemyTransaction) => {
      try {
        console.log(JSON.stringify(tx));
        const value = decodeFunctionData({
          abi: greenBeanAbi,
          data: tx.transaction.input,
        });
        console.log(value);
        if (value.functionName === 'claim') {
          for (const tokenId in value.args) {
            console.log(tokenId);
            greenBeanService.updateAzuki({
              tokenId: parseInt(tokenId),
              canClaim: false,
            });
          }
        }
      } catch (err) {
        console.error(err);
      }
    },
  );
}

bootstrap();
