import {
  Alchemy,
  Network,
  NftFilters,
  NftOrdering,
  OwnedNft,
} from 'alchemy-sdk';

import {
  nft_collections_constraint,
  nft_holdings_constraint,
  ValueTypes,
} from '../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../api-lib/gql/adminClient';
import { getProvider } from '../../api-lib/provider';
import { Contracts } from '../../src/features/cosoul/contracts';

const nftChains = [
  {
    chainId: 1,
    alchemy: new Alchemy({
      apiKey: process.env.ALCHEMY_NFT_API_KEY_ETH ?? '',
      network: Network.ETH_MAINNET,
    }),
  },
  {
    chainId: 10,
    alchemy: new Alchemy({
      apiKey: process.env.ALCHEMY_NFT_API_KEY_OPT ?? '',
      network: Network.OPT_MAINNET,
    }),
  },
];

export const updateProfileNFTs = async (address: string) => {
  await Promise.all(
    nftChains.map(c => updateProfileNFTsOneChain(c.alchemy, c.chainId, address))
  );
};

const updateProfileNFTsOneChain = async (
  alchemy: Alchemy,
  chainId: number,
  address: string
) => {
  let coSoulContract: string | undefined;
  try {
    const provider = getProvider(chainId);
    const contracts = new Contracts(chainId, provider, true);
    if (contracts.cosoul !== undefined) {
      coSoulContract = contracts.cosoul.address.toLowerCase();
    }
  } catch {
    // ignore, no cosoul on this chain or something
  }

  // Optional Config object, but defaults to demo api-key and eth-mainnet.
  let count = 0;
  let page = await loadPage(alchemy, address);

  // filter out the cosoul contract
  const nfts = page.ownedNfts.filter(
    n => !coSoulContract || n.contract.address.toLowerCase() !== coSoulContract
  );

  await insertPageOfNFTs(address, nfts, chainId);
  count += page.ownedNfts.length;
  // page.
  for (
    let pageKey = page.pageKey;
    pageKey !== undefined;
    pageKey = page.pageKey
  ) {
    page = await loadPage(alchemy, address, pageKey);
    const nfts = page.ownedNfts.filter(
      n =>
        !coSoulContract || n.contract.address.toLowerCase() !== coSoulContract
    );
    await insertPageOfNFTs(address, nfts, chainId);
    count += page.ownedNfts.length;
  }
  // eslint-disable-next-line no-console
  console.log(`${count} NFTs on chain ${chainId} for ${address}`);
  return count;
};

const loadPage = async (
  alchemy: Alchemy,
  address: string,
  pageKey?: string
) => {
  return await alchemy.nft.getNftsForOwner(address, {
    excludeFilters: [NftFilters.SPAM],
    orderBy: NftOrdering.TRANSFERTIME,
    omitMetadata: false,
    pageKey,
  });
};

const insertPageOfNFTs = async (
  address: string,
  nfts: OwnedNft[],
  chainId: number
) => {
  // ensure the contracts are there
  const contracts: Record<string, ValueTypes['nft_collections_insert_input']> =
    {};
  for (const nft of nfts) {
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

  await adminClient.mutate(
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
          objects: nfts.map(n => ({
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
