import { ethers } from 'ethers';
import { DateTime } from 'luxon';
import { z } from 'zod';

export const zBooleanToNumber = z.boolean().transform(v => (v ? 1 : 0));

export const zStringISODateUTC = z
  .string()
  .transform(s => DateTime.fromISO(s, { zone: 'utc' }));

export const zEthAddress = z
  .string()
  .transform(s =>
    s
      ? ethers
          .getDefaultProvider('homestead', {
            infura: process.env.REACT_APP_INFURA_PROJECT_ID,
          })
          .resolveName(s)
      : null
  )
  .transform(s => s ?? '')
  .refine(s => ethers.utils.isAddress(s), 'Wallet address is invalid')
  .transform(s => s.toLowerCase());

// TODO: Create a wrapper that transforms and catches errors into refine
