import { DateTime } from 'luxon';

import { EPOCH_REPEAT } from '../../api-lib/constants';
import { ValueTypes } from '../../api-lib/gql/__generated__/zeus';

import { adminClient } from './adminClient';

export async function getCircle(id: number) {
  return adminClient.query(
    {
      circles_by_pk: [
        { id },
        {
          id: true,
          name: true,
          team_sel_text: true,
          discord_webhook: true,
          telegram_id: true,
          token_name: true,
          organization: {
            telegram_id: true,
          },
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
    },
    {
      operationName: 'getCircle',
    }
  );
}

export async function getCircles() {
  return (
    await adminClient.query(
      {
        circles: [
          {},
          {
            id: true,
            name: true,
          },
        ],
      },
      {
        operationName: 'getCircles',
      }
    )
  ).circles;
}

export async function getCurrentEpoch(
  circle_id: number
): Promise<typeof currentEpoch | undefined> {
  const {
    epochs: [currentEpoch],
  } = await adminClient.query(
    {
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
    },
    {
      operationName: 'getCurrentEpoch',
    }
  );
  return currentEpoch;
}

export async function getUserAndCurrentEpoch(
  address: string,
  circleId: number,
  excludeDeletedUsers = true
): Promise<typeof user | undefined> {
  const {
    users: [user],
  } = await adminClient.query(
    {
      users: [
        {
          limit: 1,
          where: {
            address: { _ilike: address },
            circle_id: { _eq: circleId },
            deleted_at: excludeDeletedUsers ? { _is_null: true } : undefined,
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
          fixed_payment_amount: true,
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
    },
    {
      operationName: 'getUserAndCurrentEpoch',
    }
  );
  return user;
}

export async function getUserByIdAndCurrentEpoch(
  id: number,
  circleId: number
): Promise<typeof user | undefined> {
  const {
    users: [user],
  } = await adminClient.query({
    users: [
      {
        limit: 1,
        where: {
          id: { _eq: id },
          circle_id: { _eq: circleId },
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
        fixed_payment_amount: true,
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
  return adminClient.query(
    {
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
    },
    {
      operationName: 'getProfileAndMembership',
    }
  );
}

export async function getNominee(id: number) {
  return adminClient.query(
    {
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
    },
    {
      operationName: 'getNominee',
    }
  );
}

export async function getExpiredNominees() {
  return adminClient.query(
    {
      nominees: [
        {
          where: {
            ended: {
              _eq: false,
            },
            expiry_date: { _lte: DateTime.now().toISO() },
          },
        },
        {
          id: true,
          name: true,
          circle_id: true,
          nominations_aggregate: [{}, { aggregate: { count: [{}, true] } }],
        },
      ],
    },
    {
      operationName: 'getExpiredNominees',
    }
  );
}

export async function checkAddressAdminInOrg(
  address: string,
  organization_id: number,
  organization_name = '%%'
) {
  const { profiles } = await adminClient.query(
    {
      profiles: [
        {
          where: {
            address: { _ilike: address },
            users: {
              role: { _eq: 1 },
              circle: {
                organization_id: { _eq: organization_id },
                organization: { name: { _ilike: organization_name } },
              },
            },
          },
        },
        {
          id: true,
        },
      ],
    },
    {
      operationName: 'checkAddressAdminInOrg',
    }
  );
  return profiles.length > 0;
}

export async function getExistingVouch(nomineeId: number, voucherId: number) {
  return adminClient.query(
    {
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
    },
    {
      operationName: 'getExistingVouch',
    }
  );
}

export async function getOverlappingEpoch(
  start_date: DateTime,
  end_date: DateTime,
  circle_id: number,
  ignore_epoch_id?: number
): Promise<typeof epoch | undefined> {
  const whereCondition: ValueTypes['epochs_bool_exp'] = {
    circle_id: { _eq: circle_id },
    _or: [
      {
        start_date: { _lt: end_date.toISO() },
        end_date: { _gte: end_date.toISO() },
      },
      {
        start_date: { _lte: start_date.toISO() },
        end_date: { _gt: start_date.toISO() },
      },
    ],
  };

  if (ignore_epoch_id) {
    whereCondition.id = { _neq: ignore_epoch_id };
  }
  const {
    epochs: [epoch],
  } = await adminClient.query(
    {
      epochs: [
        {
          limit: 1,
          where: whereCondition,
        },
        {
          id: true,
          start_date: true,
          end_date: true,
        },
      ],
    },
    {
      operationName: 'getOverlappingEpoch',
    }
  );
  return epoch;
}

export async function getRepeatingEpoch(
  circle_id: number
): Promise<typeof repeatingEpoch | undefined> {
  const {
    epochs: [repeatingEpoch],
  } = await adminClient.query(
    {
      epochs: [
        {
          limit: 1,
          where: {
            ended: { _eq: false },
            circle_id: { _eq: circle_id },
            repeat: { _gte: EPOCH_REPEAT.WEEKLY },
          },
        },
        {
          id: true,
          start_date: true,
          end_date: true,
        },
      ],
    },
    {
      operationName: 'getRepeatingEpoch',
    }
  );
  return repeatingEpoch;
}

export async function getAddress(profileId: number) {
  const { profiles } = await adminClient.query(
    {
      profiles: [
        {
          where: {
            id: {
              _eq: profileId,
            },
          },
        },
        {
          address: true,
        },
      ],
    },
    {
      operationName: 'getAddress',
    }
  );
  const profile = profiles.pop();
  if (!profile) {
    throw new Error('address not found for profile');
  }
  return profile.address;
}

export async function getEpoch(
  circle_id: number,
  epoch_id?: number,
  number?: number
): Promise<typeof epoch | undefined> {
  const whereCondition: ValueTypes['epochs_bool_exp'] = {
    circle_id: { _eq: circle_id },
  };
  if (epoch_id) {
    whereCondition.id = { _eq: epoch_id };
  } else if (number) {
    whereCondition.number = { _eq: number };
  }

  const {
    epochs: [epoch],
  } = await adminClient.query(
    {
      epochs: [
        {
          limit: 1,
          where: whereCondition,
        },
        {
          id: true,
          start_date: true,
          end_date: true,
          grant: true,
          number: true,
          circle: {
            name: true,
            organization: {
              name: true,
            },
          },
          token_gifts: [
            { where: { recipient: { deleted_at: { _is_null: true } } } },
            {
              tokens: true,
            },
          ],
        },
      ],
    },
    {
      operationName: 'getEpoch',
    }
  );
  return epoch;
}

export async function getVaultForAddress(address: string, vaultId: number) {
  const result = await adminClient.query({
    vaults_by_pk: [
      {
        id: vaultId,
      },
      {
        organization: {
          circles: [
            { where: { users: { address: { _eq: address } } } },
            { id: true },
          ],
        },
      },
    ],
  });
  return result.vaults_by_pk;
}

export async function getDistributionForVault({
  vault_id,
  tx_hash,
  distribution_id,
}: {
  vault_id: number;
  tx_hash: string;
  distribution_id: number;
}) {
  const result = await adminClient.query({
    distributions: [
      {
        where: {
          id: { _eq: distribution_id },
          tx_hash: { _eq: tx_hash },
          vault_id: { _eq: vault_id },
        },
      },
      { __typename: true },
    ],
  });
  return result.distributions;
}
