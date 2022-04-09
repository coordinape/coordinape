import iti from 'itiriri';
import { DateTime } from 'luxon';

import { USER_ROLE_ADMIN, USER_ROLE_COORDINAPE } from 'config/constants';
import { assertDef } from 'utils/tools';

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
  admin_view: false,
  hasAdminView: false,
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
  created_at: '2021-07-07T23:29:18.000000Z',
  updated_at: '2021-07-07T23:29:18.000000Z',
  deleted_at: '2021-07-07T23:29:18.000000Z',
  role: 1,
  profile: {
    id: FAKE_ID_OFFSET,
    address: FAKE_ADDRESS,
    admin_view: false,
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
    hasAdminView: !!profile.admin_view,
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
    teamSelText:
      circle.team_sel_text ||
      `Think about who you worked with this Epoch, and who you saw adding value to the community. Allocate ${tokenName} to those whose contribution you directly experienced, or whose work supported yours.`,
    allocText:
      circle.alloc_text ||
      `Thank your teammates by allocating them ${tokenName}`,
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

export const extraEpoch = (raw: IApiEpoch, gifts?: ITokenGift[]): IEpoch => {
  const startDate = DateTime.fromISO(raw.start_date, {
    zone: 'utc',
  });
  const endDate = DateTime.fromISO(raw.end_date, { zone: 'utc' });

  const [started, timeUntilStart] = calculateTimeUntil(startDate);
  const [ended, timeUntilEnd] = calculateTimeUntil(endDate);

  const calculatedDays = endDate.diff(startDate, 'days').days;
  const labelTimeStart = started
    ? startDate.toFormat("'Started' h:mma 'UTC'")
    : startDate.toFormat("'Starts' h:mma 'UTC'");
  const labelTimeEnd = ended
    ? startDate.toFormat("'Ended' h:mma 'UTC'")
    : startDate.toFormat("'Ends' h:mma 'UTC'");

  const repeatEnum =
    raw.repeat === 2 ? 'monthly' : raw.repeat === 1 ? 'weekly' : 'none';

  let giftProperties = {
    totalTokens: 0,
    uniqueUsers: 0,
    activeUsers: 0,
    labelActivity: 'allocation status not loaded',
  };

  if (gifts) {
    const uniqueUsers = iti(gifts)
      .flat(g => [g.recipient_id, g.sender_id])
      .distinct()
      .length();
    const activeUsers = iti(gifts)
      .map(g => g.sender_id)
      .distinct()
      .length();
    const totalTokens =
      iti(gifts)
        .map(g => g.tokens)
        .sum() ?? 0;

    const labelActivity =
      gifts.length > 0
        ? `${activeUsers} members allocated ${totalTokens} Tokens`
        : '';
    giftProperties = {
      totalTokens,
      uniqueUsers,
      activeUsers,
      labelActivity,
    };
  }

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
    labelDayRange: getLongEpochDateLabel(startDate, endDate),
    labelTimeStart,
    labelTimeEnd,
    labelUntilStart: timingToLeastUnit(timeUntilStart),
    labelUntilEnd: timingToLeastUnit(timeUntilEnd),
    labelYearEnd: endDate.toFormat('yyyy'),
    // Give related
    ...giftProperties,
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
  const startDate = DateTime.fromISO(epoch.start_date);
  const endDate = DateTime.fromISO(epoch.end_date);
  const epochDates =
    startDate.month !== endDate.month
      ? `${startDate.toFormat('LLL d')} - ${endDate.toFormat('LLL d')}`
      : `${startDate.monthShort} ${startDate.day} - ${endDate.day}`;
  return `${epochNumber} ${epochDates}`;
};

const getLongEpochDateLabel = (start: DateTime, end: DateTime): string =>
  `${start.toFormat('LLL d')} to ${end.toFormat('LLL d')}`;
