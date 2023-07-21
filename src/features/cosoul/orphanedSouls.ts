// This script demonstrates access to the NFT API via the Alchemy SDK.
import assert from 'assert';

import { AddressZero } from '@ethersproject/constants';
import { Alchemy, Network } from 'alchemy-sdk';
import { errors } from 'ethers';

import { adminClient } from '../../../api-lib/gql/adminClient';
import { getProvider } from '../../../api-lib/provider';

import { Contracts } from './contracts';

// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  apiKey: 'LTZjgQ8KRrcQJNu9TTOk_Io2uRvWjmtc', // Replace with your Alchemy API Key.
  network: Network.OPT_MAINNET, // Replace with your network.
};

const alchemy = new Alchemy(settings);

const chainId = 10; //Number(chain.chainId);
const provider = getProvider(chainId);
const contracts = new Contracts(chainId, provider, true);

export const saveAllSouls = async () => {
  const highestTokenId = await getHighestTokenId();
  assert(highestTokenId);
  for (let i = 2892; i <= highestTokenId; i++) {
    const errors = [];
    try {
      await saveSoul(i);
    } catch (e) {
      console.log(e);
      errors.push({ tokenId: i, error: e });
    }
  }
  console.log(errors);
};

const getHighestTokenId = async () => {
  const { cosouls_aggregate } = await adminClient.query(
    {
      cosouls_aggregate: [
        {
          where: {
            token_id: {
              _is_null: false,
            },
          },
        },
        {
          aggregate: {
            max: {
              token_id: true,
            },
          },
        },
      ],
    },
    {
      operationName: 'getHighestTokenId',
    }
  );
  return cosouls_aggregate?.aggregate?.max?.token_id;
};
export const saveSoul = async (tokenId: number) => {
  // eslint-disable-next-line no-console
  console.log('saving soul: ' + tokenId);

  // check if the token exists in DB
  const exists = await coSoulExistsInDb(tokenId);
  if (exists) {
    console.log('soul already exists in DB: ' + tokenId);
    return;
  }

  // get the token metadata from the chain
  const owner = await findCoSoulOwner(tokenId);
  if (!owner) {
    // eslint-disable-next-line no-console
    console.log('soul not found on chain: ' + tokenId);
    return;
  }

  if (owner == AddressZero) {
    // eslint-disable-next-line no-console
    console.log('soul is burned for token: ' + tokenId);
    return;
  }

  const alreadyHasCoSoul = await addressAlreadyHasCoSoul(owner);
  if (alreadyHasCoSoul) {
    // eslint-disable-next-line no-console
    console.log('address already has a soul: ' + owner);
    return;
  }

  // insert the token into the database
  await insertCoSoul(tokenId, owner);

  // eslint-disable-next-line no-console
  console.log('soul saved: ' + tokenId);
  return true;
};
const findCoSoulOwner = async (tokenId: number) => {
  const response = await alchemy.nft.getOwnersForNft(
    contracts.cosoul.address,
    tokenId,
    {}
  );
  return response.owners.pop();
};

const coSoulExistsInDb = async (tokenId: number) => {
  const { cosouls } = await adminClient.query(
    {
      cosouls: [
        {
          where: {
            token_id: {
              _eq: tokenId,
            },
          },
        },
        {
          id: true,
        },
      ],
    },
    {
      operationName: 'coSoulExists',
    }
  );
  return !!cosouls.pop();
};

const addressAlreadyHasCoSoul = async (address: string) => {
  const { cosouls } = await adminClient.query(
    {
      cosouls: [
        {
          where: {
            profile: {
              address: {
                _ilike: address,
              },
            },
          },
        },
        {
          id: true,
        },
      ],
    },
    {
      operationName: 'coSoulExists',
    }
  );
  return !!cosouls.pop();
};

const insertCoSoul = async (tokenId: number, address: string) => {
  const { profiles } = await adminClient.query(
    {
      profiles: [
        {
          where: {
            address: {
              _ilike: address,
            },
          },
        },
        {
          id: true,
        },
      ],
    },
    {
      operationName: 'insertOrphanedCoSoul',
    }
  );

  const profile = profiles.pop();
  if (!profile) {
    console.log('cant save soul because profile doesnt exist', address);
    return;
  }

  return adminClient.mutate(
    {
      insert_cosouls_one: [
        {
          object: {
            token_id: tokenId,
            // FIXME: we don't know the TX hash, maybe we could fix these up later somehow
            created_tx_hash: AddressZero,
            profile_id: profile.id,
          },
        },
        {
          __typename: true,
        },
      ],
    },
    {
      operationName: 'insertOrphanedCoSoul',
    }
  );
};
