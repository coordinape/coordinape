import {
  CreateCircleParam,
  IApiCircle,
  NominateUserParam,
  PostTokenGiftsParam,
  PostUsersParam,
  UpdateCreateEpochParam,
  UpdateUsersParam,
} from '../../types';

import { $, ValueTypes } from './__generated__/zeus';
import { client } from './client';

export const updateProfileAvatar = async (image_data_base64: string) =>
  client.mutate(
    {
      uploadProfileAvatar: [
        { payload: { image_data_base64: $`image_data_base64` } },
        { id: true },
      ],
    },
    {
      variables: {
        image_data_base64,
      },
    }
  );

export const updateProfileBackground = async (image_data_base64: string) =>
  client.mutate(
    {
      uploadProfileBackground: [
        { payload: { image_data_base64: $`image_data_base64` } },
        { id: true },
      ],
    },
    {
      variables: {
        image_data_base64,
      },
    }
  );

export const updateCircleLogo = async (
  circleId: number,
  image_data_base64: string
) =>
  client.mutate(
    {
      uploadCircleLogo: [
        {
          payload: {
            image_data_base64: $`image_data_base64`,
            circle_id: $`circleId`,
          },
        },
        { id: true },
      ],
    },
    {
      variables: {
        circleId: circleId,
        image_data_base64,
      },
    }
  );

export const createCircleIntegration = async (
  circleId: number,
  type: string,
  name: string,
  data: any
) =>
  client.mutate(
    {
      insert_circle_integrations_one: [
        {
          object: {
            circle_id: circleId,
            type,
            name,
            data: $`data`,
          },
        },
        { id: true },
      ],
    },
    { variables: { data } }
  );

export const deleteCircleIntegration = async (id: number) =>
  client.mutate({
    delete_circle_integrations_by_pk: [{ id }, { id: true }],
  });

export const allVaultFields = {
  id: true,
  created_at: true,
  created_by: true,
  decimals: true,
  org_id: true,
  simple_token_address: true,
  symbol: true,
  token_address: true,
  updated_at: true,
  vault_address: true,
};

export const addVault = (vault: ValueTypes['vaults_insert_input']) =>
  client.mutate({
    insert_vaults_one: [{ object: vault }, allVaultFields],
  });

export const logout = async (): Promise<boolean> => {
  const { logoutUser } = await client.mutate({
    logoutUser: {
      id: true,
    },
  });
  if (logoutUser?.id) {
    return true;
  }
  return false;
};

export const createCircle = async (
  params: CreateCircleParam
): Promise<IApiCircle> => {
  const { createCircle } = await client.mutate({
    createCircle: [
      {
        payload: params,
      },
      {
        circle: {
          id: true,
          name: true,
          logo: true,
          default_opt_in: true,
          is_verified: true,
          alloc_text: true,
          team_sel_text: true,
          token_name: true,
          vouching: true,
          min_vouches: true,
          nomination_days_limit: true,
          vouching_text: true,
          only_giver_vouch: true,
          team_selection: true,
          created_at: true,
          updated_at: true,
          protocol_id: true,
          organization: {
            id: true,
            name: true,
            created_at: true,
            updated_at: true,
          },
          auto_opt_out: true,
        },
      },
    ],
  });
  if (!createCircle) {
    throw 'unable to create circle';
  }
  if (!createCircle.circle.organization) {
    throw 'circle created but protocol / organization not found after creation';
  }
  return {
    ...createCircle.circle,
    protocol: createCircle.circle.organization,
  };
};

export const adminUpdateUser = async (
  circleId: number,
  originalAddress: string,
  params: UpdateUsersParam
) => {
  const new_address =
    params.address.toLowerCase() != originalAddress.toLowerCase()
      ? params.address.toLowerCase()
      : undefined;

  // const startingTokens = params.starting_tokens
  const { adminUpdateUser } = await client.mutate({
    adminUpdateUser: [
      {
        payload: {
          circle_id: circleId,
          name: params.name,
          address: originalAddress,
          new_address,
          fixed_non_receiver: params.fixed_non_receiver,
          role: params.role,
          starting_tokens: params.starting_tokens,
          non_giver: params.non_giver,
          non_receiver: params.non_receiver || params.fixed_non_receiver,
        },
      },
      {
        id: true,
      },
    ],
  });
  return adminUpdateUser;
};

export const createUser = async (circleId: number, params: PostUsersParam) => {
  await client.mutate({
    createUser: [
      {
        payload: {
          circle_id: circleId,
          name: params.name,
          address: params.address,
          role: params.role,
          non_giver: params.non_giver,
          non_receiver: params.fixed_non_receiver || params.non_receiver,
          fixed_non_receiver: params.fixed_non_receiver,
          starting_tokens: params.starting_tokens,
        },
      },
      {
        id: true,
      },
    ],
  });
};

export const createNominee = async (
  circleId: number,
  params: NominateUserParam
) => {
  const { createNominee } = await client.mutate({
    createNominee: [
      {
        payload: {
          circle_id: circleId,
          ...params,
        },
      },
      {
        id: true,
      },
    ],
  });
  return createNominee;
};

export const vouchUser = async (nomineeId: number) => {
  const { vouch } = await client.mutate({
    vouch: [
      {
        payload: {
          nominee_id: nomineeId,
        },
      },
      {
        id: true,
      },
    ],
  });
  return vouch;
};

export async function deleteEpoch(circleId: number, epochId: number) {
  const { deleteEpoch } = await client.mutate({
    deleteEpoch: [
      {
        payload: {
          id: epochId,
          circle_id: circleId,
        },
      },
      {
        success: true,
      },
    ],
  });
  return deleteEpoch;
}

export async function updateCircle(params: ValueTypes['UpdateCircleInput']) {
  const { updateCircle } = await client.mutate({
    updateCircle: [
      {
        payload: { ...params },
      },
      {
        id: true,
      },
    ],
  });

  return updateCircle;
}

export async function updateTeammates(circleId: number, teammates: number[]) {
  const { updateTeammates } = await client.mutate({
    updateTeammates: [
      {
        payload: { circle_id: circleId, teammates: teammates },
      },
      {
        user_id: true,
      },
    ],
  });
  return updateTeammates;
}

export async function updateAllocations(
  circleId: number,
  params: PostTokenGiftsParam[]
) {
  await client.mutate({
    updateAllocations: [
      {
        payload: {
          circle_id: circleId,
          allocations: params.map(a => {
            return {
              ...a,
              note: a.note ? a.note : '',
            };
          }),
        },
      },
      {
        user_id: true,
      },
    ],
  });
  return;
}

export async function deleteUser(circleId: number, address: string) {
  const { deleteUser } = await client.mutate({
    deleteUser: [
      {
        payload: {
          circle_id: circleId,
          address: address,
        },
      },
      {
        success: true,
      },
    ],
  });
  return deleteUser;
}

export async function updateProfile(params: ValueTypes['profiles_set_input']) {
  const { update_profiles } = await client.mutate({
    update_profiles: [
      {
        // This uses the hasura permissions / preloaded column to set the where
        where: {},
        _set: { ...params },
      },
      {
        affected_rows: true,
      },
    ],
  });
  return update_profiles;
}

export async function updateUser(params: ValueTypes['UpdateUserInput']) {
  const { updateUser } = await client.mutate({
    updateUser: [
      {
        payload: {
          ...params,
        },
      },
      {
        id: true,
      },
    ],
  });
  return updateUser;
}

export async function createEpoch(params: ValueTypes['CreateEpochInput']) {
  const { createEpoch } = await client.mutate({
    createEpoch: [
      {
        payload: {
          ...params,
        },
      },
      {
        id: true,
      },
    ],
  });
  return createEpoch;
}

export async function updateEpoch(
  circleId: number,
  epochId: number,
  params: UpdateCreateEpochParam
) {
  const { updateEpoch } = await client.mutate({
    updateEpoch: [
      {
        payload: {
          circle_id: circleId,
          id: epochId,
          ...params,
        },
      },
      {
        id: true,
      },
    ],
  });
  return updateEpoch;
}

export async function allocationCsv(
  circleId: number,
  epoch?: number,
  epochId?: number,
  grant?: number
) {
  const { allocationCsv } = await client.mutate(
    {
      allocationCsv: [
        {
          payload: {
            circle_id: circleId,
            epoch_id: epochId,
            grant: grant,
            epoch: epoch,
          },
        },
        {
          file: true,
        },
      ],
    },
    {
      operationName: 'allocationCsv',
    }
  );
  return allocationCsv;
}
