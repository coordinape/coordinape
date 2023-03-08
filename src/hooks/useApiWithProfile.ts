import { client } from 'lib/gql/client';
import * as mutations from 'lib/gql/mutations';

import { fileToBase64 } from '../lib/base64';
import { ValueTypes } from '../lib/gql/__generated__/zeus';
import { useApiBase } from 'hooks';

import { useRecoilLoadCatch } from './useRecoilLoadCatch';

import { IApiCircle } from 'types';

interface CreateCircleParam {
  user_name: string;
  circle_name: string;
  image_data_base64?: string;
  organization_name?: string;
  organization_id?: number;
  contact: string;
}

export const createCircle = async (
  payload: CreateCircleParam
): Promise<IApiCircle> => {
  const { createCircle } = await client.mutate(
    {
      createCircle: [
        { payload },
        {
          circle: {
            id: true,
            name: true,
            logo: true,
            default_opt_in: true,
            is_verified: true,
            alloc_text: true,
            cont_help_text: true,
            token_name: true,
            vouching: true,
            min_vouches: true,
            nomination_days_limit: true,
            vouching_text: true,
            only_giver_vouch: true,
            team_selection: true,
            created_at: true,
            updated_at: true,
            organization_id: true,
            show_pending_gives: true,
            organization: {
              id: true,
              name: true,
              created_at: true,
              updated_at: true,
              sample: true,
            },
            auto_opt_out: true,
            fixed_payment_token_type: true,
          },
        },
      ],
    },
    { operationName: 'createCircle' }
  );
  if (!createCircle) {
    throw 'unable to create circle';
  }
  if (!createCircle.circle?.organization) {
    throw 'circle created but organization not found after creation';
  }
  return {
    ...createCircle.circle,
    organization: createCircle.circle.organization,
  };
};

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

  const updateBackground = useRecoilLoadCatch(
    () => async (newAvatar: File) => {
      const image_data_base64 = await fileToBase64(newAvatar);
      await mutations.updateProfileBackground(image_data_base64);
      // FIXME fetchManifest instead of updating the changed field is wasteful
      await fetchManifest();
    },
    []
  );

  const updateMyProfile = useRecoilLoadCatch(
    () => async (params: ValueTypes['profiles_set_input']) => {
      try {
        await mutations.updateProfile(params);
      } catch (err: any) {
        if (err.response?.errors && err.response.errors.length > 0) {
          // clean up the error if its our check error
          if (err.response.errors[0].message.includes('valid_website')) {
            throw 'provide a valid website starting with https:// or http://';
          }
          if (err.response.errors[0].message.includes('Uniqueness violation')) {
            throw 'This name is already in use';
          }
          // rethrow it if it doesn't match
        }
        throw err;
      }
      // FIXME fetchManifest instead of updating the changed field is wasteful
      await fetchManifest();
    },
    []
  );

  return {
    createCircle,
    updateBackground,
    updateMyProfile,
  };
};
