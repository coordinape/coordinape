import {
  CreateCircleParam,
  IApiCircle,
  NominateUserParam,
  PostTokenGiftsParam,
  PostUsersParam,
  UpdateCreateEpochParam,
  UpdateUsersParam,
} from '../../types';

import { useZeusVariables, ValueTypes } from './__generated__/zeus';
import { client } from './client';

const profileVars = useZeusVariables({ image_data_base64: 'String!' });

export const updateProfileAvatar = async (image_data_base64: string) => {
  const variables = profileVars({ image_data_base64 });

  return client.mutate(
    {
      uploadProfileAvatar: [
        { payload: { image_data_base64: variables.$('image_data_base64') } },
        { id: true },
      ],
    },
    {
      variables,
      operationName: 'updateProfileAvatar',
    }
  );
};

export const updateProfileBackground = async (image_data_base64: string) => {
  const variables = profileVars({ image_data_base64 });

  return client.mutate(
    {
      uploadProfileBackground: [
        { payload: { image_data_base64: variables.$('image_data_base64') } },
        { id: true },
      ],
    },
    {
      variables,
      operationName: 'updateProfileBackground',
    }
  );
};

export const updateCircleLogo = async (
  circleId: number,
  image_data_base64: string
) => {
  const variables = useZeusVariables({
    image_data_base64: 'String!',
    circleId: 'Int!',
  })({
    circleId,
    image_data_base64,
  });

  return client.mutate(
    {
      uploadCircleLogo: [
        {
          payload: {
            image_data_base64: variables.$('image_data_base64'),
            circle_id: variables.$('circleId'),
          },
        },
        { id: true },
      ],
    },
    {
      variables,
      operationName: 'updateCircleLogo',
    }
  );
};
export const updateOrgLogo = async (
  orgId: number,
  image_data_base64: string
) => {
  const variables = useZeusVariables({
    image_data_base64: 'String!',
    orgId: 'Int!',
  })({
    image_data_base64,
    orgId,
  });
  return client.mutate(
    {
      uploadOrgLogo: [
        {
          payload: {
            image_data_base64: variables.$('image_data_base64'),
            org_id: variables.$('orgId'),
          },
        },
        {
          org: {
            logo: true,
          },
        },
      ],
    },
    {
      variables,
      operationName: 'updateOrgLogo',
    }
  );
};
export const createCircleIntegration = async (
  circleId: number,
  type: string,
  name: string,
  data: any
) => {
  return client.mutate(
    {
      insert_circle_integrations_one: [
        {
          object: {
            circle_id: circleId,
            type,
            name,
            data,
          },
        },
        { id: true },
      ],
    },
    { operationName: 'createCircleIntegration' }
  );
};

export const deleteCircleIntegration = async (id: number) =>
  client.mutate(
    {
      delete_circle_integrations_by_pk: [{ id }, { id: true }],
    },
    {
      operationName: 'deleteCircleIntegration',
    }
  );

// Warning: this pattern of constructing ad-hoc ValueTypes selections
// and passing them into various queries does not work for array
// relationships in Zeus. These need to be assembled inline
// with the query or explicitly typed. It's interesting that typing or
// casting this object causes typechecking issues
export const allVaultFields = {
  id: true,
  created_at: true,
  created_by: true,
  decimals: true,
  simple_token_address: true,
  symbol: true,
  token_address: true,
  updated_at: true,
  vault_address: true,
  chain_id: true,
  deployment_block: true,
};

export const addVault = (
  vault: ValueTypes['CreateVaultInput'],
  pendingTxHash: string
) =>
  client.mutate(
    {
      createVault: [
        { payload: vault },
        {
          vault: {
            ...allVaultFields,
            organization: {
              name: true,
            },
            vault_transactions: [
              {},
              {
                tx_hash: true,
                tx_type: true,
                created_at: true,
                profile: {
                  address: true,
                  users: [{}, { circle_id: true, name: true }],
                },
                distribution: {
                  claims: [{}, { profile_id: true }],
                  fixed_amount: true,
                  gift_amount: true,
                  epoch: {
                    start_date: true,
                    end_date: true,
                    number: true,
                    circle: { name: true },
                  },
                },
              },
            ],
          },
        },
      ],
      delete_pending_vault_transactions_by_pk: [
        { tx_hash: pendingTxHash },
        { __typename: true },
      ],
    },
    { operationName: 'addVault' }
  );

export const addVaultTx = (vaultTx: ValueTypes['LogVaultTxInput']) =>
  client.mutate({
    createVaultTx: [{ payload: vaultTx }, { __typename: true }],
  });

export const logout = async (): Promise<boolean> => {
  const { logoutUser } = await client.mutate(
    {
      logoutUser: {
        id: true,
      },
    },
    {
      operationName: 'logout',
    }
  );
  if (logoutUser?.id) {
    return true;
  }
  return false;
};

export const createCircle = async (
  params: CreateCircleParam
): Promise<IApiCircle> => {
  const { createCircle } = await client.mutate(
    {
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
            organization_id: true,
            organization: {
              id: true,
              name: true,
              created_at: true,
              updated_at: true,
            },
            auto_opt_out: true,
            fixed_payment_token_type: true,
          },
        },
      ],
    },
    {
      operationName: 'createCircle',
    }
  );
  if (!createCircle) {
    throw 'unable to create circle';
  }
  if (!createCircle.circle.organization) {
    throw 'circle created but organization not found after creation';
  }
  return {
    ...createCircle.circle,
    organization: createCircle.circle.organization,
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
  const { adminUpdateUser } = await client.mutate(
    {
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
            fixed_payment_amount: params.fixed_payment_amount,
          },
        },
        {
          id: true,
        },
      ],
    },
    {
      operationName: 'adminUpdateUser',
    }
  );
  return adminUpdateUser;
};

export const createUser = async (circleId: number, params: PostUsersParam) => {
  await client.mutate(
    {
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
            fixed_payment_amount: params.fixed_payment_amount,
          },
        },
        {
          id: true,
        },
      ],
    },
    {
      operationName: 'createUser',
    }
  );
};

export const createNominee = async (
  circleId: number,
  params: NominateUserParam
) => {
  const { createNominee } = await client.mutate(
    {
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
    },
    {
      operationName: 'createNominee',
    }
  );
  return createNominee;
};

export const vouchUser = async (nomineeId: number) => {
  const { vouch } = await client.mutate(
    {
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
    },
    {
      operationName: 'vouchUser',
    }
  );
  return vouch;
};

export async function deleteEpoch(circleId: number, epochId: number) {
  const { deleteEpoch } = await client.mutate(
    {
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
    },
    {
      operationName: 'deleteEpoch',
    }
  );
  return deleteEpoch;
}

export async function updateCircle(params: ValueTypes['UpdateCircleInput']) {
  const { updateCircle } = await client.mutate(
    {
      updateCircle: [
        {
          payload: { ...params },
        },
        {
          id: true,
        },
      ],
    },
    {
      operationName: 'updateCircle',
    }
  );

  return updateCircle;
}

export async function deleteCircle(circle_id: number) {
  const { deleteCircle } = await client.mutate(
    {
      deleteCircle: [
        {
          payload: {
            circle_id: circle_id,
          },
        },
        {
          success: true,
        },
      ],
    },
    {
      operationName: 'deleteCircle',
    }
  );
  return deleteCircle;
}

export async function updateTeammates(circleId: number, teammates: number[]) {
  const { updateTeammates } = await client.mutate(
    {
      updateTeammates: [
        {
          payload: { circle_id: circleId, teammates: teammates },
        },
        {
          user_id: true,
        },
      ],
    },
    {
      operationName: 'updateTeammates',
    }
  );
  return updateTeammates;
}

export async function restoreCoordinapeUser(circleId: number) {
  await client.mutate(
    {
      restoreCoordinape: [
        {
          payload: {
            circle_id: circleId,
          },
        },
        {
          success: true,
        },
      ],
    },
    {
      operationName: 'restore_coordinape',
    }
  );
}

export async function updateAllocations(
  circleId: number,
  params: PostTokenGiftsParam[]
) {
  await client.mutate(
    {
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
    },
    {
      operationName: 'updateAllocations',
    }
  );
  return;
}

export async function deleteUser(circleId: number, address: string) {
  const { deleteUser } = await client.mutate(
    {
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
    },
    {
      operationName: 'deleteUser',
    }
  );
  return deleteUser;
}

export async function updateProfile(params: ValueTypes['profiles_set_input']) {
  const { update_profiles } = await client.mutate(
    {
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
    },
    {
      operationName: 'updateProfile',
    }
  );
  return update_profiles;
}

export async function updateUser(params: ValueTypes['UpdateUserInput']) {
  const { updateUser } = await client.mutate(
    {
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
    },
    {
      operationName: 'updateUser',
    }
  );
  return updateUser;
}

export async function createEpoch(params: ValueTypes['CreateEpochInput']) {
  const { createEpoch } = await client.mutate(
    {
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
    },
    {
      operationName: 'createEpoch',
    }
  );
  return createEpoch;
}

export async function updateEpoch(
  circleId: number,
  epochId: number,
  params: UpdateCreateEpochParam
) {
  const { updateEpoch } = await client.mutate(
    {
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
    },
    {
      operationName: 'updateEpoch',
    }
  );
  return updateEpoch;
}

export async function allocationCsv(
  circleId: number,
  epoch?: number,
  epochId?: number,
  formGiftAmount?: number,
  giftTokenSymbol?: string,
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
            form_gift_amount: formGiftAmount,
            gift_token_symbol: giftTokenSymbol,
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

export async function savePendingVaultTx(
  input: ValueTypes['pending_vault_transactions_insert_input']
) {
  client.mutate({
    insert_pending_vault_transactions_one: [
      { object: { ...input } },
      { __typename: true },
    ],
  });
}

export async function deletePendingVaultTx(tx_hash: string) {
  client.mutate({
    delete_pending_vault_transactions_by_pk: [
      { tx_hash },
      { __typename: true },
    ],
  });
}
