import { adminClient } from './adminClient';

export async function getCircle(id: number) {
  return adminClient.query({
    circles_by_pk: [
      { id },
      {
        id: true,
        name: true,
        team_sel_text: true,
        discord_webhook: true,
        telegram_id: true,
        epochs: [
          { limit: 1 },
          {
            id: true,
            start_date: true,
            number: true,
            circle_id: true,
            ended: true,
            grant: true,
            created_at: true,
            days: true,
            repeat: true,
            repeat_day_of_month: true,
          },
        ],
      },
    ],
  });
}

export async function getCircles() {
  return (
    await adminClient.query({
      circles: [
        {},
        {
          id: true,
          name: true,
        },
      ],
    })
  ).circles;
}

export async function getCurrentEpoch(
  circle_id: number
): Promise<typeof currentEpoch | undefined> {
  const {
    epochs: [currentEpoch],
  } = await adminClient.query({
    epochs: [
      {
        where: {
          circle_id: { _eq: circle_id },
          end_date: { _gt: 'now()' },
          start_date: { _lt: 'now()' },
        },
      },
      { id: true },
    ],
  });
  return currentEpoch;
}

export async function getUserAndCurrentEpoch(
  address: string,
  circleId: number
): Promise<typeof user | undefined> {
  const {
    users: [user],
  } = await adminClient.query({
    users: [
      {
        limit: 1,
        where: {
          address: { _ilike: address },
          circle_id: { _eq: circleId },
          // ignore soft_deleted users
          deleted_at: { _is_null: true },
        },
      },
      {
        id: true,
        fixed_non_receiver: true,
        non_giver: true,
        non_receiver: true,
        starting_tokens: true,
        give_token_received: true,
        give_token_remaining: true,
        pending_sent_gifts: [
          // the join filters down to only gifts to the user
          {},
          {
            id: true,
            epoch_id: true,
            sender_id: true,
            sender_address: true,
            recipient_id: true,
            recipient_address: true,
            note: true,
            tokens: true,
          },
        ],
        pending_received_gifts: [
          // the join filters down to only gifts to the user
          {},
          {
            id: true,
            epoch_id: true,
            sender_id: true,
            sender_address: true,
            recipient_id: true,
            recipient_address: true,
            note: true,
            tokens: true,
          },
        ],
        circle: {
          epochs: [
            {
              where: {
                _and: [
                  { end_date: { _gt: 'now()' } },
                  { start_date: { _lt: 'now()' } },
                ],
              },
            },
            {
              start_date: true,
              end_date: true,
              id: true,
            },
          ],
        },
      },
    ],
  });
  return user;
}

// TODO: This is a big problem if we can't trust the type checker.
// Why is the type inference wrong here,
// It could be undefined
//
// update: This isn't a problem with the return types per se,
// since this returns an array type and if there are no matches the
// array just returns empty. The issue is we can't statically destructure
// these arrays because the typechecker infers that we know the length
// of the array when destructuring
export async function getProfileAndMembership(address: string) {
  return adminClient.query({
    users: [
      {
        where: {
          address: {
            _eq: address,
          },
        },
      },
      {
        id: true,
        name: true,
        circle_id: true,
      },
    ],
    profiles: [
      {
        where: {
          address: {
            _eq: address,
          },
        },
      },
      {
        id: true,
        address: true,
      },
    ],
  });
}

export async function getNominee(id: number) {
  return adminClient.query({
    nominees_by_pk: [
      { id },
      {
        id: true,
        address: true,
        name: true,
        circle_id: true,
        nominator: {
          name: true,
        },
        user_id: true,
        ended: true,
        vouches_required: true,
        nominated_by_user_id: true,
        nominations_aggregate: [{}, { aggregate: { count: [{}, true] } }],
        circle: {
          only_giver_vouch: true,
        },
      },
    ],
  });
}

export async function getExpiredNominees() {
  return adminClient.query({
    nominees: [
      {
        where: {
          ended: {
            _eq: false,
          },
          expiry_date: { _lte: new Date() },
        },
      },
      {
        id: true,
        name: true,
        circle_id: true,
        nominations_aggregate: [{}, { aggregate: { count: [{}, true] } }],
      },
    ],
  });
}

export async function checkAddressAdminInOrg(
  address: string,
  protocol_id: number
) {
  const { profiles } = await adminClient.query({
    profiles: [
      {
        where: {
          address: { _ilike: address },
          users: {
            role: { _eq: 1 },
            circle: { protocol_id: { _eq: protocol_id } },
          },
        },
      },
      {
        id: true,
      },
    ],
  });
  return profiles.length > 0;
}

export async function getExistingVouch(nomineeId: number, voucherId: number) {
  return adminClient.query({
    vouches: [
      {
        where: {
          nominee_id: { _eq: nomineeId },
          voucher_id: { _eq: voucherId },
        },
      },
      {
        id: true,
        voucher: {
          name: true,
        },
      },
    ],
  });
}
