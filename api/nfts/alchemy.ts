import { Alchemy, Network, NftFilters, NftOrdering } from 'alchemy-sdk';

// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  apiKey: process.env.ALCHEMY_NFT_API_KEY ?? '', // Replace with your Alchemy API Key.
  network: Network.ETH_MAINNET, // Replace with your network.
};

const alchemy = new Alchemy(settings);

export const getNFTs = async () => {
  const nfts = await alchemy.nft.getNftsForOwner(
    '0xfaA806320CA25e7621690152fC83B4257AA197FF',
    {
      excludeFilters: [NftFilters.SPAM],
      orderBy: NftOrdering.TRANSFERTIME,
      omitMetadata: false,
    }
  );

  // eslint-disable-next-line no-console
  console.log(nfts.totalCount, nfts.ownedNfts);
};
