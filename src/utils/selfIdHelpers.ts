import { ImageSources } from '@datamodels/identity-profile-basic';

import { networkIds } from 'config/networks';
import { getSelfIdCore } from 'services/selfid';

import { ISelfIdProfile } from 'types';

export const addressToCaip10String = (
  address: string,
  chainId: number = networkIds.MAINNET
) => `${address}@eip155:${chainId}`;

export const getIpfsUrl = (
  hash: string,
  ipfsEndpoint = 'https://gateway.ipfs.io'
): string => `${ipfsEndpoint}/ipfs/${hash.slice(7)}`;

export const getSelfIdImageUrl = (
  image?: ImageSources,
  ipfsEndpoint?: string
): string =>
  image?.original?.src ? getIpfsUrl(image.original.src, ipfsEndpoint) : '';

export const getSelfIdProfile = async (
  address: string
): Promise<ISelfIdProfile | undefined> => {
  try {
    const caipAddress = addressToCaip10String(address);
    const basicProfile = await getSelfIdCore().get('basicProfile', caipAddress);
    const alsoKnownAs = await getSelfIdCore().get<'alsoKnownAs'>(
      'alsoKnownAs',
      caipAddress
    );

    return {
      ...basicProfile,
      caipAddress,
      address,
      github_username: alsoKnownAs?.accounts?.find(
        acc => acc.host === 'github.com'
      )?.id,
      twitter_username: alsoKnownAs?.accounts?.find(
        acc => acc.host === 'twitter.com'
      )?.id,
    };
  } catch (e) {
    return;
  }
};

export const getSelfIdProfiles = async (addresses: string[]) => {
  return (await Promise.all(addresses.map(getSelfIdProfile))).filter(
    p => p
  ) as ISelfIdProfile[];
};
