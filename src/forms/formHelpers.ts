import moment from 'moment';
import { z } from 'zod';

export const stringFutureDate = z
  .string()
  .transform((s) => moment.utc(s))
  .refine((d) => d.diff(moment.utc()) > 0, {
    message: 'Date must be in the future',
  })
  .transform((d) => d.toISOString());

export const stringTime = z
  .string()
  .transform((s) => moment.utc(s))
  .transform((d) => d.format('HH:mm:00'));
