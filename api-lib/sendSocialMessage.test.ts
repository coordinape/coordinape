import * as nodeFetch from 'node-fetch';

import { createCircle } from '../api-test/helpers';

import { adminClient } from './gql/adminClient';
import { sendSocialMessage } from './sendSocialMessage';
import { Awaited } from './ts4.5shim';

const fetchOrig = jest.requireActual('node-fetch').default;

const expectedResponse = {
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

describe('sendSocialMessage', () => {
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  let circle: Awaited<ReturnType<typeof createCircle>>;

  afterEach(() => {
    jest.clearAllMocks();
  });
  test('Test Failed Telegram message', async () => {
    circle = await createCircle(adminClient, {
      telegram_id: 'coordinapeTest123',
    });

    jest
      .spyOn(nodeFetch, 'default')
      .mockImplementationOnce(fetchOrig)
      .mockImplementationOnce(() => Promise.resolve(expectedResponse));

    await expect(
      sendSocialMessage({
        message: 'Test',
        circleId: circle.id,
        channels: { telegram: true },
        sanitize: false,
      })
    ).rejects.toThrowError(/Unexpected Id/);
    expect(consoleSpy.mock.calls[0]).toContain('Error updating telegram-bot:');
  });

  test('Test Failed discord webhook message', async () => {
    circle = await createCircle(adminClient, {
      discord_webhook: 'coordinapeTest123',
    });

    jest
      .spyOn(nodeFetch, 'default')
      .mockImplementationOnce(fetchOrig)
      .mockImplementationOnce(() => Promise.resolve(expectedResponse));

    await expect(
      sendSocialMessage({
        message: 'Test',
        circleId: circle.id,
        channels: { discord: true },
        sanitize: false,
      })
    ).rejects.toThrowError(/Unexpected Id/);
    expect(consoleSpy.mock.calls[0]).toContain(
      'Error updating discord-webhook:'
    );
  });

  test('Test Failed discord bot message', async () => {
    circle = await createCircle(adminClient);

    jest
      .spyOn(nodeFetch, 'default')
      .mockImplementationOnce(fetchOrig)
      .mockImplementationOnce(() => Promise.resolve(expectedResponse));

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
    ).rejects.toThrowError(/Unexpected Id/);
    expect(consoleSpy.mock.calls[0]).toContain('Error updating discord-bot:');
  });
});
