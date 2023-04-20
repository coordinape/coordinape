import faker from '@faker-js/faker';
import { VercelRequest } from '@vercel/node';
import { z, ZodError } from 'zod';

import { createCircle, createUser } from '../api-test/helpers';

import { generateTokenString, hashTokenString } from './authHelpers';
import { adminClient } from './gql/adminClient';
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

test('parse input as expected', async () => {
  const req = { body: reqBody } as VercelRequest;
  const input = await getInput(req, schema);
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

test('throw on bad input', async () => {
  const badPayloads = [
    { field1: 5 },
    { field1: 'five', field2: 'five' },
    { field1: 5, field2: 'five', field3: 'six' },
  ];

  for (const payload of badPayloads) {
    const req = {
      body: { ...reqBody, input: { payload } },
    } as VercelRequest;
    await expect(() => getInput(req, schema)).rejects.toThrow(ZodError);
  }
});

test('allow empty input', async () => {
  const req = {
    body: {
      action: { name: 'noop' },
      session_variables: reqBody.session_variables,
    },
  } as VercelRequest;
  const input = await getInput(req);
  expect(input).toEqual({
    action: { name: 'noop' },
    session: {
      hasuraProfileId: 100,
      hasuraRole: 'user',
      hasuraAddress: addr,
    },
  });
});

test('reject admin role', async () => {
  const req = {
    body: {
      action: { name: 'noop' },
      session_variables: {
        'x-hasura-role': 'admin',
      },
    },
  } as VercelRequest;
  await expect(() => getInput(req, schema)).rejects.toThrow(ZodError);
});

test('prevent API access by default', async () => {
  const schema = z
    .object({
      message: z.string(),
    })
    .strict();

  const req = {
    body: {
      action: { name: 'test' },
      input: { payload: { message: 'hello' } },
      session_variables: {
        'x-hasura-role': 'api-user',
        'x-hasura-api-key-hash':
          '1000000020000000300000004000000050000000600000007000000080000000',
        'x-hasura-circle-id': '1',
      },
    },
  } as VercelRequest;

  expect.assertions(1);
  try {
    await getInput(req, schema);
  } catch (err: any) {
    expect(
      err.errors.some(
        (e: any) =>
          e.path.includes('x-hasura-role') &&
          e.received === 'api-user' &&
          e.expected === 'user'
      )
    ).toBeTruthy();
  }
});

test('reject bad API permissions', async () => {
  const schema = z.object({ message: z.string() }).strict();

  const req = {
    body: {
      action: { name: 'test' },
      input: { payload: { message: 'hello' } },
      session_variables: {
        'x-hasura-role': 'api-user',
        'x-hasura-api-key-hash':
          '1000000020000000300000004000000050000000600000007000000080000000',
        'x-hasura-circle-id': '1',
      },
    },
  } as VercelRequest;

  await expect(() =>
    getInput(req, schema, { apiPermissions: ['read_circle'] })
  ).rejects.toThrow(
    /API key does not have the required permissions: read_circle/
  );
});

test('allow access for good API key', async () => {
  const circle = await createCircle(adminClient);
  const user = await createUser(adminClient, { circle_id: circle.id });
  const key = generateTokenString();
  const hash = hashTokenString(key);
  await adminClient.mutate(
    {
      insert_circle_api_keys_one: [
        {
          object: {
            circle_id: circle.id,
            name: `${faker.name.firstName()} ${faker.datatype.number(10000)}`,
            hash,
            read_circle: true,
            created_by: user.id,
          },
        },
        { __typename: true },
      ],
    },
    { operationName: 'test' }
  );

  const schema = z.object({ message: z.string() }).strict();

  const req = {
    body: {
      action: { name: 'test' },
      input: { payload: { message: 'hello' } },
      session_variables: {
        'x-hasura-role': 'api-user',
        'x-hasura-api-key-hash': hash,
        'x-hasura-circle-id': circle.id.toString(),
      },
    },
  } as VercelRequest;
  const input = await getInput(req, schema, {
    apiPermissions: ['read_circle'],
  });
  expect(input).toEqual(
    expect.objectContaining({
      action: { name: 'test' },
      payload: { message: 'hello' },
      session: {
        hasuraRole: 'api-user',
        hasuraCircleId: circle.id,
        apiKey: expect.objectContaining({
          hash,
          circle_id: circle.id,
          read_circle: true,
        }),
      },
    })
  );
});
