import { HDNode } from '@ethersproject/hdnode';
import { faker } from '@faker-js/faker';
import { address } from 'faker';
import { DateTime } from 'luxon';
import fetch from 'node-fetch';

import {
  LOCAL_SEED_ADDRESS,
  LOCAL_SEED_ADDRESS2,
  COORDINAPE_USER_ADDRESS,
} from '../../api-lib/config';
import {
  profiles_constraint,
  profiles_update_column,
  ValueTypes,
} from '../../api-lib/gql/__generated__/zeus';
import { adminClient } from '../../api-lib/gql/adminClient';
import { resizeAvatar } from '../../api-lib/images';
import { ImageUpdater } from '../../api-lib/ImageUpdater';
import { profileUpdateAvatarMutation } from '../../api-lib/profileImages';
import { Awaited } from '../../api-lib/ts4.5shim';
import { sampleMemberData } from '../../api/hasura/actions/_handlers/createSampleCircle_data';

import { getAccountPath, SEED_PHRASE } from './eth';

faker.seed(4);

const devAddress = LOCAL_SEED_ADDRESS.toLowerCase();
const devAddress2 = LOCAL_SEED_ADDRESS2.toLowerCase();

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

export async function insertOrganization(name: string): Promise<number> {
  const result = await adminClient.mutate(
    {
      insert_organizations_one: [
        {
          object: { name: name ?? getOrganizationName() },
        },
        { id: true },
      ],
    },
    { operationName: 'seed_data' }
  );
  if (!result.insert_organizations_one) throw new Error(`org not created`);
  return result.insert_organizations_one.id;
}

type CircleInput = {
  circlesInput: Array<ValueTypes['circles_insert_input']>;
  organizationInput: OrganizationInput;
};

export async function insertCircles(
  organizationId: number,
  input: CircleInput
) {
  const circleInputWithOrganization = input.circlesInput.map(circle => ({
    ...circle,
    min_vouches: 2,
    organization_id: organizationId,
  }));
  const result = await adminClient.mutate(
    {
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
    },
    { operationName: 'seed_data' }
  );
  if (!result.insert_circles) throw new Error(`circles not created`);
  return result.insert_circles.returning.map(r => r.id);
}

type MembershipInput = CircleInput & {
  membersInput: Array<ValueTypes['users_insert_input']>;
};

export async function insertMemberships(
  organizationId: number,
  input: MembershipInput
) {
  const circleIds = await insertCircles(organizationId, input);

  const { profiles } = await adminClient.query(
    {
      profiles: [
        {
          where: {
            _or: input.membersInput.map(m => ({
              address: { _eq: m.address?.toLowerCase() },
            })),
          },
        },
        { id: true, address: true },
      ],
    },
    { operationName: 'seed_getProfileIds' }
  );

  const membersInputWithCircleId = circleIds.flatMap(circle_id =>
    input.membersInput.map(member => ({
      ...member,
      circle_id,
      give_token_remaining: member.starting_tokens ?? 100,
      profile_id: profiles.find(
        p => p.address.toLowerCase() === member.address?.toLowerCase()
      )?.id,
    }))
  );
  const result = await adminClient.mutate(
    {
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
    },
    { operationName: 'seed_data' }
  );
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
  await adminClient.mutate(
    {
      insert_profiles_one: [
        { object: { name: 'Coordinape', address: COORDINAPE_USER_ADDRESS } },
        { id: true },
      ],
    },
    { operationName: 'create_CoordinapeProfile' }
  );

  const { profiles } = await adminClient.query(
    {
      profiles: [
        { where: { address: { _ilike: devAddress } } },
        {
          id: true,
        },
      ],
    },
    { operationName: 'seed_getDevProfileId' }
  );

  let devProfileId = profiles.pop()?.id;

  if (!devProfileId) {
    const result = await adminClient.mutate(
      {
        insert_profiles_one: [
          {
            object: {
              address: devAddress,
              name: 'Meee',
            },
          },
          {
            id: true,
          },
        ],
      },
      { operationName: 'create_devProfile' }
    );
    devProfileId = result.insert_profiles_one?.id;
  }

  //create second dev profile
  await adminClient.mutate(
    {
      insert_profiles_one: [
        {
          object: {
            address: devAddress2,
            name: 'Meee2',
          },
          on_conflict: {
            constraint: profiles_constraint.profiles_address_key,
            update_columns: [],
          },
        },
        {
          id: true,
        },
      ],
    },
    { operationName: 'create_devProfile2' }
  );

  await adminClient.mutate(
    {
      insert_profiles: [
        {
          objects: users.map(user => {
            return {
              address: user.address,
              name: user.name,
            };
          }),
          on_conflict: {
            constraint: profiles_constraint.profiles_address_key,
            update_columns: [profiles_update_column.name],
            where: {
              name: { _is_null: true },
            },
          },
        },
        {
          returning: {
            id: true,
          },
        },
      ],
    },
    { operationName: 'seed_data' }
  );

  return devProfileId;
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
        name: undefined,
      },
    ].concat(
      users.slice(1, 5).map(user => ({
        ...user,
        bio: faker.lorem.sentences(3),
        role: 0,
        starting_tokens: 50,
        non_receiver: false,
        name: undefined,
      })),
      users.slice(5, 10).map(user => ({
        ...user,
        bio: faker.lorem.sentences(3),
        role: 0,
        starting_tokens: 0,
        non_giver: true,
        non_receiver: false,
        name: undefined,
      })),
      users.slice(10, 15).map(user => ({
        ...user,
        bio: faker.lorem.sentences(3),
        role: 0,
        starting_tokens: 0,
        non_giver: true,
        non_receiver: true,
        name: undefined,
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

  membersInput.unshift({
    address: devAddress2,
    role: 1,
  });

  if (devUser)
    membersInput.unshift({
      address: devAddress,
      role: 1,
      ...devUser,
    });

  return { organizationInput, circlesInput, membersInput };
}

export async function makeManyEpochs(orgName: string, epochDates: number[][]) {
  const organizationId = await insertOrganization(orgName);
  const result = await insertMemberships(
    organizationId,
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

  //second circle and not an admin
  const secondCircle = await insertMemberships(
    organizationId,
    getMembershipInput({}, { role: 0 })
  );
  const circleId2 = secondCircle[0].circle_id;

  for (let i = 0; i < epochDates.length; i++) {
    const epochId2 = await makeEpoch(
      circleId2,
      DateTime.now().minus({ days: epochDates[i][0] }),
      DateTime.now().minus({ days: epochDates[i][1] }),
      i + 1
    );
    await createContributions(secondCircle, circleId2);
    await createGifts(secondCircle, epochId2, 9, 100, false);
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

  const result = await adminClient.mutate(
    {
      insert_epochs_one: [{ object: epoch }, { id: true }],
    },
    { operationName: 'seed_data' }
  );
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
          created_at: datetime.toISO(),
        }))
      );
    }
  }

  await adminClient.mutate(
    {
      insert_contributions: [
        { objects: contribution_objects },
        { __typename: true },
      ],
    },
    { operationName: 'seed_data' }
  );
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
    await adminClient.mutate(
      {
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
                note: faker.lorem.sentences(3),
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
                note: faker.lorem.sentences(3),
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
      },
      { operationName: 'seed_data' }
    );
  }
}

function summation(x: number, increment: number): number {
  if (x <= 0) return 0;
  return x + summation(x - increment, increment);
}

export const createSampleDAOProfiles = async () => {
  await adminClient.mutate(
    {
      insert_profiles: [
        {
          objects: sampleMemberData.map(user => {
            return {
              address: user.address,
              name: user.name,
              avatar: user.avatar,
            };
          }),
        },
        {
          returning: {
            id: true,
          },
        },
      ],
    },
    { operationName: 'seed_data' }
  );
};
