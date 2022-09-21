import { DateTime } from 'luxon';

import { adminClient } from '../api-lib/gql/adminClient';

import {
  getAvatars,
  getMembershipInput,
  makeEpoch,
  createGifts,
  insertMemberships,
  getCircleName,
  makeManyEpochs,
  createContributions,
} from './util/seed';

const { CI } = process.env;

const startTime = Date.now();

async function main() {
  await createFreshOpenEpochDevAdmin();
  const circleId = await createFreshOpenEpoch();
  await createFreshOpenEpochNoDev();
  await createEndedEpochWithGifts();
  await createCircleWithPendingGiftsEndingSoon();
  await createCircleWithGiftsNotYetEnded();
  const protocolId = await getProtocolIdForCircle(circleId);
  await createCircleInOrgButNoDevMember(protocolId!);
  await createFreshOpenEpochDevAdminWithFixedPaymentToken();
  await createEndedEpochWithGiftsForClaims();

  // eslint-disable-next-line no-console
  CI ? console.log('Skipping avatars') : await getAvatars();
}

main()
  // eslint-disable-next-line no-console
  .then(() => console.log(`Finished seeding in ${Date.now() - startTime}ms`))
  .catch(console.error);

async function getProtocolIdForCircle(circleId: number) {
  const { circles_by_pk } = await adminClient.query({
    circles_by_pk: [
      {
        id: circleId,
      },
      {
        protocol_id: true,
      },
    ],
  });
  return circles_by_pk?.protocol_id;
}
async function createCircleWithGiftsNotYetEnded() {
  const result = await insertMemberships(
    getMembershipInput(
      {
        protocolInput: { name: 'Closed Epoch not Ended' },
        circlesInput: [
          {
            name: getCircleName() + ' auto opt-out',
            auto_opt_out: true,
            default_opt_in: true,
            min_vouches: 2,
            nomination_days_limit: 1,
            only_giver_vouch: false,
            token_name: 'GIVE',
            vouching: true,
          },
        ],
      },
      {}
    )
  );

  const circleId = result[0].circle_id;
  const epochId = await makeEpoch(
    circleId,
    DateTime.now().minus({ days: 8 }),
    DateTime.now().minus({ days: 1 }),
    1,
    false
  );
  await createContributions(result, circleId);
  await createGifts(result, epochId);
  return circleId;
}

async function createFreshOpenEpochNoDev() {
  const result = await insertMemberships(
    getMembershipInput({ protocolInput: { name: 'Fresh Open Epoch No Dev' } })
  );
  const circleId = result[0].circle_id;
  await makeEpoch(
    circleId,
    DateTime.now().minus({ hours: 1 }),
    DateTime.now().plus({ days: 6, hours: 23 }),
    1
  );
}

async function createFreshOpenEpochDevAdmin() {
  const result = await insertMemberships(
    getMembershipInput(
      { protocolInput: { name: 'Fresh Open Epoch Admin' } },
      {}
    )
  );
  const circleId = result[0].circle_id;
  await makeEpoch(
    circleId,
    DateTime.now().minus({ hours: 1 }),
    DateTime.now().plus({ days: 6, hours: 23 }),
    1
  );
}

async function createFreshOpenEpoch() {
  const result = await insertMemberships(
    getMembershipInput(
      { protocolInput: { name: 'Fresh Open Epoch Regular User' } },
      { role: 0 }
    )
  );
  const circleId = result[0].circle_id;
  await makeEpoch(
    circleId,
    DateTime.now().minus({ hours: 1 }),
    DateTime.now().plus({ days: 6, hours: 23 }),
    1
  );
  return circleId;
}

async function createEndedEpochWithGifts() {
  const epochDates = [
    [40, 33],
    [32, 25],
    [24, 17],
    [16, 9],
    [8, 1],
  ];
  makeManyEpochs('Ended Epoch With Gifts', epochDates);
}

async function createEndedEpochWithGiftsForClaims() {
  const epochDates = [
    [71, 64],
    [63, 57],
    [56, 49],
    [48, 41],
    [40, 33],
    [32, 25],
    [24, 17],
    [16, 9],
    [8, 1],
  ];
  makeManyEpochs('Org for Claims', epochDates);
}

async function createCircleWithPendingGiftsEndingSoon() {
  const result = await insertMemberships(
    getMembershipInput({ protocolInput: { name: 'Open Epoch With Gifts' } }, {})
  );
  const circleId = result[0].circle_id;
  const epochId = await makeEpoch(
    circleId,
    DateTime.now().minus({ days: 6 }),
    DateTime.now().plus({ hours: 6 }),
    1
  );
  await createContributions(result, circleId);
  await createGifts(result, epochId);
}

async function createCircleInOrgButNoDevMember(protocolId: number) {
  await adminClient.mutate({
    insert_circles: [
      {
        objects: [
          {
            name: getCircleName() + ' not a member',
            auto_opt_out: true,
            default_opt_in: true,
            min_vouches: 2,
            protocol_id: protocolId,
            nomination_days_limit: 1,
            only_giver_vouch: false,
            token_name: 'GIVE',
            vouching: true,
          },
        ],
      },
      {
        returning: {
          id: true,
        },
      },
    ],
  });
}

async function createFreshOpenEpochDevAdminWithFixedPaymentToken() {
  const result = await insertMemberships(
    getMembershipInput(
      {
        protocolInput: {
          name: 'Fresh Open Epoch Admin With Fixed Payment Token',
        },
        circlesInput: [
          {
            name: getCircleName(),
            fixed_payment_token_type: 'DAI',
          },
        ],
      },
      {}
    )
  );
  const circleId = result[0].circle_id;
  await makeEpoch(
    circleId,
    DateTime.now().minus({ hours: 1 }),
    DateTime.now().plus({ days: 6, hours: 23 }),
    1
  );
}
