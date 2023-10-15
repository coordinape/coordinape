import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ethers } from 'ethers';

import { key_tx_constraint } from '../../../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../../../api-lib/gql/adminClient';
import { getInput } from '../../../../api-lib/handlerHelpers';
import { errorResponse } from '../../../../api-lib/HttpError';
import { getProvider } from '../../../../api-lib/provider';
import { chain } from '../../../../src/features/cosoul/chains';
import { getSoulKeysContract } from '../../../../src/features/soulkeys/api/soulkeys';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await getInput(req);

    const provider = getProvider(Number(chain.chainId));

    const soulKeys = getSoulKeysContract();
    const tradeSig =
      'Trade(address,address,bool,uint256,uint256,uint256,uint256,uint256)';
    const tradeTopic: string = ethers.utils.id(tradeSig);

    // Get 10 blocks worth of key transactions and put them all in the db
    const currentBlock = await provider.getBlockNumber();
    const rawLogs = await provider.getLogs({
      address: soulKeys.address,
      topics: [tradeTopic],
      fromBlock: currentBlock - 10,
      toBlock: currentBlock,
    });

    for (const log of rawLogs) {
      const trade = soulKeys.interface.decodeEventLog(tradeSig, log.data);

      const {
        trader,
        subject,
        isBuy,
        shareAmount,
        ethAmount,
        protocolEthAmount,
        subjectEthAmount,
        supply,
      } = trade;

      await adminClient.mutate(
        {
          insert_key_tx_one: [
            {
              object: {
                tx_hash: log.transactionHash.toLowerCase(),
                trader: trader.toLowerCase(),
                subject: subject.toLowerCase(),
                buy: isBuy,
                share_amount: shareAmount.toNumber(),
                eth_amount: ethAmount.toNumber(),
                protocol_fee_amount: protocolEthAmount.toNumber(),
                subject_fee_amount: subjectEthAmount.toNumber(),
                supply: supply.toNumber(),
              },
              on_conflict: {
                constraint: key_tx_constraint.key_tx_pkey,
                update_columns: [], // ignore if we already got it
              },
            },
            {
              __typename: true,
            },
          ],
        },
        {
          operationName: 'syncKeys__insert_key_tx_one',
        }
      );
    }

    return res.status(200).json({ success: true });
  } catch (e: any) {
    return errorResponse(res, e);
  }
}
