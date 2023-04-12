import { client } from 'lib/gql/client';

import { IApiCircle } from 'types';

interface CreateCircleParam {
  user_name: string;
  circle_name: string;
  image_data_base64?: string;
  organization_name?: string;
  organization_id?: number;
  contact: string;
}

export const createCircleMutation = async (
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
            allow_distribute_evenly: true,
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
