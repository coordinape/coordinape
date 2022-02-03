import { ethers } from 'ethers';
import { DateTime } from 'luxon';
import { z } from 'zod';

import { INFURA_PROJECT_ID } from '../config/env';

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
  // `resolveName` throws outright if it is passed a malformed eth address
  // so we need to refine it first so safeParseAsync doesn't throw
  // unexpectedly
  .refine(validAddressOrENS, 'Wallet address is invalid')
  .transform(s => provider.resolveName(s))
  .transform(s => s || '')
  .refine(s => s, 'unresolved ENS name')
  .transform(s => s.toLowerCase());

export const zEthAddressOnly = z
  .string()
  .refine(s => ethers.utils.isAddress(s), 'Wallet address is invalid')
  .transform(s => s.toLowerCase());

function validAddressOrENS(s: string): boolean {
  return s.endsWith('.eth') || ethers.utils.isAddress(s);
}

export const zEthAddressOrBlank = z.string().refine(async val => {
  if (val == '') return true;
  return zEthAddress.parseAsync(val);
});
