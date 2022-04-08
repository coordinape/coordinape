import { ethers } from 'ethers';
import faker from 'faker';
import iti from 'itiriri';
import { DateTime, Duration, Interval } from 'luxon';

import { ValueTypes } from '../api-lib/gql/__generated__/zeus';
import * as mutations from '../api-lib/gql/mutations';

const defaults = {
  seed: 9,
  orgCount: 3,
  circleCount: 6,
  profileCount: 50,
  memberCount: 60,
  epochCount: 30,
  giftCount: 20000,
  nomineeCount: 100,
  circleSkew: 0.5,
  membershipSkew: 0.5,
  giveSkew: 0.5,
  epochSkew: 0.5,
  nomineeSkew: 0.5,
  startingTokens: [100, 100, 100, 200, 5000],
};

const BEGIN_DATE = DateTime.fromISO('2021-04-01T00:00:00.000');
const END_DATE = DateTime.fromISO('2022-04-01T00:00:00.000');

type FakeDataParams = typeof defaults;

export type TGiftCommon = {
  circle_id: number;
  epoch_id: number;
  note: string;
  recipient_address: string;
  recipient_id: number;
  sender_address: string;
  sender_id: number;
};

(async function () {
  await insertFakeData(defaults)
    .catch(error => {
      console.error(error);
      process.exit(1);
    })
    .then(res => {
      console.log('Inserted: ', res);
      process.exit(0);
    });
})();

/*
 * insertFakeData
 **/
async function insertFakeData({
  seed,
  orgCount,
  circleCount,
  circleSkew,
  profileCount,
  memberCount,
  epochCount,
  nomineeCount,
  membershipSkew,
  epochSkew,
  giftCount,
  giveSkew,
  startingTokens,
}: FakeDataParams) {
  faker.seed(seed);

  /*
   * Insert Organizations
   **/
  const getCircleCount = inequality(
    circleCount / orgCount,
    orgCount,
    circleSkew
  );
  const orgsResult = (
    await mutations.insertOrganizations(
      makeArray(orgCount).map((x, i) => ({
        name: faker.company.companyName(),
        circles: {
          data: makeArray(getCircleCount(i)).map(() => fakeCircle()),
        },
      }))
    )
  ).insert_organizations?.returning;

  /*
   * Insert Profiles
   **/
  const profileResponse = await mutations.insertProfiles(
    makeArray(profileCount).map(() => fakeProfile())
  );
  const circleIds = orgsResult?.flatMap(o => o.circles.map(c => c.id)) || [];
  const profAddrs =
    profileResponse.insert_profiles?.returning?.map(p => p.address) ?? [];

  /*
   * Insert Memberships
   **/
  const getCircleId = createSampler(circleIds, membershipSkew);
  const getAddr = createSampler(profAddrs, membershipSkew);
  const getStartTokens = createSampler(startingTokens, 1);
  const memberships = getUniquePairs(getCircleId, getAddr, memberCount).map(
    ([circleId, addr]) => fakeMemebership(circleId, addr, getStartTokens)
  );
  const membershipResponse = await mutations.insertMemberships(memberships);
  const members = membershipResponse.insert_users?.returning ?? [];

  /*
   * Insert Epochs
   **/
  const getCircleEpochCount = inequality(
    epochCount,
    circleIds.length,
    epochSkew
  );
  const epochResponse = await mutations.insertEpochs(
    circleIds.flatMap((circleId, i) =>
      fakeEpochs(circleId, getCircleEpochCount(i))
    )
  );
  const epochs = epochResponse.insert_epochs?.returning ?? [];

  /*
   * Insert Gifts and Pending Gifts
   **/
  const { gifts, pendingGifts } = fakeCircleGifts(
    members,
    epochs,
    giftCount,
    giveSkew
  );
  await mutations.insertGifts(gifts);
  await mutations.insertPendingGifts(pendingGifts);

  /*
   * Insert Nominees
   **/
  // const nomineeProfileResponse = await gql.insertProfiles(
  //   makeArray(nomineeCount).map(() => fakeProfile())
  // );
  // const nominees = nomineeProfileResponse.insert_profiles?.returning ?? [];
  const nominees = makeArray(nomineeCount).map(() => fakeProfile());
  const getNominatoor = createSampler(members, membershipSkew);

  const nomineesResponse = (
    await mutations.insertNominees(
      nominees.map(({ address }) => {
        const nominator = getNominatoor();
        const start = DateTime.fromJSDate(
          faker.date.between(BEGIN_DATE.toJSDate(), END_DATE.toJSDate())
        );
        const end = start.plus({ days: 14 });
        return {
          address,
          name: faker.name.firstName(),
          description: faker.lorem.sentences(faker.datatype.number(4)),
          nominated_by_user_id: nominator.id,
          circle_id: nominator.circle_id,
          vouches_required: 3,
          nominated_date: start.toLocaleString(),
          expiry_date: end.toLocaleString(),
          ended: end.diffNow().milliseconds < 0,
        };
      })
    )
  ).insert_nominees?.returning;

  return {
    counts: {
      orgs: orgsResult?.length,
      circles: circleIds?.length,
      profiles: profAddrs.length,
      epochs: epochs.length,
      gifts: gifts.length,
      pendingGifts: pendingGifts.length,
      nominees: nomineesResponse?.length,
    },
  };
}

function makeArray(length: number) {
  return Array(length).fill(null);
}

function getUniquePairs<X extends string | number, Y extends string | number>(
  getX: () => X,
  getY: () => Y,
  num: number
): [X, Y][] {
  const used = new Set();
  let pairs: [X, Y][] = [];

  while (pairs.length < num) {
    const x = getX();
    const y = getY();
    const key = `${x}${y}`;
    if (!used.has(key)) {
      used.add(key);
      pairs = pairs.concat([[x, y]]);
    }
  }
  return pairs;
}

function inequality(average: number, parentCount: number, skew: number) {
  return (i: number) =>
    Math.round(
      Math.max(0, skew * average * (i - (parentCount - 1) / 2) + average)
    );
}

function zeroToOne() {
  return faker.datatype.float({ min: 0, max: 1, precision: 0.00001 });
}

function createSampler<T>(buckets: T[], skew: number) {
  const probs = [...buckets].map((x, i) => buckets.length + skew * i * i);
  const sum = probs.reduce((a, b) => a + b, 0);
  const normalized = probs.map(prob => prob / sum);

  return () => {
    const sample = faker.datatype.float({
      min: 0,
      max: 1,
      precision: 1 / normalized.length ** 3,
    });
    let total = 0;
    for (let i = 0; i < normalized.length; i++) {
      total += normalized[i];
      if (sample < total) return buckets[i];
    }
    return buckets[normalized.length - 1];
  };
}

function fakeCircle() {
  return {
    name: faker.commerce.department(),
    auto_opt_out: false,
    min_vouches: faker.datatype.number({ min: 1, max: 4 }),
  } as ValueTypes['circles_insert_input'];
}

function fakeProfile() {
  return {
    address: new ethers.Wallet(faker.datatype.hexaDecimal(32)).address,
    admin_view: false,
    bio: faker.lorem.paragraph(3),
    website: faker.internet.url(),
  } as ValueTypes['profiles_insert_input'];
}

function fakeMemebership(
  circleId: number,
  address: string,
  getStartingTokens: () => number
) {
  return {
    address,
    name: faker.name.firstName(),
    circle_id: circleId,
    starting_tokens: getStartingTokens(),
    non_receiver: zeroToOne() < 0.2,
    non_giver: zeroToOne() < 0.2,
    fixed_non_receiver: zeroToOne() < 0.1,
  } as ValueTypes['users_insert_input'];
}

function fakeEpoch(
  circleId: number,
  start: DateTime,
  end: DateTime,
  num: number
) {
  return {
    number: num,
    circle_id: circleId,
    start_date: start.toISO(),
    end_date: end.toISO(),
    ended: end.diffNow().milliseconds < 0,
  } as ValueTypes['epochs_insert_input'];
}

function fakeEpochs(circleId: number, count: number) {
  let start = DateTime.fromJSDate(
    faker.date.between(BEGIN_DATE.toJSDate(), END_DATE.toJSDate())
  );

  const intervals: Interval[] = [];
  while (intervals.length < count) {
    const end = start.plus(
      Duration.fromObject({
        days: faker.datatype.number({ min: 4, max: 28 }),
      })
    );
    intervals.push(Interval.fromDateTimes(start, end));
    start = end.plus(
      Duration.fromObject({
        days: faker.datatype.number({ min: 4, max: 28 }),
      })
    );
  }

  return intervals.map((interval, j) =>
    fakeEpoch(circleId, interval.start, interval.end, j + 1)
  );
}

type Unwrap<T> = T extends Promise<infer U>
  ? U
  : T extends (...args: any) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : T;

type TMemberships = Exclude<
  Unwrap<ReturnType<typeof mutations.insertMemberships>>['insert_users'],
  undefined
>['returning'];

function fakeCircleGifts(
  members: TMemberships,
  epochs: { id: number; circle_id: number; ended: boolean }[],
  count: number,
  skew: number | [number, number, number, number]
) {
  const [circleSkew, giveSkew, recieveSkew, epochSkew] =
    typeof skew === 'number' ? [skew, skew, skew, skew] : skew;

  const membersByCircle = iti(members)
    .groupBy(m => m.circle_id)
    .toMap(
      ([cid]) => cid,
      ([, u]) => u.toArray()
    );
  const used = new Set<string>();
  const gifts: TGiftCommon[] = [];
  const pendingGifts: TGiftCommon[] = [];
  const giftCompareKey = (g: TGiftCommon) =>
    `e${g.epoch_id}-${g.sender_id}>${g.recipient_id}`;

  const getCircleId = createSampler(
    iti(membersByCircle.keys()).toArray() as number[],
    circleSkew
  );
  const roundSize = Math.ceil(count / membersByCircle.size / 3);

  const tokenMap = iti(members).toMap(
    m => m.id,
    m => m.starting_tokens
  );
  let n = 0;
  while (gifts.length + pendingGifts.length < count) {
    n++;
    if (n > count) {
      // This could happen if there aren't availableEpochs or we run out of tokens
      // Because the available memberships don't have enough receivers
      throw new Error(
        `Unable to satisfy constraints, gifts: ${gifts.length}, ${pendingGifts.length}`
      );
    }
    const circleId = getCircleId();
    const users = membersByCircle.get(circleId);
    const availableEpochs = epochs.filter(e => e.circle_id === circleId);
    if (!availableEpochs.length) {
      continue;
    }
    const getEpoch = createSampler(availableEpochs, epochSkew);

    const getSender = createSampler(users || [], giveSkew);
    const getRecipient = createSampler(users || [], recieveSkew);
    for (let i = 0; i < roundSize; i++) {
      const recipient = getRecipient();
      const sender = getSender();
      if (
        sender.non_giver ||
        recipient.non_receiver ||
        recipient.fixed_non_receiver
      ) {
        continue;
      }
      const epoch = getEpoch();
      const remaining = tokenMap.get(sender.id) || 0;
      const tokens = faker.datatype.number({ min: 0, max: remaining });
      const g = {
        circle_id: circleId,
        epoch_id: epoch.id,
        note: faker.lorem.lines(faker.datatype.number(3)),
        recipient_address: recipient.address,
        recipient_id: recipient.id,
        sender_address: sender.address,
        sender_id: sender.id,
        tokens,
      };

      if (!used.has(giftCompareKey(g))) {
        if (epoch.ended) {
          gifts.push(g);
        } else {
          pendingGifts.push(g);
        }
        tokenMap.set(sender.id, remaining - tokens);
        used.add(giftCompareKey(g));
      }
    }
  }

  return { gifts, pendingGifts };
}
