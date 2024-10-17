import assert from 'assert';

import { Alchemy, Network } from 'alchemy-sdk';

import {
  nft_collections_constraint,
  nft_holdings_constraint,
} from '../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../api-lib/gql/adminClient';
import { BE_ALCHEMY_API_KEY } from '../config';

const nftChains = [
  {
    chainId: 1,
    alchemy: new Alchemy({
      apiKey: BE_ALCHEMY_API_KEY,
      network: Network.ETH_MAINNET,
    }),
  },
];

/*
 * Given a NFT contract address, and a chain on which it resides, sync all owners into our nft_collections and nft_holdings tables.
 */
export const updateNFTOwners = async (
  nftContractAddress: string,
  nftContractName: string,
  chainId: number
) => {
  const alchemy = nftChains.find(c => c.chainId === chainId)?.alchemy;
  assert(alchemy, `No alchemy for chain ${chainId}`);
  // fetch nft holdings from alchemy

  // TODO: handle pagination
  const { owners, pageKey } = await alchemy.nft.getOwnersForContract(
    nftContractAddress,
    {
      withTokenBalances: true,
      // pageKey,
    }
  );

  if (pageKey) {
    console.error('pagination needed!!');
  }

  // eslint-disable-next-line no-console
  console.log({ ownerLength: owners.length, pageKey });

  if (owners.length > 0) {
    const contract = {
      address: nftContractAddress.toLowerCase(),
      chain_id: chainId,
      name: nftContractName,
    };

    await adminClient.mutate(
      {
        insert_nft_collections: [
          {
            objects: [contract],
            on_conflict: {
              constraint: nft_collections_constraint.nft_collections_pkey,
              update_columns: [],
            },
          },
          {
            __typename: true,
          },
        ],
      },
      {
        operationName: 'insertNftCollection',
      }
    );

    // insert the owners
    await adminClient.mutate(
      {
        insert_nft_holdings: [
          {
            objects: owners.map(o => ({
              contract: nftContractAddress.toLowerCase(),
              address: o.ownerAddress.toLowerCase(),
              // name: o.name,
              // image_url: o.image.cachedUrl,
              token_id: o.tokenBalances[0].tokenId, // only handle first tokenId
              chain_id: contract.chain_id,
            })),
            on_conflict: {
              constraint: nft_holdings_constraint.nft_holdings_pkey,
              update_columns: [],
            },
          },
          { __typename: true },
        ],
      },
      {
        operationName: 'insertNfts',
      }
    );
  }
};
