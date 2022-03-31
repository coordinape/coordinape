import * as mutations from 'lib/gql/mutations';

import { fileToBase64 } from '../lib/base64';
import { ValueTypes } from '../lib/gql/__generated__/zeus';
import { useApiBase } from 'hooks';

import { useRecoilLoadCatch } from './useRecoilLoadCatch';

import { CreateCircleParam, IApiCircle } from 'types';

export const useApiWithProfile = () => {
  const { fetchManifest } = useApiBase();

  const createCircle = useRecoilLoadCatch(
    () =>
      async (params: CreateCircleParam): Promise<IApiCircle> => {
        const result = await mutations.createCircle(params);
        await fetchManifest();
        return result;
      },
    []
  );

  const updateAvatar = useRecoilLoadCatch(
    () => async (newAvatar: File) => {
      // TODO: ideally we would use useTypedMutation instead of this but I couldn't get the variables to work w/ mutation -CryptoGraffe
      const image_data_base64 = await fileToBase64(newAvatar);
      await mutations.updateProfileAvatar(image_data_base64);
      await fetchManifest();
    },
    []
  );

  const updateBackground = useRecoilLoadCatch(
    () => async (newAvatar: File) => {
      const image_data_base64 = await fileToBase64(newAvatar);
      await mutations.updateProfileBackground(image_data_base64);
      await fetchManifest();
    },
    []
  );

  const updateMyProfile = useRecoilLoadCatch(
    () => async (params: ValueTypes['profiles_set_input']) => {
      await mutations.updateProfile(params);
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
