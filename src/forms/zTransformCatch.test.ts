import { z } from 'zod';

import { waitSeconds } from 'utils';

import { zTransformCatch, ZParseError } from './zTransformCatch';

const NEG_ERROR_MESSAGE = 'Negative number';

const schema = z.object({
  x: z.number(),
});

const failNegativeSchema = zTransformCatch(schema, async ({ x }) => {
  await waitSeconds(0.1);
  if (x >= 0) {
    return x;
  } else {
    throw new ZParseError(NEG_ERROR_MESSAGE, ['x']);
  }
});

test('zTransformCatch success', async () => {
  const data = {
    x: 5,
  };
  const result = await failNegativeSchema.parseAsync(data);
  expect(result).toEqual(5);
});

test('zTransformCatch error', async () => {
  const data = {
    x: -5,
  };
  const result = await failNegativeSchema.safeParseAsync(data);
  expect(result.success).toEqual(false);
  if (!result.success) {
    // this is weird, but such is typescript inference.
    expect(result.error.errors[0]?.message).toEqual(NEG_ERROR_MESSAGE);
  }
});
