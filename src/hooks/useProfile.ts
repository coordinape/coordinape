import { useEffect } from 'react';

import { useRecoilState } from 'recoil';

import { rProfileRaw } from 'recoilState';
import { getApiService } from 'services/api';
import { getAvatarPath } from 'utils/domain';
import { updaterMergeItemToAddressMap } from 'utils/recoilHelpers';

import { useAsyncLoadCatch } from './useAsyncLoadCatch';
import { useRecoilFetcher } from './useRecoilFetcher';

import { IApiFilledProfile, PostProfileParam } from 'types';

export const useProfile = (
  address?: string
): {
  profile: IApiFilledProfile | undefined;
  avatarPath: string;
  backgroundPath: string;
  updateProfile: (params: PostProfileParam) => Promise<IApiFilledProfile>;
} => {
  const callWithLoadCatch = useAsyncLoadCatch();

  const [profileMap, setProfileMap] = useRecoilState(rProfileRaw);

  const profile = address ? profileMap.get(address) : undefined;

  const fetchProfile = useRecoilFetcher(
    'rProfileRaw',
    rProfileRaw,
    updaterMergeItemToAddressMap
  );

  useEffect(() => {
    if (address) {
      // Fetcher only makes an API call if it is a new address or time elapsed.
      fetchProfile(getApiService().getProfile, [address]).then(([commit]) =>
        commit()
      );
    }
  }, [address, fetchProfile]);

  // Unused currently, could be deleted? See useMe for updating self.
  const updateProfile = async (params: PostProfileParam) =>
    callWithLoadCatch(async () => {
      if (!address) {
        throw 'Need address to call updateProfile with';
      }
      const result = await getApiService().updateProfile(address, params);
      setProfileMap((oldMap) => new Map(oldMap.set(address, result)));
      return result;
    });

  return {
    profile,
    updateProfile,
    avatarPath: getAvatarPath(profile?.avatar),
    backgroundPath: getAvatarPath(
      profile?.background,
      '/imgs/background/profile-bg.jpg'
    ),
  };
};
