import { ethers } from 'ethers';
import { DateTime } from 'luxon';
import { z } from 'zod';

export const zBooleanToNumber = z.boolean().transform((v) => (v ? 1 : 0));

export const zStringISODate = z.string().transform((s) => DateTime.fromISO(s));

export const zEthAddress = z
  .string()
  .refine((s) => ethers.utils.isAddress(s), 'Invalid Eth Address');

export const identityTransform = <
  Shape extends z.ZodRawShape,
  Z extends z.ZodObject<Shape, 'strict'>
>(
  s: Z
) => s.transform((o: Z['_output']) => o);
