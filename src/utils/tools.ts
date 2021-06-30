import { getAddress } from 'ethers/lib/utils';
import moment from 'moment';

import { IEpoch, IEpochTiming, ITiming } from 'types';

export const isAddress = (address: string): boolean => {
  try {
    getAddress(address);
  } catch (e) {
    return false;
  }
  return true;
};

export const isContract = async (
  provider: any,
  address: string
): Promise<boolean> => {
  const code = await provider.getCode(address);
  return code && code !== '0x';
};

export const labelEpoch = (epoch: IEpoch) => {
  const epochNumber = epoch.number ? `Epoch ${epoch.number}` : 'This Epoch';
  const start = new Date(epoch.start_date);
  const end = new Date(epoch.end_date);
  if (start.getMonth() !== end.getMonth()) {
    const formatter = new Intl.DateTimeFormat('en', {
      day: 'numeric',
      month: 'short',
    });
    return `${epochNumber}: ${formatter.format(start)} - ${formatter.format(
      end
    )}`;
  }
  const dayFormatter = new Intl.DateTimeFormat('en', {
    day: 'numeric',
  });
  const month = new Intl.DateTimeFormat('en', {
    month: 'long',
  }).format(start);
  return `${epochNumber}: ${month} ${dayFormatter.format(
    start
  )} - ${dayFormatter.format(end)}`;
};

const calculateTimeUntil = (dateTime: Date): [boolean, ITiming] => {
  const now = moment.utc();
  const target = moment.utc(dateTime);
  const diff = target.diff(now);
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

export const calculateEpochTimings = (epoch: IEpoch): IEpochTiming => {
  const [hasBegun, timeUntilStart] = calculateTimeUntil(epoch.start_date);
  const [hasEnded, timeUntilEnd] = calculateTimeUntil(epoch.end_date);
  return {
    hasBegun,
    timeUntilStart,
    hasEnded,
    timeUntilEnd,
  };
};
