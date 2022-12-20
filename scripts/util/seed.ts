import { HDNode } from '@ethersproject/hdnode';
import { faker } from '@faker-js/faker';
import { DateTime } from 'luxon';
import fetch from 'node-fetch';

import { LOCAL_SEED_ADDRESS } from '../../api-lib/config';
import { ValueTypes } from '../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../api-lib/gql/adminClient';
import { resizeAvatar } from '../../api-lib/images';
import { ImageUpdater } from '../../api-lib/ImageUpdater';
import { profileUpdateAvatarMutation } from '../../api-lib/profileImages';
import { Awaited } from '../../api-lib/ts4.5shim';

faker.seed(4);

import { SEED_PHRASE, getAccountPath } from './eth';

const devAddress = LOCAL_SEED_ADDRESS.toLowerCase();

const users = new Array(50).fill(null).map((_, idx) => ({
  name: faker.unique(faker.name.firstName),
  address: HDNode.fromMnemonic(SEED_PHRASE)
    .derivePath(getAccountPath(idx))
    .address.toLowerCase(),
}));

export function getOrganizationName() {
  return faker.unique(faker.company.companyName);
}

export function getCircleName() {
  try {
    return faker.unique(faker.commerce.department);
  } catch (e) {
    return faker.commerce.color();
  }
}

type OrganizationInput = {
  name?: string;
};

async function insertOrganization(input: OrganizationInput): Promise<number> {
  const result = await adminClient.mutate({
    insert_organizations_one: [
      {
        object: { name: input.name ?? getOrganizationName() },
      },
      { id: true },
    ],
  });
  if (!result.insert_organizations_one) throw new Error(`org not created`);
  return result.insert_organizations_one.id;
}

type CircleInput = {
  circlesInput: Array<ValueTypes['circles_insert_input']>;
  organizationInput: OrganizationInput;
};

export async function insertCircles(input: CircleInput) {
  const organizationId = await insertOrganization(input.organizationInput);

  const circleInputWithOrganization = input.circlesInput.map(circle => ({
    ...circle,
    min_vouches: 2,
    organization_id: organizationId,
  }));
  const result = await adminClient.mutate({
    insert_circles: [
      {
        objects: circleInputWithOrganization,
      },
      {
        returning: {
          id: true,
        },
      },
    ],
  });
  if (!result.insert_circles) throw new Error(`circles not created`);
  return result.insert_circles.returning.map(r => r.id);
}

type MembershipInput = CircleInput & {
  membersInput: Array<ValueTypes['users_insert_input']>;
};

export async function insertMemberships(input: MembershipInput) {
  const circleIds = await insertCircles(input);
  const membersInputWithCircleId = circleIds.flatMap(circle_id =>
    input.membersInput.map(member => ({
      ...member,
      circle_id,
      give_token_remaining: member.starting_tokens ?? 100,
    }))
  );
  const result = await adminClient.mutate({
    insert_users: [
      {
        objects: membersInputWithCircleId,
      },
      {
        returning: {
          id: true,
          address: true,
          circle_id: true,
          non_giver: true,
          non_receiver: true,
          give_token_remaining: true,
        },
      },
    ],
  });
  if (!result.insert_users) throw new Error(`users not created`);
  return result.insert_users.returning;
}

async function addAvatar(profileId: number) {
  const updater = new ImageUpdater<{ id: number }>(
    resizeAvatar,
    profileUpdateAvatarMutation(profileId)
  );
  const imageData = await getBase64Avatar();
  await updater.uploadImage(imageData);
}

export async function getAvatars() {
  const avatarPromises = Array(16)
    .fill(null)
    .map(async (_, idx) => addAvatar(idx + 2));
  await Promise.allSettled(avatarPromises);
}

export async function createProfiles() {
  await adminClient.mutate({
    insert_profiles: [
      {
        objects: users.map(user => {
          return {
            address: user.address,
            name: user.name,
          };
        }),
      },
      {
        returning: {
          id: true,
        },
      },
    ],
  });
}

async function getBase64Avatar() {
  const url = faker.image.avatar();
  const response = await fetch(url);
  const buffer = await response.buffer();
  return buffer.toString('base64');
}

export function getMembershipInput(
  input: Partial<MembershipInput> = {},
  devUser?: ValueTypes['users_insert_input']
): MembershipInput {
  const temp: MembershipInput = {
    organizationInput: {},
    circlesInput: [
      {
        name: getCircleName(),
        auto_opt_out: false,
        default_opt_in: true,
        min_vouches: 2,
        nomination_days_limit: 1,
        only_giver_vouch: false,
        token_name: 'GIVE',
        vouching: true,
      },
    ],
    membersInput: [
      {
        ...users[0],
        bio: faker.lorem.sentences(3),
        role: 1,
        non_receiver: false,
      },
    ].concat(
      users.slice(1, 5).map(user => ({
        ...user,
        bio: faker.lorem.sentences(3),
        role: 0,
        starting_tokens: 50,
        non_receiver: false,
      })),
      users.slice(5, 10).map(user => ({
        ...user,
        bio: faker.lorem.sentences(3),
        role: 0,
        starting_tokens: 0,
        non_giver: true,
        non_receiver: false,
      })),
      users.slice(10, 15).map(user => ({
        ...user,
        bio: faker.lorem.sentences(3),
        role: 0,
        starting_tokens: 0,
        non_giver: true,
        non_receiver: true,
      }))
    ),
  };
  const organizationInput = input.organizationInput
    ? input.organizationInput
    : temp.organizationInput;

  const circlesInput = input.circlesInput || temp.circlesInput;

  const membersInput = input.membersInput
    ? [...temp.membersInput, ...input.membersInput]
    : temp.membersInput;

  if (devUser)
    membersInput.unshift({
      name: 'Meee',
      address: devAddress,
      role: 1,
      ...devUser,
    });

  return { organizationInput, circlesInput, membersInput };
}

export async function makeManyEpochs(orgName: string, epochDates: number[][]) {
  const result = await insertMemberships(
    getMembershipInput({ organizationInput: { name: orgName } }, {})
  );
  const circleId = result[0].circle_id;

  for (let i = 0; i < epochDates.length; i++) {
    const epochId = await makeEpoch(
      circleId,
      DateTime.now().minus({ days: epochDates[i][0] }),
      DateTime.now().minus({ days: epochDates[i][1] }),
      i + 1
    );
    await createContributions(result, circleId);
    await createGifts(result, epochId, 9, 100, false);
  }
}

export async function makeEpoch(
  circleId: number,
  start: DateTime,
  end: DateTime,
  num: number,
  ended?: boolean
) {
  const epoch = {
    number: num,
    circle_id: circleId,
    start_date: start.toISO(),
    end_date: end.toISO(),
    ended: ended ?? end.diffNow().milliseconds < 0,
  } as ValueTypes['epochs_insert_input'];

  const result = await adminClient.mutate({
    insert_epochs_one: [{ object: epoch }, { id: true }],
  });
  if (!result.insert_epochs_one) throw new Error('no epoch created');
  return result.insert_epochs_one.id;
}

type MemberInput = Awaited<ReturnType<typeof insertMemberships>>;

// Inputs are functions in order to defer evaluation of the faker libs
function generateContributions(
  input: () => ValueTypes['contributions_insert_input'],
  count = 8
): Array<ValueTypes['contributions_insert_input']> {
  return Array(count)
    .fill(input)
    .map(x => x());
}
export async function createContributions(
  input: MemberInput,
  circle_id: number,
  weekIncrement = 2,
  userSlice = [0, 6]
) {
  const users = input.slice(...userSlice);

  let contribution_objects: Array<ValueTypes['contributions_insert_input']> =
    [];
  for (const user of users) {
    for (
      let datetime = DateTime.now();
      datetime > DateTime.now().minus({ years: 1 });
      datetime = datetime.minus({ weeks: weekIncrement })
    ) {
      contribution_objects = contribution_objects.concat(
        generateContributions(() => ({
          circle_id,
          description: faker.lorem.sentences(3),
          user_id: user.id,
          datetime_created: datetime.toISO(),
        }))
      );
    }
  }

  await adminClient.mutate({
    insert_contributions: [
      { objects: contribution_objects },
      { __typename: true },
    ],
  });
}

export async function createGifts(
  input: MemberInput,
  epochId: number,
  amountIncrement = 7,
  startingTokens = 100,
  pending = true,
  userIdx = 0,
  memberSlice = [1, 6]
) {
  const user = input[userIdx];
  const members = input.slice(...memberSlice);
  for (let i = 0; i < members.length; i++) {
    const member = members[i];
    let amount = amountIncrement * (i + 1);
    if (member.circle_id !== user.circle_id) break;
    // can't exceed starting token amount
    if (summation(amount, amountIncrement) > startingTokens) {
      amount = amount - (summation(amount, amountIncrement) - startingTokens);
      if (amount <= 0) break;
    }
    if (member.address === user.address) continue;
    await adminClient.mutate({
      [pending ? 'insert_pending_token_gifts' : 'insert_token_gifts']: [
        {
          objects: [
            {
              sender_id: member.id,
              epoch_id: epochId,
              sender_address: member.address,
              circle_id: user.circle_id,
              created_at: DateTime.now()
                .minus({ hours: 9 * i })
                .toISO(),
              updated_at: DateTime.now()
                .minus({ hours: 9 * i })
                .toISO(),
              recipient_id: user.id,
              recipient_address: user.address,
              tokens: amount,
            },
            {
              sender_id: user.id,
              epoch_id: epochId,
              sender_address: user.address,
              circle_id: user.circle_id,
              created_at: DateTime.now()
                .minus({ hours: 9 * i })
                .toISO(),
              updated_at: DateTime.now()
                .minus({ hours: 9 * i })
                .toISO(),
              recipient_id: member.id,
              recipient_address: member.address,
              tokens: amount,
            },
          ],
        },
        { __typename: true },
      ],
      __alias: pending
        ? {
            member: {
              update_users_by_pk: [
                {
                  pk_columns: { id: member.id },
                  _inc: {
                    give_token_received: amount,
                    give_token_remaining: -amount,
                  },
                },
                { __typename: true },
              ],
            },
            user: {
              update_users_by_pk: [
                {
                  pk_columns: { id: user.id },
                  _inc: {
                    give_token_received: amount,
                    give_token_remaining: -amount,
                  },
                },
                { __typename: true },
              ],
            },
          }
        : undefined,
    });
  }
}

function summation(x: number, increment: number): number {
  if (x <= 0) return 0;
  return x + summation(x - increment, increment);
}
