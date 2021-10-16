import { ImageSources } from '@datamodels/identity-profile-basic';

import { networkIds } from '../config/networks';

export const addressToCaip10String = (
  address: string,
  chainId: number = networkIds.MAINNET
) => `${address}@eip155:${chainId}`;

export const getIpfsUrl = (
  hash: string,
  ipfsEndpoint = 'https://gateway.ipfs.io'
): string => `${ipfsEndpoint}/ipfs/${hash.slice(7)}`;

export const getSelfIdImageUrl = (
  image: ImageSources | undefined,
  ipfsEndpoint?: string
): string =>
  image?.original?.src ? getIpfsUrl(image.original.src, ipfsEndpoint) : '';
