import { VercelRequest } from '@vercel/node';
import { z, ZodError } from 'zod';

import { getInput } from './handlerHelpers';

const schema = z
  .object({
    field1: z.number(),
    field2: z.string(),
  })
  .strict();

const addr = '0x00000000000000000000000000000000000000ff';

const reqBody = {
  action: { name: 'hello' },
  input: {
    payload: {
      field1: 5,
      field2: 'five',
    },
  },
  request_query: 'test',
  session_variables: {
    'x-hasura-address': addr,
    'x-hasura-role': 'user',
    'x-hasura-user-id': '100',
  },
};

test('parse input as expected', () => {
  const req = { body: reqBody } as VercelRequest;
  const input = getInput(req, schema);
  expect(input).toEqual({
    action: { name: 'hello' },
    payload: { field1: 5, field2: 'five' },
    session: {
      hasuraProfileId: 100,
      hasuraRole: 'user',
      hasuraAddress: addr,
    },
  });
});

test('throw on bad input', () => {
  const badPayloads = [
    { field1: 5 },
    { field1: 'five', field2: 'five' },
    { field1: 5, field2: 'five', field3: 'six' },
  ];

  for (const payload of badPayloads) {
    const req = {
      body: { ...reqBody, input: { payload } },
    } as VercelRequest;
    expect(() => getInput(req, schema)).toThrow(ZodError);
  }
});

test('allow empty input', () => {
  const req = {
    body: {
      action: { name: 'noop' },
      session_variables: reqBody.session_variables,
    },
  } as VercelRequest;
  const input = getInput(req);
  expect(input).toEqual({
    action: { name: 'noop' },
    session: {
      hasuraProfileId: 100,
      hasuraRole: 'user',
      hasuraAddress: addr,
    },
  });
});

test('reject admin role', () => {
  const req = {
    body: {
      action: { name: 'noop' },
      session_variables: {
        'x-hasura-role': 'admin',
      },
    },
  } as VercelRequest;
  expect(() => getInput(req, schema)).toThrow(ZodError);
});
