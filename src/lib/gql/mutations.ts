import { useZeusVariables, ValueTypes } from './__generated__/zeus';
import { client } from './client';

const profileVars = useZeusVariables({ image_data_base64: 'String!' });

export const updateProfileAvatar = async (image_data_base64: string) => {
  const variables = profileVars({ image_data_base64 });

  return client.mutate(
    {
      uploadProfileAvatar: [
        { payload: { image_data_base64: variables.$('image_data_base64') } },
        {
          profile: {
            avatar: true,
          },
        },
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
        {
          circle: {
            logo: true,
          },
        },
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

export const createNominee = async (
  circleId: number,
  params: {
    name: string;
    address: string;
    description: string;
  }
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
          nominee: {
            profile: {
              name: true,
            },
          },
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

export async function updateCircleStartingTokens(
  params: ValueTypes['UpdateCircleStartingGiveInput']
) {
  const { updateCircleStartingGive } = await client.mutate(
    {
      updateCircleStartingGive: [{ payload: { ...params } }, { success: true }],
    },
    {
      operationName: 'updateCircleStartingGive',
    }
  );

  return updateCircleStartingGive;
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

export async function deleteUser(circleId: number, profileId: number) {
  const { deleteUser } = await client.mutate(
    {
      deleteUser: [
        {
          payload: {
            circle_id: circleId,
            profile_id: profileId,
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

export async function updateMyProfile(
  params: ValueTypes['UpdateProfileInput']
) {
  await client.mutate(
    {
      updateProfile: [{ payload: { ...params } }, { id: true }],
    },
    {
      operationName: 'updateProfile',
    }
  );
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
          UserResponse: { non_receiver: true },
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
          payload: params,
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
  updateParams: ValueTypes['UpdateEpochInput']
) {
  const {
    circle_id: circleId,
    id: epochId,
    params,
    description,
  } = updateParams;
  const { updateEpoch } = await client.mutate(
    {
      updateEpoch: [
        {
          payload: {
            circle_id: circleId,
            id: epochId,
            params,
            description,
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

export async function updateEpochDescription(id: number, description: string) {
  const { update_epochs_by_pk } = await client.mutate(
    {
      update_epochs_by_pk: [
        {
          pk_columns: { id: id },
          _set: { description: description },
        },
        {
          id: true,
        },
      ],
    },
    {
      operationName: 'updateEpochDescription',
    }
  );
  if (!update_epochs_by_pk) throw 'failed to update epoch description';
  return update_epochs_by_pk;
}

export async function updateActiveRepeatingEpoch(
  circleId: number,
  epochId: number,
  params: {
    current: ValueTypes['UpdateEpochInput']['params'];
    next: ValueTypes['CreateEpochInput']['params'];
  }
) {
  // TODO create a backend handler that sequentially executes these handlers
  // action handlers are not executed purely sequentially when passed in the
  // same mutation. In this specific case, the create handler executes
  // seemingly concurrently with the update handler, which yields an
  // "overlapping epoch" error
  await client.mutate(
    {
      updateEpoch: [
        {
          payload: {
            params: params.current,
            circle_id: circleId,
            id: epochId,
          },
        },
        {
          id: true,
        },
      ],
    },
    {
      operationName: 'updateActiveRepeatingEpochUpdate',
    }
  );
  await client.mutate(
    {
      createEpoch: [
        {
          payload: {
            params: params.next,
            circle_id: circleId,
          },
        },
        {
          id: true,
        },
      ],
    },
    {
      operationName: 'updateActiveRepeatingEpochCreate',
    }
  );
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
