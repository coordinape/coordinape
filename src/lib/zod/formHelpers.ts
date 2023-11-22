import { InfuraProvider } from '@ethersproject/providers';
import { isAddress } from 'ethers/lib/utils';
import { DateTime } from 'luxon';
import { z } from 'zod';

import { INFURA_PROJECT_ID } from '../../config/env';

let _provider: InfuraProvider;

export const provider = () => {
  if (!_provider) {
    _provider = new InfuraProvider('homestead', INFURA_PROJECT_ID);
  }
  return _provider;
};

export const isValidENS = async (name: string, address?: string) => {
  const resolvedAddress = await provider().resolveName(name);
  if (
    !resolvedAddress ||
    resolvedAddress.toLowerCase() !== address?.toLowerCase()
  ) {
    return false;
  }
  return true;
};

export const zStringISODateUTC = z
  .string()
  .transform(s => DateTime.fromISO(s, { zone: 'utc' }))
  .superRefine((dt, ctx) => {
    if (!dt.isValid)
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_date,
        message: `invalid datetime: ${dt.invalidExplanation}`,
      });
  });

export const zEthAddress = z
  .string()
  // `resolveName` throws outright if it is passed a malformed eth address
  // so we need to refine it first so safeParseAsync doesn't throw
  // unexpectedly
  .refine(s => s.endsWith('.eth') || isAddress(s), 'Address is invalid')
  .transform(s => provider().resolveName(s))
  .refine(s => s, 'unresolved ENS name')
  // the falsy case is unreachable, but required for soundness
  .transform(s => (s ? s.toLowerCase() : ''));

export const zEthAddressOnly = z
  .string()
  .refine(s => isAddress(s), 'Address is invalid')
  .transform(s => s.toLowerCase());

export const zUsername = z
  .string()
  .max(42)
  .transform(val => val.trim())
  .refine(val => val.length >= 3, 'Name must contain at least 3 characters');

export const zDescription = z.string().min(3).max(160);

export const zCircleName = z
  .string()
  .max(255)
  .transform(val => val.trim())
  .refine(val => val.length >= 3);
