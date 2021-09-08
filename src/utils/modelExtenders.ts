import iti from 'itiriri';
import { DateTime } from 'luxon';
import moment from 'moment';

import {
  IEpoch,
  IEpochTiming,
  ITiming,
  IApiEpoch,
  ITokenGift,
  ICircle,
  IUser,
  IApiCircle,
  IApiTokenGift,
  IApiUser,
  INominee,
  IApiNominee,
} from 'types';

export const timingToLeastUnit = (timing: ITiming) => {
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

export const calculateTimeUntil = (target: DateTime): [boolean, ITiming] => {
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

export const getEpochLabel = (epoch: IApiEpoch): string => {
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

export const calculateEpochTimings = (epoch: IEpoch): IEpochTiming => {
  const [hasBegun, timeUntilStart] = calculateTimeUntil(epoch.startDate);
  const [hasEnded, timeUntilEnd] = calculateTimeUntil(epoch.endDate);
  return {
    hasBegun,
    timeUntilStart,
    hasEnded,
    timeUntilEnd,
  };
};

export const timingToDoubleUnits = (timing: ITiming) => {
  const days = timing.days === 1 ? '1 Day' : `${timing.days} Days`;
  const hours = timing.hours === 1 ? '1 Hour' : `${timing.hours} Hours`;
  const minutes =
    timing.minutes === 1 ? '1 Minute' : `${timing.minutes} Minutes`;
  const seconds =
    timing.seconds === 1 ? '1 Second' : `${timing.seconds} Seconds`;

  if (timing.days > 0) {
    return `${days} and ${hours}`;
  }
  if (timing.hours > 0) {
    return `${hours} and ${minutes}`;
  }
  if (timing.minutes > 0) {
    return `${minutes} and ${seconds}`;
  }
  if (timing.seconds > 0) {
    return seconds;
  }
  return 'The Past';
};

// Could use Object.create() to add prototype functions. Remember recoil values
// are immutable.
export const createExtendedEpoch = (
  raw: IApiEpoch,
  gifts: ITokenGift[]
): IEpoch => {
  const giftStream = iti(gifts);
  const uniqueUsers = giftStream
    .flat((g) => [g.recipient_id, g.sender_id])
    .distinct()
    .length();
  const activeUsers = giftStream
    .map((g) => g.sender_id)
    .distinct()
    .length();
  const totalTokens = giftStream.map((g) => g.tokens).sum() ?? 0;
  const startDate = DateTime.fromISO(raw.start_date);
  const endDate = DateTime.fromISO(raw.end_date);

  const [started, timeUntilStart] = calculateTimeUntil(startDate);
  const [ended, timeUntilEnd] = calculateTimeUntil(endDate);

  const calculatedDays = startDate.until(endDate).toDuration().days;
  const labelTimeStart = started
    ? startDate.toFormat("'Started' h:mma 'UTC'")
    : startDate.toFormat("'Starts' h:mma 'UTC'");
  const labelTimeEnd = ended
    ? startDate.toFormat("'Ended' h:mma 'UTC'")
    : startDate.toFormat("'Ends' h:mma 'UTC'");

  const labelActivity =
    gifts.length > 0
      ? `${activeUsers} members allocated ${totalTokens} Tokens`
      : '';

  const repeatEnum =
    raw.repeat === 2 ? 'monthly' : raw.repeat === 1 ? 'weekly' : 'none';

  return {
    ...raw,
    repeatEnum,
    ended: raw.ended ? true : false,
    started,
    startDate,
    endDate,
    eInterval: startDate.until(endDate),
    totalTokens,
    uniqueUsers,
    activeUsers,
    calculatedDays,
    labelGraph: getEpochLabel(raw),
    labelDayRange: getLongEpochDateLabel(startDate, endDate),
    labelTimeStart,
    labelTimeEnd,
    labelActivity,
    labelUntilStart: timingToLeastUnit(timeUntilStart),
    labelUntilEnd: timingToLeastUnit(timeUntilEnd),
  };
};

export const createCircleWithDefaults = (circle: IApiCircle): ICircle => {
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
  };
};

export const createGiftWithUser = (
  gift: IApiTokenGift,
  usersMap: Map<number, IUser>
) => {
  const sender = usersMap.get(gift.sender_id);
  const recipient = usersMap.get(gift.recipient_id);
  return {
    ...gift,
    sender,
    recipient,
  };
};

export const updatedUserMapWithoutProfile = (
  newUser: IApiUser,
  usersMap: Map<number, IUser>
): Map<number, IUser> => {
  const id = newUser.id;
  return new Map(
    usersMap.set(id, {
      ...newUser,
      profile: usersMap.get(id)?.profile,
    } as IUser)
  );
};

export const createExtendedNominee = (
  nominee: IApiNominee,
  usersMap: Map<number, IUser>
): INominee => {
  return {
    ...nominee,
    ended: nominee.ended === 1,
    expiryDate: moment.utc(nominee.expiry_date),
    nominatedDate: moment.utc(nominee.nominated_date),
    // TODO: Exrhizo: I mentioned to Zashton we might only send ids,
    // this way the profile is included without extra joins.
    nominations: nominee.nominations
      .map((u) => usersMap.get(u.id))
      .filter((u): u is IUser => !!u),
    vouchesNeeded: Math.max(
      0,
      nominee.vouches_required - nominee.nominations.length - 1
    ),
  };
};
