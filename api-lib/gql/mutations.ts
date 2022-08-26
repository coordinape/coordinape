import { order_by, ValueTypes } from './__generated__/zeus';
import { adminClient } from './adminClient';

export async function insertProfiles(
  profiles: ValueTypes['profiles_insert_input'][]
) {
  return adminClient.mutate(
    {
      insert_profiles: [
        {
          objects: profiles,
        },
        {
          returning: {
            id: true,
            address: true,
          },
        },
      ],
    },
    {
      operationName: 'insertProfiles',
    }
  );
}

export async function insertMemberships(
  users: ValueTypes['users_insert_input'][]
) {
  return adminClient.mutate(
    {
      insert_users: [
        {
          objects: users,
        },
        {
          returning: {
            id: true,
            address: true,
            circle_id: true,
            starting_tokens: true,
            non_giver: true,
            non_receiver: true,
            fixed_non_receiver: true,
            user_private: {
              fixed_payment_amount: true,
            },
          },
        },
      ],
    },
    {
      operationName: 'insertMemberships',
    }
  );
}

// TODO: this isn't used, more of an idea, and for example.
export async function updateCircles(
  circleId: number,
  circle: ValueTypes['circles_set_input']
) {
  return adminClient.mutate(
    {
      update_circles: [
        {
          where: {
            id: {
              _eq: circleId,
            },
          },
          _set: circle,
        },
        {
          returning: {
            id: true,
          },
        },
      ],
    },
    {
      operationName: 'updateCircles',
    }
  );
}

export async function insertOrganizations(
  orgs: ValueTypes['organizations_insert_input'][]
) {
  return adminClient.mutate(
    {
      insert_organizations: [
        {
          objects: orgs,
        },
        {
          returning: {
            id: true,
            name: true,
            circles: [{}, { id: true }],
            circles_aggregate: [{}, { aggregate: { count: [{}, true] } }],
          },
        },
      ],
    },
    {
      operationName: 'insertOrganizations ',
    }
  );
}

export async function insertEpochs(
  epochs: ValueTypes['epochs_insert_input'][]
) {
  return adminClient.mutate(
    {
      insert_epochs: [
        {
          objects: epochs,
        },
        {
          returning: {
            id: true,
            circle_id: true,
            ended: true,
            start_date: true,
            end_date: true,
          },
        },
      ],
    },
    {
      operationName: 'insertEpochs',
    }
  );
}

export async function insertGifts(
  gifts: ValueTypes['token_gifts_insert_input'][]
) {
  return adminClient.mutate(
    {
      insert_token_gifts: [
        {
          objects: gifts,
        },
        {
          returning: {
            id: true,
          },
        },
      ],
    },
    {
      operationName: 'insertGifts',
    }
  );
}

export async function insertPendingGifts(
  gifts: ValueTypes['pending_token_gifts_insert_input'][]
) {
  return adminClient.mutate(
    {
      insert_pending_token_gifts: [
        {
          objects: gifts,
        },
        {
          returning: {
            id: true,
          },
        },
      ],
    },
    {
      operationName: 'insertPendingGifts',
    }
  );
}

export async function insertNominees(
  nominees: ValueTypes['nominees_insert_input'][]
) {
  return adminClient.mutate(
    {
      insert_nominees: [
        { objects: nominees },
        {
          returning: {
            id: true,
          },
        },
      ],
    },
    {
      operationName: 'insertNominees',
    }
  );
}

export async function updateExpiredNominees(idList: number[]) {
  return adminClient.mutate(
    {
      update_nominees: [
        {
          _set: {
            ended: true,
          },
          where: {
            id: {
              _in: idList,
            },
          },
        },
        {
          affected_rows: true,
          returning: {
            name: true,
            expiry_date: true,
          },
        },
      ],
    },
    {
      operationName: 'updateExiredNominees',
    }
  );
}

export async function insertCircleWithAdmin(
  circleInput: any,
  userAddress: string,
  coordinapeAddress: string,
  fileName: string | null
) {
  const insertUsers = {
    data: [
      {
        name: circleInput.user_name,
        address: userAddress,
        role: 1,
      },
      {
        name: 'Coordinape',
        address: coordinapeAddress,
        role: 2,
        non_receiver: false,
        fixed_non_receiver: false,
        starting_tokens: 0,
        non_giver: true,
        give_token_remaining: 0,
        bio: 'Coordinape is the platform you’re using right now! We currently offer our service for free and invite people to allocate to us from within your circles. All funds received go towards funding the team and our operations.',
      },
    ],
  };
  const circleReturn = {
    id: true,
    name: true,
    protocol_id: true,
    team_sel_text: true,
    alloc_text: true,
    vouching: true,
    min_vouches: true,
    nomination_days_limit: true,
    vouching_text: true,
    logo: true,
    default_opt_in: true,
    team_selection: true,
    only_giver_vouch: true,
    auto_opt_out: true,
  };
  let retVal;
  if (circleInput.protocol_id) {
    const { insert_circles_one } = await adminClient.mutate(
      {
        insert_circles_one: [
          {
            object: {
              name: circleInput.circle_name,
              protocol_id: circleInput.protocol_id,
              users: insertUsers,
              contact: circleInput.contact,
              logo: fileName,
            },
          },
          circleReturn,
        ],
      },
      {
        operationName: 'insertCircle',
      }
    );
    retVal = insert_circles_one;
  } else {
    const { insert_organizations_one } = await adminClient.mutate(
      {
        insert_organizations_one: [
          {
            object: {
              name: circleInput.protocol_name,
              circles: {
                data: [
                  {
                    name: circleInput.circle_name,
                    contact: circleInput.contact,
                    users: insertUsers,
                    logo: fileName,
                  },
                ],
              },
            },
          },
          {
            circles: [
              { limit: 1, order_by: [{ id: order_by.desc }] },
              circleReturn,
            ],
          },
        ],
      },
      {
        operationName: 'insertOrg',
      }
    );

    retVal = insert_organizations_one?.circles.pop();
  }

  return retVal;
}

export async function insertVouch(nomineeId: number, voucherId: number) {
  const { insert_vouches_one } = await adminClient.mutate(
    {
      insert_vouches_one: [
        {
          object: {
            nominee_id: nomineeId,
            voucher_id: voucherId,
          },
        },
        {
          id: true,
          nominee: {
            id: true,
            address: true,
            name: true,
            circle_id: true,
            user_id: true,
            ended: true,
            vouches_required: true,
            nominated_by_user_id: true,
            nominations_aggregate: [{}, { aggregate: { count: [{}, true] } }],
          },
        },
      ],
    },
    {
      operationName: 'insertVouch',
    }
  );
  return insert_vouches_one;
}

export async function insertUser(
  address: string,
  name: string,
  circleId: number
) {
  const { insert_users_one } = await adminClient.mutate(
    {
      insert_users_one: [
        {
          object: {
            address: address,
            circle_id: circleId,
            name: name,
          },
        },
        {
          id: true,
        },
      ],
    },
    {
      operationName: 'insertUsers',
    }
  );
  return insert_users_one;
}

export async function updateNomineeUser(nomineeId: number, userId: number) {
  const { update_nominees_by_pk } = await adminClient.mutate(
    {
      update_nominees_by_pk: [
        {
          pk_columns: {
            id: nomineeId,
          },
          _set: {
            user_id: userId,
            ended: true,
          },
        },
        {
          id: true,
        },
      ],
    },
    {
      operationName: 'updateNomineeUser',
    }
  );
  return update_nominees_by_pk;
}

export async function updateCircle(params: ValueTypes['UpdateCircleInput']) {
  const { update_webhook, circle_id, ...circleSetInput } = params;

  if (!update_webhook) {
    // don't try to set/unset the webhook
    params.discord_webhook = undefined;
  } else if (params.discord_webhook === '') {
    // if the client gives us an empty string, and we are trying to set the webhook, this means we are setting it to null
    params.discord_webhook = null;
  }

  const { update_circles_by_pk } = await adminClient.mutate(
    {
      update_circles_by_pk: [
        {
          pk_columns: {
            id: circle_id,
          },
          _set: {
            ...circleSetInput,
          },
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
  return update_circles_by_pk;
}

export async function endNominees(circleId: number) {
  const { update_nominees } = await adminClient.mutate(
    {
      update_nominees: [
        {
          where: {
            circle_id: { _eq: circleId },
          },
          _set: {
            ended: true,
          },
        },
        {
          affected_rows: true,
        },
      ],
    },
    {
      operationName: 'endNominees',
    }
  );
  return update_nominees;
}
