import { useEffect } from 'react';

import { useRecoilValue } from 'recoil';

import { rProfileRaw } from 'recoilState';
import { getApiService } from 'services/api';
import { getAvatarPath } from 'utils/domain';
import { updaterMergeToAddressMap } from 'utils/recoilHelpers';

import { useRecoilFetcher } from './useRecoilFetcher';

// TODO: This could be a selector, but how to trigger periodic refetch?
export const useProfile = (address?: string) => {
  const profileMap = useRecoilValue(rProfileRaw);
  const profile = address ? profileMap.get(address.toLowerCase()) : undefined;

  const fetchProfile = useRecoilFetcher(
    'rProfileRaw',
    rProfileRaw,
    updaterMergeToAddressMap
  );

  useEffect(() => {
    if (address) {
      // Fetcher only makes an API call if it is a new address or time elapsed.
      fetchProfile(getApiService().getProfile, [address]).then(([commit]) =>
        commit()
      );
    }
  }, [address, fetchProfile]);

  return {
    profile,
    avatarPath: getAvatarPath(profile?.avatar),
    backgroundPath: getAvatarPath(
      profile?.background,
      '/imgs/background/profile-bg.jpg'
    ),
  };
};
