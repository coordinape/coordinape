import { getAddress } from 'ethers/lib/utils';

import { IEpoch } from '../types';

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
