import { DateTime } from 'luxon';

import { adminClient } from '../api-lib/gql/adminClient';

import { init as initOrgMembership } from './repl/org_membership';
import {
  createContributions,
  createGifts,
  createProfiles,
  createSampleDAOProfiles,
  getAvatars,
  getCircleName,
  getMembershipInput,
  insertMemberships,
  insertOrganization,
  makeEpoch,
  makeManyEpochs,
} from './util/seed';

const startTime = Date.now();

async function main() {
  const devProfileId = await createProfiles();
  await createSampleDAOProfiles();
  await createFreshOpenEpochDevAdmin();
  await createFreshOpenEpoch();
  await createFreshOpenEpochNoDev();
  await createEndedEpochWithGifts();
  await createCircleWithPendingGiftsEndingSoon();
  await createCircleWithGiftsNotYetEnded();
  await createFreshOpenEpochDevAdminWithFixedPaymentToken();
  await createEndedEpochWithGiftsForClaims();
  await getAvatars();
  await (await initOrgMembership()).createMembersForAllOrgs();
  await createOrgFollower(devProfileId);
}

main()
  // eslint-disable-next-line no-console
  .then(() => console.log(`Finished seeding in ${Date.now() - startTime}ms`))
  .catch(console.error);

async function createCircleWithGiftsNotYetEnded() {
  const organizationId = await insertOrganization('Closed Epoch not Ended');
  const result = await insertMemberships(
    organizationId,
    getMembershipInput(
      {
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

  //second circle and not a member
  await insertMemberships(
    organizationId,
    getMembershipInput({
      circlesInput: [
        {
          name: getCircleName() + ' not a member',
        },
      ],
    })
  );
}

async function createFreshOpenEpochNoDev() {
  const organizationId = await insertOrganization('Fresh Open Epoch No Dev');
  const result = await insertMemberships(
    organizationId,
    getMembershipInput({})
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
  const organizationId = await insertOrganization('Fresh Open Epoch Admin');
  const result = await insertMemberships(
    organizationId,
    getMembershipInput({}, {})
  );
  const circleId = result[0].circle_id;
  await makeEpoch(
    circleId,
    DateTime.now().minus({ hours: 1 }),
    DateTime.now().plus({ days: 6, hours: 23 }),
    1
  );

  //second circle and not an admin
  await insertMemberships(organizationId, getMembershipInput({}, { role: 0 }));
}

async function createFreshOpenEpoch() {
  const organizationId = await insertOrganization(
    'Fresh Open Epoch Regular User'
  );
  const result = await insertMemberships(
    organizationId,
    getMembershipInput({}, { role: 0 })
  );

  const circleId = result[0].circle_id;
  await makeEpoch(
    circleId,
    DateTime.now().minus({ hours: 1 }),
    DateTime.now().plus({ days: 6, hours: 23 }),
    1
  );

  //second circle and not a member
  await insertMemberships(
    organizationId,
    getMembershipInput({
      circlesInput: [
        {
          name: getCircleName() + ' not a member',
          auto_opt_out: true,
          default_opt_in: true,
          min_vouches: 2,
          organization_id: organizationId,
          nomination_days_limit: 1,
          only_giver_vouch: false,
          token_name: 'GIVE',
          vouching: true,
        },
      ],
    })
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
  const organizationId = await insertOrganization('Open Epoch With Gifts');

  const result = await insertMemberships(
    organizationId,
    getMembershipInput({})
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

async function createFreshOpenEpochDevAdminWithFixedPaymentToken() {
  const organizationId = await insertOrganization(
    'Fresh Open Epoch Admin With Fixed Payment Token'
  );

  const result = await insertMemberships(
    organizationId,
    getMembershipInput(
      {
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

async function createOrgFollower(profileId: number) {
  const organizationId = await insertOrganization('Org Follower');

  const result = await insertMemberships(
    organizationId,
    getMembershipInput({})
  );
  const circleId = result[0].circle_id;
  await makeEpoch(
    circleId,
    DateTime.now().minus({ hours: 1 }),
    DateTime.now().plus({ days: 6, hours: 23 }),
    1
  );
  /* create a second circle*/
  await insertMemberships(organizationId, getMembershipInput({}));

  await adminClient.mutate(
    {
      insert_org_members_one: [
        {
          object: {
            org_id: organizationId,
            profile_id: profileId,
          },
        },
        {
          id: true,
        },
      ],
    },
    { operationName: 'seed_insertOrgMember' }
  );
}
