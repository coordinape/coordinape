/* eslint-disable react-hooks/rules-of-hooks */
import { useApiBase } from 'hooks';
import { getApiService } from 'services/api';

import { useRecoilLoadCatch } from './useRecoilLoadCatch';

import { CreateCircleParam, PostProfileParam } from 'types';

export const useApiWithProfile = () => {
  const { fetchManifest } = useApiBase();

  const createCircle = useRecoilLoadCatch(
    () =>
      async (
        address: string,
        params: CreateCircleParam,
        captchaToken: string,
        uxresearchJson: string
      ) => {
        const result = await getApiService().createCircle(
          address,
          params,
          captchaToken,
          uxresearchJson
        );
        await fetchManifest();
        return result;
      },
    []
  );

  const updateAvatar = useRecoilLoadCatch(
    () => async (newAvatar: File) => {
      await getApiService().uploadAvatar(newAvatar);
      await fetchManifest();
    },
    []
  );

  const updateBackground = useRecoilLoadCatch(
    () => async (newAvatar: File) => {
      await getApiService().uploadBackground(newAvatar);
      await fetchManifest();
    },
    []
  );

  const updateMyProfile = useRecoilLoadCatch(
    () => async (params: PostProfileParam) => {
      await getApiService().updateProfile(params);
      await fetchManifest();
    },
    []
  );

  return {
    createCircle,
    updateAvatar,
    updateBackground,
    updateMyProfile,
  };
};
