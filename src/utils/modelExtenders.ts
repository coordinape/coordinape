/**
 *
 * DEPRECATED -- please use Zeus types directly instead
 *
 */

import { DateTime } from 'luxon';

import { USER_ROLE_ADMIN, USER_ROLE_COORDINAPE } from 'config/constants';
import { assertDef } from 'utils';

import {
  ITiming,
  IApiEpoch,
  IEpoch,
  ITokenGift,
  ICircle,
  IUser,
  IApiCircle,
  IApiTokenGift,
  IApiUser,
  INominee,
  IApiNominee,
  IApiProfile,
  IProfile,
} from 'types';

export const FAKE_ADDRESS = '0xFAKE';
// Fake users are created to when either the user data is not ready for the
// edges or when users have been deleted that once existed.
// Of the later there are a few from early when the coordinape team
// was actively in the strategist circle to observe and mistakenly got some
// give.
// TODO: Think about how best to resolve this sort of thing.
const FAKE_ID_OFFSET = 100000;
export const createFakeProfile = (u: IUser): IProfile => ({
  id: u.id + FAKE_ID_OFFSET,
  address: u.address,
  avatar: '',
  users: [],
});
export const createFakeUser = (circleId: number): IUser => ({
  name: 'HardDelete',
  id: FAKE_ID_OFFSET - circleId,
  circle_id: circleId,
  address: FAKE_ADDRESS,
  non_giver: true,
  fixed_non_receiver: true,
  starting_tokens: 100,
  bio: 'This user was hard deleted, Inconsistent data error.',
  non_receiver: true,
  give_token_received: 0,
  give_token_remaining: 0,
  epoch_first_visit: false,
  fixed_payment_amount: 0,
  created_at: '2021-07-07T23:29:18.000000Z',
  updated_at: '2021-07-07T23:29:18.000000Z',
  deleted_at: '2021-07-07T23:29:18.000000Z',
  role: 1,
  profile: {
    id: FAKE_ID_OFFSET,
    address: FAKE_ADDRESS,
    avatar: 'deleted-user_1628632000.jpg',
    created_at: '2021-07-07T23:29:18.000000Z',
    updated_at: '2021-07-07T23:29:18.000000Z',
  },
  isCircleAdmin: false,
  isCoordinapeUser: false,
  teammates: [],
});

export const extraProfile = ({ users, ...profile }: IApiProfile): IProfile => {
  return {
    ...profile,
    users: (users ?? []).map(u => extraUser(u)),
  };
};

export const extraUser = ({ teammates, ...user }: IApiUser): IUser => ({
  teammates: teammates?.map(t => extraUser(t)) ?? ([] as IUser[]),
  ...user,
  isCircleAdmin: user.role === USER_ROLE_ADMIN,
  isCoordinapeUser: user.role === USER_ROLE_COORDINAPE,
});

export const extraCircle = (circle: IApiCircle): ICircle => {
  const tokenName = circle.token_name || 'GIVE';
  return {
    ...circle,
    tokenName,
    vouchingText:
      circle.vouching_text ||
      `Think someone new should be added to the ${circle.name} circle?\nNominate or vouch for them here.`,
    hasVouching: circle.vouching,
  };
};

export const extraGift = (
  gift: IApiTokenGift,
  usersMap: Map<number, IUser>,
  pending: boolean
): ITokenGift => {
  const sender = usersMap.get(gift.sender_id) ?? createFakeUser(gift.circle_id);
  const recipient =
    usersMap.get(gift.recipient_id) ?? createFakeUser(gift.circle_id);
  return {
    ...gift,
    sender,
    recipient,
    pending,
    // Update address so map is connected correctly
    sender_address: sender.address,
    recipient_address: recipient.address,
  };
};

export const extraNominee = (
  nominee: IApiNominee,
  usersMap: Map<number, IUser>
): INominee => {
  const expiryDate = DateTime.fromISO(nominee.expiry_date);
  return {
    ...nominee,
    ended: !!nominee.ended,
    expired: expiryDate.diffNow().milliseconds < 0,
    expiryDate,
    nominatedDate: DateTime.fromISO(nominee.nominated_date),
    nominations: (nominee.nominations ?? [])
      .map(u => usersMap.get(u.id))
      .filter((u): u is IUser => !!u),
    vouchesNeeded: Math.max(
      0,
      nominee.vouches_required - (nominee.nominations ?? []).length - 1
    ),
    nominator: assertDef(
      usersMap.get(nominee.nominated_by_user_id),
      `extraNominee missing user with id, ${nominee.nominated_by_user_id}`
    ),
  };
};

export const extraEpoch = (raw: IApiEpoch): IEpoch => {
  const startDate = DateTime.fromISO(raw.start_date, {
    zone: 'utc',
  });
  const endDate = DateTime.fromISO(raw.end_date, { zone: 'utc' });

  const [started, timeUntilStart] = calculateTimeUntil(startDate);
  const [, timeUntilEnd] = calculateTimeUntil(endDate);

  const calculatedDays = endDate.diff(startDate, 'days').days;

  const repeatEnum =
    raw.repeat === 2 ? 'monthly' : raw.repeat === 1 ? 'weekly' : 'none';

  return {
    ...raw,
    repeatEnum,
    ended: raw.ended ? true : false,
    started,
    startDate,
    // This expression fails when called on recoilized startDate,
    // because it's state is frozen and luxon uses a cache
    startDay: startDate.toFormat('ccc'),
    endDate,
    endDay: endDate.toFormat('ccc'),
    interval: startDate.until(endDate),
    calculatedDays,
    labelGraph: getEpochLabel(raw),
    labelUntilStart: timingToLeastUnit(timeUntilStart),
    labelUntilEnd: timingToLeastUnit(timeUntilEnd),
  };
};

/*
 *
 * Helper Functions
 *
 ***************/
const timingToLeastUnit = (timing: ITiming) => {
  if (timing.days > 0) {
    return timing.days === 1 ? '1 Day' : `${timing.days} Days`;
  }
  if (timing.hours > 0) {
    return timing.hours === 1 ? '1 Hour' : `${timing.hours} Hours`;
  }
  if (timing.minutes > 0) {
    return timing.minutes === 1 ? '1 Minute' : `${timing.minutes} Minutes`;
  }
  if (timing.seconds > 0) {
    return timing.seconds === 1 ? '1 Second' : `${timing.seconds} Seconds`;
  }
  return 'The Past';
};

const calculateTimeUntil = (target: DateTime): [boolean, ITiming] => {
  const diff = target.diffNow().milliseconds;
  if (diff > 0) {
    return [
      false,
      {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      },
    ];
  } else {
    return [true, { days: 0, hours: 0, minutes: 0, seconds: 0 }];
  }
};

const getEpochLabel = (epoch: IApiEpoch): string => {
  const epochNumber = epoch.number ? `Epoch ${epoch.number}` : 'This Epoch';
  const epochDescription = epoch.description ?? epochNumber;
  const startDate = DateTime.fromISO(epoch.start_date);
  const endDate = DateTime.fromISO(epoch.end_date);
  const epochDates =
    startDate.month !== endDate.month
      ? `${startDate.toFormat('LLL d')} - ${endDate.toFormat('LLL d')}`
      : `${startDate.monthShort} ${startDate.day} - ${endDate.day}`;
  return ` ${epochDates}: ${epochDescription}`;
};
