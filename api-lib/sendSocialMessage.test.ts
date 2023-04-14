import { createCircle } from '../api-test/helpers';

import { adminClient } from './gql/adminClient';
import { sendSocialMessage } from './sendSocialMessage';
import { Awaited } from './ts4.5shim';

describe('sendSocialMessage', () => {
  let circle: Awaited<ReturnType<typeof createCircle>>;

  test('Test Failed Telegram message', async () => {
    circle = await createCircle(adminClient, {
      telegram_id: 'coordinapeTest123',
    });
    await expect(
      sendSocialMessage({
        message: 'Test',
        circleId: circle.id,
        channels: { telegram: true },
        sanitize: false,
      })
    ).rejects.toThrowError(/"Bad Request: chat not found"/);
  });

  test('Test Failed discord webhook message', async () => {
    circle = await createCircle(adminClient, {
      discord_webhook: 'https://.com/api/webhooks/coordinapeTest123',
    });
    await expect(
      sendSocialMessage({
        message: 'Test',
        circleId: circle.id,
        channels: { discord: true },
        sanitize: false,
      })
    ).rejects.toThrowError(
      /request to https:\/\/.com\/api\/webhooks\/coordinapeTest123 failed, reason: getaddrinfo ENOTFOUND/
    );
  });

  test('Test Failed discord bot message', async () => {
    circle = await createCircle(adminClient);
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
    ).rejects.toThrowError(/"Value \\"Coordinape123\\" is not snowflake."/);
  });
});
