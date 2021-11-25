import { getAddress } from 'ethers/lib/utils';

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

export const wait = <T>(something: T): Promise<T> =>
  new Promise(resolve => {
    const wait = setTimeout(() => {
      clearTimeout(wait);
      resolve(something);
    }, 1000);
  });

export const toSearchRegExp = (value: string) => {
  if (!value) {
    return undefined;
  }
  try {
    return new RegExp(`(${value.replace(/[#-.]|[[-^]|[?{}]/g, '\\$&')})`, 'i');
  } catch (error) {
    console.warn('toSearchRegExpe', error);
  }
  return undefined;
};

export const assertDef = <T>(
  val: T | undefined | null,
  message?: string
): T => {
  if (val === undefined || val === null) {
    throw `I <3 NPE: ${message}`;
  }
  return val;
};

/**
 * Use with recoil to suspend until state is initialized.
 */
export const neverEndingPromise = <T>() => new Promise<T>(() => void 0);
