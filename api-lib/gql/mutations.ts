import { order_by, ValueTypes } from './__generated__/zeus';
import { adminClient } from './adminClient';

// TODO: this isn't used, more of an idea, and for example.
export async function updateCircles(
  circleId: number,
  circle: ValueTypes['circles_set_input']
) {
  return adminClient.mutate({
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
  });
}

export async function insertOrganizations(
  orgs: ValueTypes['organizations_insert_input'][]
) {
  return adminClient.mutate({
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
  });
}

export async function insertEpochs(
  epochs: ValueTypes['epochs_insert_input'][]
) {
  return adminClient.mutate({
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
  });
}

export async function insertGifts(
  gifts: ValueTypes['token_gifts_insert_input'][]
) {
  return adminClient.mutate({
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
  });
}

export async function insertPendingGifts(
  gifts: ValueTypes['pending_token_gifts_insert_input'][]
) {
  return adminClient.mutate({
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
  });
}

export async function insertNominees(
  nominees: ValueTypes['nominees_insert_input'][]
) {
  return adminClient.mutate({
    insert_nominees: [
      { objects: nominees },
      {
        returning: {
          id: true,
        },
      },
    ],
  });
}

export async function updateExpiredNominees(idList: number[]) {
  return adminClient.mutate({
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
  });
}

export async function insertCircleWithAdmin(
  circleInput: any,
  userAddress: string,
  coordinapeAddress: string
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
    const { insert_circles_one } = await adminClient.mutate({
      insert_circles_one: [
        {
          object: {
            name: circleInput.circle_name,
            protocol_id: circleInput.protocol_id,
            users: insertUsers,
            contact: circleInput.contact,
          },
        },
        circleReturn,
      ],
    });
    retVal = insert_circles_one;
  } else {
    const { insert_organizations_one } = await adminClient.mutate({
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
    });

    retVal = insert_organizations_one?.circles.pop();
  }

  return retVal;
}

export async function insertVouch(nomineeId: number, voucherId: number) {
  const { insert_vouches_one } = await adminClient.mutate({
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
  });
  return insert_vouches_one;
}

export async function insertUser(
  address: string,
  name: string,
  circleId: number
) {
  const { insert_users_one } = await adminClient.mutate({
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
  });
  return insert_users_one;
}

export async function updateNomineeUser(nomineeId: number, userId: number) {
  const { update_nominees_by_pk } = await adminClient.mutate({
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
  });
  return update_nominees_by_pk;
}
