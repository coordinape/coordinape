import { HDNode } from '@ethersproject/hdnode';

import { adminClient } from '../../api-lib/gql/adminClient';
import { getAccountPath, SEED_PHRASE } from '../../scripts/util/eth';

export async function isAddressUnique(address: string): Promise<boolean> {
  const { profiles } = await adminClient.query(
    {
      profiles: [{ where: { address: { _ilike: address } } }, { id: true }],
    },
    { operationName: 'isAddressUnique' }
  );

  return profiles.length === 0;
}

export const getUniqueAddress = async () => {
  let i = 100;

  while (i > 0) {
    const randomInt = getRandomInt(999999999);
    const address = HDNode.fromMnemonic(SEED_PHRASE)
      .derivePath(getAccountPath(randomInt))
      .address.toLowerCase();

    if (await isAddressUnique(address)) {
      return address;
    }

    i--;
  }

  throw new Error(`Unable to generate a unique address, tried ${i}x`);
};

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}
