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
import { getAddress } from '../../api-lib/gql/queries';

// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  apiKey: process.env.ALCHEMY_NFT_API_KEY ?? '', // Replace with your Alchemy API Key.
  network: Network.ETH_MAINNET, // Replace with your network.
};

const alchemy = new Alchemy(settings);

export const getNFTs = async (profileId: number) => {
  let count = 0;
  const address = await getAddress(profileId);
  let page = await loadPage(address);
  await insertPageOfNFTs(profileId, page);
  count += page.ownedNfts.length;
  // page.
  for (
    let pageKey = page.pageKey;
    pageKey !== undefined;
    pageKey = page.pageKey
  ) {
    page = await loadPage(address, pageKey);
    await insertPageOfNFTs(profileId, page);
    count += page.ownedNfts.length;
  }
  // eslint-disable-next-line no-console
  console.log({ count });
};

const loadPage = async (address: string, pageKey?: string) => {
  return await alchemy.nft.getNftsForOwner(address, {
    excludeFilters: [NftFilters.SPAM],
    orderBy: NftOrdering.TRANSFERTIME,
    omitMetadata: false,
    pageKey,
  });
};

const insertPageOfNFTs = async (profileId: number, nfts: OwnedNftsResponse) => {
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
      address: nft.contract.address,
      name: name,
      banner_image_url: nft.collection?.bannerImageUrl,
      slug: nft.collection?.slug,
      external_url: nft.collection?.externalUrl,
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
            contract: n.contract.address,
            profile_id: profileId,
            name: n.name,
            image_url: n.image.cachedUrl,
            token_id: n.tokenId,
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
