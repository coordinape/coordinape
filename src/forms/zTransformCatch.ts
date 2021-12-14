import { z } from 'zod';

const DEFAULT_MEMOIZE_EXPIRY = 1000;

// Extend Zod to have errors thrown during transformation automatically set
// Zod validation errors.
//
// Acts like a chain of refine and then transform.
//
// The memoization is odd, but required based on the Zod interface for refine.
//
// Usage:
// See the test.
export function zTransformCatch<
  Input extends unknown,
  Output extends unknown,
  RawInput extends unknown
>(
  schema: z.ZodType<Input, any, RawInput>,
  transform: (input: Input) => Output | Promise<Output>,
  {
    memoizeExpiry,
    defaultPath,
  }: { memoizeExpiry?: number; defaultPath?: string[] } = {}
) {
  const expiry = memoizeExpiry ?? DEFAULT_MEMOIZE_EXPIRY;
  const cache = {
    input: undefined as string | undefined,
    result: undefined as Output | undefined,
    err: undefined as ZParseError | undefined,
    ts: 0,
  };

  async function transformWithCatch(input: Input) {
    let err = undefined as ZParseError | undefined;
    let result = undefined as Output | undefined;

    const stringInput = JSON.stringify(input);
    if (cache.input === stringInput && cache.ts + expiry > Date.now()) {
      return {
        result: cache.result,
        err: cache.err,
      };
    }

    try {
      result = await Promise.resolve(transform(input));
    } catch (e: unknown) {
      if (e instanceof ZParseError) {
        err = e;
      } else if (e instanceof Error) {
        err = new ZParseError(e.message, defaultPath);
      } else if (typeof e === 'string') {
        err = new ZParseError(e, defaultPath);
      } else {
        err = new ZParseError('Error in zod transform');
      }
    }

    cache.result = result;
    cache.err = err;
    cache.ts = Date.now();
    cache.input = stringInput;

    return {
      err,
      result,
    };
  }

  function getLast() {
    return {
      err: cache.err,
      result: cache.result,
    };
  }

  return schema
    .refine(
      async v =>
        (await Promise.resolve(transformWithCatch(v))).err === undefined,
      () => {
        const err = getLast().err;
        return err === undefined
          ? { message: 'Error in zod transform', path: defaultPath }
          : {
              message: err.message,
              path: err.path,
            };
      }
    )
    .transform(
      async v => (await Promise.resolve(transformWithCatch(v))).result as Output
    );
}

export class ZParseError extends Error {
  path: string[];
  constructor(message?: string, path?: string[]) {
    super(message);
    this.path = path ?? [];
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
