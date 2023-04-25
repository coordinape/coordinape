import * as nodeFetch from 'node-fetch';

import { createCircle } from '../api-test/helpers';

import { adminClient } from './gql/adminClient';
import { sendSocialMessage } from './sendSocialMessage';
import { Awaited } from './ts4.5shim';

const fetchOrig = jest.requireActual('node-fetch').default;

const expectedFailedResponse = {
  ok: false,
  status: 404,
  statusText: 'Not Found',
  headers: new Headers(),
  text: jest.fn().mockResolvedValue(''),
  json: () =>
    Promise.resolve({
      success: false,
      error: 'Unexpected Id',
    }),
} as unknown as nodeFetch.Response;

const expectedSuccessResponse = {
  ok: true,
  headers: new Headers(),
  text: jest.fn().mockResolvedValue(''),
} as unknown as nodeFetch.Response;

let circle: Awaited<ReturnType<typeof createCircle>>;
const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

beforeAll(async () => {
  circle = await createCircle(adminClient, {
    telegram_id: 'coordinapeTest123',
    discord_webhook: 'coordinapeTest123',
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

test('Test Failed Telegram message', async () => {
  jest
    .spyOn(nodeFetch, 'default')
    .mockImplementationOnce(fetchOrig)
    .mockImplementationOnce(() => Promise.resolve(expectedFailedResponse));

  await expect(
    sendSocialMessage({
      message: 'Test',
      circleId: circle.id,
      channels: { telegram: true },
      sanitize: false,
    })
  ).rejects.toThrowError(/Not Found/);
  expect(consoleSpy.mock.calls[0]).toContain('Error updating telegram-bot:');
  expect(consoleSpy.mock.calls[1][0]).toContain(
    'Error sending social messages:'
  );
});

test('Test Failed discord webhook message', async () => {
  jest
    .spyOn(nodeFetch, 'default')
    .mockImplementationOnce(fetchOrig)
    .mockImplementationOnce(() => Promise.resolve(expectedFailedResponse));

  await expect(
    sendSocialMessage({
      message: 'Test',
      circleId: circle.id,
      channels: { discord: true },
      sanitize: false,
    })
  ).rejects.toThrowError(/Not Found/);
  expect(consoleSpy.mock.calls[0]).toContain('Error updating discord-webhook:');
  expect(consoleSpy.mock.calls[1][0]).toContain(
    'Error sending social messages:'
  );
});

test('Test Failed discord bot message', async () => {
  jest
    .spyOn(nodeFetch, 'default')
    .mockImplementationOnce(fetchOrig)
    .mockImplementationOnce(() => Promise.resolve(expectedFailedResponse));

  await expect(
    sendSocialMessage({
      message: 'Test',
      circleId: circle.id,
      channels: {
        isDiscordBot: true,
        discordBot: {
          channelId: 'Coordinape123',
          roleId: 'Test123',
          type: 'daily-update' as const,
          message: 'Test',
        },
      },
      sanitize: false,
    })
  ).rejects.toThrowError(/Not Found/);
  expect(consoleSpy.mock.calls[0]).toContain('Error updating discord-bot:');
  expect(consoleSpy.mock.calls[1][0]).toContain(
    'Error sending social messages:'
  );
});

test('Test Failed discord-bot and telegram messages', async () => {
  jest
    .spyOn(nodeFetch, 'default')
    .mockImplementationOnce(fetchOrig)
    .mockImplementation(() => Promise.resolve(expectedFailedResponse));

  await expect(
    sendSocialMessage({
      message: 'Test',
      circleId: circle.id,
      channels: {
        isDiscordBot: true,
        telegram: true,
        discordBot: {
          channelId: 'Coordinape123',
          roleId: 'Test123',
          type: 'daily-update' as const,
          message: 'Test',
        },
      },
      sanitize: false,
    })
  ).rejects.toThrowError(/Not Found[\s\S]* Not Found/);
  expect(consoleSpy).toBeCalledTimes(3);
  expect(consoleSpy.mock.calls[0]).toContain('Error updating discord-bot:');
  expect(consoleSpy.mock.calls[1]).toContain('Error updating telegram-bot:');
  expect(consoleSpy.mock.calls[2][0]).toContain(
    'Error sending social messages:'
  );
});

test('Test Failed discord bot message and succeeded telegram message', async () => {
  jest
    .spyOn(nodeFetch, 'default')
    .mockImplementationOnce(fetchOrig)
    .mockImplementationOnce(() => Promise.resolve(expectedFailedResponse))
    .mockImplementationOnce(() => Promise.resolve(expectedSuccessResponse));

  await expect(
    sendSocialMessage({
      message: 'Test',
      circleId: circle.id,
      channels: {
        isDiscordBot: true,
        telegram: true,
        discordBot: {
          channelId: 'Coordinape123',
          roleId: 'Test123',
          type: 'daily-update' as const,
          message: 'Test',
        },
      },
      sanitize: false,
    })
  ).rejects.toThrowError(/Not Found/);
  expect(consoleSpy).toBeCalledTimes(2);
  expect(consoleSpy.mock.calls[0]).toContain('Error updating discord-bot:');
  expect(consoleSpy.mock.calls[1][0]).toContain(
    'Error sending social messages:'
  );
});
