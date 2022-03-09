/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-console */
import { getUserClient } from 'lib/gql/userClient';

import { fileToBase64 } from '../lib/base64';
import { REACT_APP_HASURA_URL, HASURA_ENABLED } from 'config/env';
import { useApiBase } from 'hooks';
import { getApiService, getAuthToken } from 'services/api';

import { useRecoilLoadCatch } from './useRecoilLoadCatch';

import { CreateCircleParam, PostProfileParam } from 'types';

const api = getUserClient(REACT_APP_HASURA_URL, () => {
  const token = getAuthToken();
  if (token) {
    return token;
  } else {
    // TODO: ideally would figure out a better way to handle this, in a uniform way
    return '';
  }
});

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
      // TODO: ideally we would use useTypedMutation instead of this but I couldn't get the variables to work w/ mutation -CryptoGraffe
      const image_data_base64 = await fileToBase64(newAvatar);
      if (HASURA_ENABLED) {
        await api.updateProfileAvatar(image_data_base64);
      } else {
        await getApiService().uploadAvatar(newAvatar);
      }
      await fetchManifest();
    },
    []
  );

  const updateBackground = useRecoilLoadCatch(
    () => async (newAvatar: File) => {
      const image_data_base64 = await fileToBase64(newAvatar);
      if (HASURA_ENABLED) {
        await api.updateProfileBackground(image_data_base64);
      } else {
        await getApiService().uploadBackground(newAvatar);
      }
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
