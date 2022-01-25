import { ethers } from 'ethers';
import { DateTime } from 'luxon';
import { z } from 'zod';

import { INFURA_PROJECT_ID } from 'config/env';

const provider = new ethers.providers.InfuraProvider(
  'homestead',
  INFURA_PROJECT_ID
);

export const zBooleanToNumber = z.boolean().transform(v => (v ? 1 : 0));

export const zStringISODateUTC = z
  .string()
  .transform(s => DateTime.fromISO(s, { zone: 'utc' }));

export const zEthAddress = z
  .string()
  .transform(s => provider.resolveName(s))
  .transform(s => s || '')
  .refine(s => ethers.utils.isAddress(s), 'Wallet address is invalid')
  .transform(s => s.toLowerCase());

export const zEthAddressOrBlank = z.string().refine(async val => {
  if (val == '') return true;
  return zEthAddress.parseAsync(val);
});
