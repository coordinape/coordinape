/**
 * @jest-environment node
 */
import { DateTime } from 'luxon';

import { adminClient } from '../../../api-lib/gql/adminClient';
import { sendSocialMessage } from '../../../api-lib/sendSocialMessage';

import { notifyEpochStart, notifyEpochEnd, EpochsToNotify } from './epochs';

jest.mock('../../../api-lib/gql/adminClient', () => ({
  adminClient: { query: jest.fn(), mutate: jest.fn() },
}));

jest.mock('../../../api-lib/sendSocialMessage', () => ({
  sendSocialMessage: jest.fn(),
}));

const mockSendSocial = sendSocialMessage as jest.MockedFunction<
  typeof sendSocialMessage
>;
const mockMutation = adminClient.mutate as jest.MockedFunction<
  typeof adminClient.mutate
>;
const isoTime =
  /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\.[0-9]+)?(Z|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9])?$/;

const mockCircle = {
  notifyStart: {
    users_aggregate: {
      aggregate: {
        count: 5,
      },
    },
    id: 1,
    name: 'mockCircle',
    organization: {
      name: 'mock Org',
    },
  },
  notifyEnd: {
    id: 1,
    circle_id: 5,
    name: 'circle with ending epoch',
    organization: { name: 'mock Org' },
    // TODO set up faker data
    users: [{ name: 'bob' }, { name: 'alice' }],
  },
  endEpoch: {
    auto_opt_out: true,
    // TODO set up faker data
    users: [],
  },
};

const mockEpoch = {
  notifyStart: {
    id: 9,
    circle_id: 1,
    start_date: DateTime.now().minus({ days: 1 }),
    end_date: DateTime.now().plus({ days: 1 }),
    circle: mockCircle.notifyStart,
  },
  notifyEnd: {
    id: 9,
    circle_id: 1,
    number: 3,
    end_date: DateTime.now().plus({ days: 1 }),
    circle: mockCircle.notifyEnd,
  },
  endEpoch: {
    repeat: 2,
    repeat_day_of_month: 7,
    circle: mockCircle.endEpoch,
  },
};

function getTestInput(mockInput: {
  notifyStart?: EpochsToNotify['notifyStart'];
  notifyEnd?: EpochsToNotify['notifyEnd'];
  endEpoch?: EpochsToNotify['endEpoch'];
}): EpochsToNotify {
  return {
    notifyStart: mockInput.notifyStart ?? { epochs: [] },
    notifyEnd: mockInput.notifyEnd ?? { epochs: [] },
    endEpoch: mockInput.endEpoch ?? { epochs: [] },
  };
}

function getEpochInput<T extends keyof EpochsToNotify>(
  epochPhase: T,
  input: Partial<EpochsToNotify[T]['epochs'][0]>
): EpochsToNotify {
  const circle = { ...mockCircle[epochPhase], ...input.circle };
  const epoch = { ...mockEpoch[epochPhase], ...input, circle };
  return getTestInput({
    [epochPhase]: { epochs: [epoch] },
  });
}

function getCircle<T extends keyof EpochsToNotify>(
  epochPhase: T,
  circleInputs: Partial<EpochsToNotify[T]['epochs'][0]['circle']>
) {
  return { ...mockCircle[epochPhase], ...circleInputs };
}

describe('epoch Cron Logic', () => {
  describe('notifyEpochEnd', () => {
    test('no notifications enabled', async () => {
      const input = getEpochInput('notifyEnd', {});
      const result = await notifyEpochEnd(input);
      expect(result).toEqual([]);
      expect(sendSocialMessage).not.toBeCalled();
      expect(mockMutation).not.toBeCalled();
    });
    test('notifications enabled for Telegram', async () => {
      const input = getEpochInput('notifyEnd', {
        circle: getCircle('notifyEnd', { telegram_id: '-29' }),
      });
      const result = await notifyEpochEnd(input);
      expect(result).toEqual([]);
      expect(sendSocialMessage).toBeCalledTimes(1);
      expect(sendSocialMessage).toBeCalledWith({
        channels: { telegram: true },
        circleId: 1,
        message:
          'mock Org/circle with ending epoch epoch ends in less than 24 hours!\n' +
          'Users that have yet to fully allocate their GIVE:\n' +
          'bob, alice',
        sanitize: false,
      });
      expect(mockMutation).toBeCalledTimes(1);
      expect(mockMutation).toBeCalledWith({
        update_epochs_by_pk: [
          {
            _set: { notified_before_end: expect.stringMatching(isoTime) },
            pk_columns: { id: 9 },
          },
          { id: true },
        ],
      });
    });
    test('notifications enabled for Discord', async () => {
      const input = getEpochInput('notifyEnd', {
        circle: getCircle('notifyEnd', {
          discord_webhook: 'https://discord.webhook',
        }),
      });
      const result = await notifyEpochEnd(input);
      expect(result).toEqual([]);
      expect(sendSocialMessage).toBeCalledTimes(1);
      expect(sendSocialMessage).toBeCalledWith({
        channels: { discord: true },
        circleId: 1,
        message:
          'mock Org/circle with ending epoch epoch ends in less than 24 hours!\n' +
          'Users that have yet to fully allocate their GIVE:\n' +
          'bob, alice',
        sanitize: false,
      });
      expect(mockMutation).toBeCalledTimes(1);
      expect(mockMutation).toBeCalledWith({
        update_epochs_by_pk: [
          {
            _set: { notified_before_end: expect.stringMatching(isoTime) },
            pk_columns: { id: 9 },
          },
          { id: true },
        ],
      });
    });
    test('notifications enabled for both channels', async () => {
      const input = getEpochInput('notifyEnd', {
        circle: getCircle('notifyEnd', {
          discord_webhook: 'https://discord.webhook',
          telegram_id: '-7',
        }),
      });
      const result = await notifyEpochEnd(input);
      expect(result).toEqual([]);
      expect(sendSocialMessage).toBeCalledTimes(2);
      expect(sendSocialMessage).toBeCalledWith({
        channels: { telegram: true },
        circleId: 1,
        message:
          'mock Org/circle with ending epoch epoch ends in less than 24 hours!\n' +
          'Users that have yet to fully allocate their GIVE:\n' +
          'bob, alice',
        sanitize: false,
      });
      expect(sendSocialMessage).toBeCalledWith({
        channels: { discord: true },
        circleId: 1,
        message:
          'mock Org/circle with ending epoch epoch ends in less than 24 hours!\n' +
          'Users that have yet to fully allocate their GIVE:\n' +
          'bob, alice',
        sanitize: false,
      });
      expect(mockMutation).toBeCalledTimes(2);
      expect(mockMutation).toBeCalledWith({
        update_epochs_by_pk: [
          {
            _set: { notified_before_end: expect.stringMatching(isoTime) },
            pk_columns: { id: 9 },
          },
          { id: true },
        ],
      });
    });
  });
  describe('notifyEpochStart', () => {
    test('no prior epoch and no notifications enabled', async () => {
      const input = getEpochInput('notifyStart', {});
      const result = await notifyEpochStart(input);
      expect(result).toEqual([]);
      expect(sendSocialMessage).not.toBeCalled();
      expect(mockMutation).toBeCalledWith({
        update_epochs_by_pk: [
          { _set: { number: 1 }, pk_columns: { id: 9 } },
          { number: true },
        ],
      });
    });
    test('prior epoch and both notifications enabled', async () => {
      const input = getEpochInput('notifyStart', {
        circle_id: 5,
        number: 1,
        circle: getCircle('notifyStart', {
          id: 5,
          discord_webhook: 'test_hook',
          telegram_id: '5',
        }),
      });
      const result = await notifyEpochStart(input);
      expect(result).toEqual([]);
      expect(mockMutation).toBeCalledTimes(2);
      expect(mockMutation).toBeCalledWith({
        update_epochs_by_pk: [
          {
            _set: { notified_start: expect.stringMatching(isoTime) },
            pk_columns: { id: 9 },
          },
          { id: true },
        ],
      });
      expect(sendSocialMessage).toBeCalledTimes(2);
      expect(sendSocialMessage).toBeCalledWith({
        channels: { discord: true },
        circleId: 5,
        message: expect.stringContaining(
          'A new mock Org/mockCircle epoch is active!\n' +
            '5 users will be participating and the duration of the epoch will be:\n'
        ),
        sanitize: false,
      });
      expect(sendSocialMessage).toBeCalledWith({
        channels: { telegram: true },
        circleId: 5,
        message: expect.stringContaining(
          'A new mock Org/mockCircle epoch is active!\n' +
            '5 users will be participating and the duration of the epoch will be:\n'
        ),
        sanitize: false,
      });
    });
    test("social message throw doesn't bubble up", async () => {
      const spy = jest.spyOn(console, 'error');
      mockSendSocial.mockImplementationOnce(async () => {
        throw new Error('derp');
      });
      const input = getEpochInput('notifyStart', {
        circle: getCircle('notifyStart', { telegram_id: '7' }),
      });
      const result = await notifyEpochStart(input);
      expect(result).toEqual([]);
      expect(spy).toBeCalledWith(
        'Error sending telegram notification for epoch id 9: derp'
      );
    });
    test('setEpochNumber throw is handled', async () => {
      mockMutation.mockImplementationOnce(async () => {
        throw new Error('mutation failure');
      });
      const input = getEpochInput('notifyStart', {});
      const result = await notifyEpochStart(input);
      expect(result).toEqual([
        'Error setting next number for epoch id 9: mutation failure',
      ]);
    });
  });
});
