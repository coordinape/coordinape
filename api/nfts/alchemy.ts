import {
  Alchemy,
  Network,
  NftFilters,
  NftOrdering,
  OwnedNftsResponse,
} from 'alchemy-sdk';

import {
  nft_collections_constraint,
  nft_holdings_constraint,
  ValueTypes,
} from '../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../api-lib/gql/adminClient';

// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  apiKey: process.env.ALCHEMY_NFT_API_KEY ?? '', // Replace with your Alchemy API Key.
  network: Network.ETH_MAINNET, // Replace with your network.
};

const alchemy = new Alchemy(settings);

export const updateProfileNFTs = async (address: string) => {
  let count = 0;
  const chainId = 1;
  let page = await loadPage(address);
  await insertPageOfNFTs(address, page, chainId);
  count += page.ownedNfts.length;
  // page.
  for (
    let pageKey = page.pageKey;
    pageKey !== undefined;
    pageKey = page.pageKey
  ) {
    page = await loadPage(address, pageKey);
    await insertPageOfNFTs(address, page, chainId);
    count += page.ownedNfts.length;
  }
  return count;
};

const loadPage = async (address: string, pageKey?: string) => {
  return await alchemy.nft.getNftsForOwner(address, {
    excludeFilters: [NftFilters.SPAM],
    orderBy: NftOrdering.TRANSFERTIME,
    omitMetadata: false,
    pageKey,
  });
};

const insertPageOfNFTs = async (
  address: string,
  nfts: OwnedNftsResponse,
  chainId: number
) => {
  // ensure the contracts are there
  const contracts: Record<string, ValueTypes['nft_collections_insert_input']> =
    {};
  for (const nft of nfts.ownedNfts) {
    let name = nft.contract.name;
    if (!name) {
      name = nft.collection?.name;
    }
    if (!name) {
      name = 'Unknown Collection';
    }
    contracts[nft.contract.address] = {
      address: nft.contract.address.toLowerCase(),
      name: name,
      banner_image_url: nft.collection?.bannerImageUrl,
      slug: nft.collection?.slug,
      external_url: nft.collection?.externalUrl,
      chain_id: chainId,
    };
  }

  adminClient.mutate(
    {
      insert_nft_collections: [
        {
          objects: Object.values(contracts),
          on_conflict: {
            constraint: nft_collections_constraint.nft_collections_pkey,
            update_columns: [],
          },
        },
        {
          __typename: true,
        },
      ],
      insert_nft_holdings: [
        {
          objects: nfts.ownedNfts.map(n => ({
            contract: n.contract.address.toLowerCase(),
            address: address.toLowerCase(),
            name: n.name,
            image_url: n.image.cachedUrl,
            token_id: n.tokenId,
            chain_id: chainId,
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
      operationName: 'insertNftAndCollection',
    }
  );
};
