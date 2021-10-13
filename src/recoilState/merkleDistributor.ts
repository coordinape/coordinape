import {
  MerkleDistributorInfo,
  parseBalanceMap,
} from 'helpers/merkle-distributor/parse-balance-map';
import { selectorFamily } from 'recoil';

import { rReceivedGiftsByUser } from './receivedGiftsByUser';

import { IRecoilGetParams } from 'types';

export const rMerkleDistributor = selectorFamily<
  MerkleDistributorInfo | undefined,
  number
>({
  key: 'rReceivedGiftsByUser',
  get: (epochId: number) => ({ get }: IRecoilGetParams) => {
    const receivedGiftsByUser = get(rReceivedGiftsByUser(epochId));
    if (Object.keys(receivedGiftsByUser).length !== 0) {
      return parseBalanceMap(receivedGiftsByUser);
    }
  },
});
