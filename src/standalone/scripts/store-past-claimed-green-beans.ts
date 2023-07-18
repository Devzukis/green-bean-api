import { NestFactory } from '@nestjs/core';
import { decodeFunctionData } from 'viem';
import * as dayjs from 'dayjs';
import { AppModule } from '../../app.module';
import { GREEN_BEAN_ADDRESS } from '../../constants';
import { client } from '../../utils/client';
import { greenBeanAbi } from '../../abis/green-bean-abi';
import { GreenBeanService } from '../../services/green-bean.service';

// store the thumbnail images for all Azukis
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const greenBeanService = app.get(GreenBeanService);
  const logs = await client.getLogs({
    address: GREEN_BEAN_ADDRESS,
    event: {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'operator',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'from',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'to',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'id',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'value',
          type: 'uint256',
        },
      ],
      name: 'TransferSingle',
      type: 'event',
    },
    args: {
      from: '0x0000000000000000000000000000000000000000',
    },
    fromBlock: BigInt(17601933),
    toBlock: BigInt(17653586),
  });
  for (let i = 0; i < logs.length; i++) {
    const log = logs[i];
    const { transactionHash, blockNumber } = log;
    console.log(transactionHash);
    const [transaction, block] = await Promise.all([
      client.getTransaction({
        hash: transactionHash,
      }),
      client.getBlock({ blockNumber }),
    ]);
    const timestamp = parseInt(block.timestamp.toString());
    try {
      const value = decodeFunctionData({
        abi: greenBeanAbi,
        data: transaction.input,
      });
      console.log(value);

      if (value.functionName === 'claim') {
        const tokenIds = value.args[0];
        for (let i = 0; i < tokenIds.length; i++) {
          const tokenId = tokenIds[i];
          await greenBeanService.updateAzuki({
            tokenId: parseInt(BigInt(tokenId).toString()),
            canClaim: false,
            claimedAt: dayjs.unix(timestamp).toISOString(),
            txHashClaimed: transactionHash,
            blockClaimed: blockNumber.toString(),
          });
          console.log(`updated tokenId ${tokenId} claim data`);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
  await app.close();
}

bootstrap();
