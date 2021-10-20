import { BasicProfile, ImageSources } from '@datamodels/identity-profile-basic';

import { networkIds } from '../config/networks';
import { getSelfIdCore } from '../services/selfid';
import { IProfileEmbed } from '../types';

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

export const mergeSelfIdProfileInfo = (
  baseProfile: IProfileEmbed,
  selfIdProfile: BasicProfile | null
) => {
  if (!selfIdProfile) return baseProfile;

  return {
    ...baseProfile,
    background:
      baseProfile.background || getSelfIdImageUrl(selfIdProfile.background),
    avatar: baseProfile.avatar || getSelfIdImageUrl(selfIdProfile.image),
    website: baseProfile.website || selfIdProfile.url,
    bio: baseProfile.bio || selfIdProfile.description,
  };
};

export const getSelfIdProfile = async (address: string) => {
  try {
    return await getSelfIdCore().get(
      'basicProfile',
      addressToCaip10String(address)
    );
  } catch (e) {
    return null;
  }
};
