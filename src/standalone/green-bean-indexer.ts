// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import { NestFactory } from '@nestjs/core';
import { AlchemySubscription } from 'alchemy-sdk';
import { decodeFunctionData } from 'viem';
import * as dayjs from 'dayjs';
import { AppModule } from '../app.module';
import { GREEN_BEAN_ADDRESS } from '../constants';
import { greenBeanAbi } from '../abis/green-bean-abi';
import { GreenBeanService } from '../services/green-bean.service';
import { alchemy } from '../utils/alchemy';

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

async function bootstrap() {
  console.log('starting GreenBean indexer');
  const app = await NestFactory.createApplicationContext(AppModule);
  const greenBeanService = app.get(GreenBeanService);

  alchemy.ws.on(
    {
      method: AlchemySubscription.MINED_TRANSACTIONS,
      addresses: [{ to: GREEN_BEAN_ADDRESS }],
    },
    async (tx: AlchemyTransaction) => {
      try {
        console.log(JSON.stringify(tx));
        const value = decodeFunctionData({
          abi: greenBeanAbi,
          data: tx.transaction.input,
        });
        console.log(value);
        const block = await alchemy.core.getBlock(tx.transaction.blockNumber);
        console.log(JSON.stringify(block));
        if (value.functionName === 'claim') {
          const tokenIds = value.args[0];
          for (let i = 0; i < tokenIds.length; i++) {
            const tokenId = tokenIds[i];
            await greenBeanService.updateAzuki({
              tokenId: parseInt(BigInt(tokenId).toString()),
              canClaim: false,
              claimedAt: dayjs.unix(block.timestamp).toISOString(),
              txHashClaimed: tx.transaction.hash,
              blockClaimed: tx.transaction.blockNumber,
            });
            console.log(`tokenId: ${tokenId} claimed a GreenBean`);
          }
        }
      } catch (err) {
        console.error(err);
      }
    },
  );
}

bootstrap();
