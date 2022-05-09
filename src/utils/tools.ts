import assert from 'assert';

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
  assert(val, message);
  return val;
};

/**
 * Use with recoil to suspend until state is initialized.
 */
export const neverEndingPromise = <T>() => new Promise<T>(() => void 0);
