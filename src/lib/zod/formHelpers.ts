import { AlchemyProvider } from '@ethersproject/providers';
import { isAddress } from 'ethers/lib/utils';
import { DateTime } from 'luxon';
import { z } from 'zod';

import { VITE_FE_ALCHEMY_API_KEY } from '../../config/env';

let _provider: AlchemyProvider;

export const provider = () => {
  if (!_provider) {
    _provider = new AlchemyProvider('homestead', VITE_FE_ALCHEMY_API_KEY);
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

export const zDescription = z
  .union([z.literal(''), z.string().min(3).max(160)])
  .optional();

const url = z
  .string()
  .url({
    message: 'Invalid URL format',
  })
  .max(255);

const prohibitedWebsites = [
  'twitter.com',
  'x.com',
  'github.com',
  'linkedin.com',
  'coordinape.com',
  'www.coordinape.com',
  'colinks.coordinape.com',
  'colinks.xyz',
  'www.colinks.xyz',
];

const isProhibitedWebsite = (url: string) =>
  prohibitedWebsites.some(prohibitedWebsite =>
    url.replace(/^https?:\/\//, '').startsWith(prohibitedWebsite)
  );

const optionalUrl = z.union([url.nullish(), z.literal('')]);
export const zWebsite = optionalUrl.refine(
  url => !url || !isProhibitedWebsite(url.toLowerCase()),
  {
    message: 'URLs containing that domain are not allowed',
  }
);

export const zCircleName = z
  .string()
  .max(255)
  .transform(val => val.trim())
  .refine(val => val.length >= 3);
