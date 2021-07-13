import { useEffect } from 'react';

import { useRecoilState } from 'recoil';

import { rProfileMap } from 'recoilState';
import { getApiService } from 'services/api';
import { getAvatarPath } from 'utils/domain';
import { updaterMergeItemToAddressMap } from 'utils/recoilHelpers';

import { useAsyncLoadCatch } from './useAsyncLoadCatch';
import { useRecoilFetcher } from './useRecoilFetcher';

import { IProfile, PostProfileParam } from 'types';

export const useProfile = (
  address?: string
): {
  profile: IProfile | undefined;
  avatarPath: string;
  backgroundPath: string;
  updateProfile: (params: PostProfileParam) => Promise<IProfile>;
} => {
  const callWithLoadCatch = useAsyncLoadCatch();

  const [profileMap, setProfileMap] = useRecoilState(rProfileMap);

  const profile = address ? profileMap.get(address) : undefined;

  const fetchProfile = useRecoilFetcher(
    'rProfileMap',
    rProfileMap,
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
      const result = await getApiService().postProfile(address, params);
      setProfileMap((oldMap) => new Map(oldMap.set(address, result)));
      return result;
    });

  return {
    profile,
    updateProfile,
    avatarPath: getAvatarPath(profile?.avatar),
    backgroundPath: getAvatarPath(profile?.background),
  };
};
