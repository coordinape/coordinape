import { faker } from '@faker-js/faker';
import { DateTime } from 'luxon';

import {
  getAvatars,
  getMembershipInput,
  makeEpoch,
  createGifts,
  insertMemberships,
  getCircleName,
} from './util/seed';

faker.seed(4);

async function main() {
  await createFreshOpenEpoch();
  await createEndedEpochWithGifts();
  await createCircleWithPendingGiftsEndingSoon();
  await createCircleWithGiftsNotYetEnded();
  await createFreshOpenEpochNoDev();
  await createFreshOpenEpochDevAdmin();
  await getAvatars();
}

main()
  // eslint-disable-next-line no-console
  .then(() => console.log('Finished Seeding DB'))
  .catch(console.error);

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
  await createGifts(result, epochId);
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
}

async function createEndedEpochWithGifts() {
  const result = await insertMemberships(
    getMembershipInput(
      { protocolInput: { name: 'Ended Epoch With Gifts' } },
      {}
    )
  );
  const circleId = result[0].circle_id;
  const epochId = await makeEpoch(
    circleId,
    DateTime.now().minus({ days: 8 }),
    DateTime.now().minus({ days: 1 }),
    1
  );
  await createGifts(result, epochId, 9, false);
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
  await createGifts(result, epochId);
}
