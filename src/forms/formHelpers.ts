import { ethers } from 'ethers';
import { DateTime } from 'luxon';
import { z } from 'zod';

export const zBooleanToNumber = z.boolean().transform((v) => (v ? 1 : 0));

export const zStringISODateUTC = z
  .string()
  .transform((s) => DateTime.fromISO(s, { zone: 'utc' }));

export const zEthAddress = z
  .string()
  .refine((s) => ethers.utils.isAddress(s), 'Invalid Eth Address');
