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
  selfIdProfile: SelfIdProfileWithAccounts | null
) => {
  if (!selfIdProfile) return baseProfile;

  return {
    ...baseProfile,
    background:
      baseProfile.background || getSelfIdImageUrl(selfIdProfile.background),
    avatar: baseProfile.avatar || getSelfIdImageUrl(selfIdProfile.image),
    website: baseProfile.website || selfIdProfile.url,
    bio: baseProfile.bio || selfIdProfile.description,
    twitter_username:
      baseProfile.twitter_username || selfIdProfile.twitter_username,
    github_username:
      baseProfile.github_username || selfIdProfile.github_username,
  };
};

export type SelfIdProfileWithAccounts = BasicProfile & {
  github_username?: string;
  twitter_username?: string;
};

export const getSelfIdProfile = async (
  address: string
): Promise<SelfIdProfileWithAccounts | null> => {
  try {
    const basicProfile = await getSelfIdCore().get(
      'basicProfile',
      addressToCaip10String(address)
    );
    const alsoKnownAs = await getSelfIdCore().get<'alsoKnownAs'>(
      'alsoKnownAs',
      addressToCaip10String(address)
    );
    if (!alsoKnownAs?.accounts) return basicProfile;

    return {
      ...basicProfile,
      github_username: alsoKnownAs.accounts.find(
        acc => acc.host === 'github.com'
      )?.id,
      twitter_username: alsoKnownAs.accounts.find(
        acc => acc.host === 'twitter.com'
      )?.id,
    };
  } catch (e) {
    return null;
  }
};
