import { ImageSources } from '@datamodels/identity-profile-basic';

import { networkIds } from 'config/networks';
import { getSelfIdCore } from 'services/selfid';

import { IProfileEmbed, ISelfIdProfile } from 'types';

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

export const mergeSelfIdProfileInfo = (
  baseProfile: IProfileEmbed,
  selfIdProfile?: ISelfIdProfile
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
    p => !!p
  ) as ISelfIdProfile[];
};
