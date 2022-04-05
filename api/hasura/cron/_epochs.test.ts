import faker from 'faker';
import { DateTime } from 'luxon';

import { adminClient } from '../../../api-lib/gql/adminClient';
import { sendSocialMessage } from '../../../api-lib/sendSocialMessage';

import {
  notifyEpochStart,
  notifyEpochEnd,
  EpochsToNotify,
  endEpoch,
} from './epochs';

jest.mock('../../../api-lib/gql/adminClient', () => ({
  adminClient: { query: jest.fn(), mutate: jest.fn() },
}));

jest.mock('../../../api-lib/sendSocialMessage', () => ({
  sendSocialMessage: jest.fn(),
}));

const mockSendSocial = sendSocialMessage as jest.MockedFunction<
  typeof sendSocialMessage
>;
const mockQuery = adminClient.query as jest.MockedFunction<
  typeof adminClient.query
>;
const mockMutation = adminClient.mutate as jest.MockedFunction<
  typeof adminClient.mutate
>;
const isoTime =
  /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\.[0-9]+)?(Z|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9])?$/;

faker.seed(1);
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
    users: [{ name: 'bob' }, { name: 'alice' }],
  },
  endEpoch: {
    id: 1,
    auto_opt_out: true,
    name: 'circle with epoch that has ended',
    organization: { name: 'mock org' },
    token_name: 'GIVE',
    users: Array(7)
      .fill(null)
      .map((_, i) => ({
        name: 'person ' + i,
        id: i,
        circle_id: 1,
        epoch_id: 9,
        bio: faker.lorem.sentences(5),
        starting_tokens: 100 * (1 + i),
        give_token_remaining: i > 1 ? 0 : 100 * (1 + i),
      })),
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
    id: 9,
    start_date: DateTime.now().minus({ days: 1 }).toISO(),
    end_date: DateTime.now().plus({ days: 1 }).toISO(),
    repeat: 2,
    repeat_day_of_month: 7,
    circle: mockCircle.endEpoch,
    circle_id: 1,
    epoch_pending_token_gifts: Array(7)
      .fill(null)
      .map((_, i) => ({
        circle_id: 1,
        epoch_id: 9,
        tokens: 10,
        note: faker.lorem.sentences(3),
        sender_id: i.toString(),
        sender_address: '0x' + faker.datatype.hexaDecimal(40),
        recipient_id: faker.datatype.number(7).toString(),
        recipient_address: '0x' + faker.datatype.hexaDecimal(40),
      })),
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
  input: Partial<EpochsToNotify[T]['epochs'][0]>,
  epochQty = 1
): EpochsToNotify {
  const circle = { ...mockCircle[epochPhase], ...input.circle };
  const epoch = { ...mockEpoch[epochPhase], ...input, circle };
  return getTestInput({
    [epochPhase]: { epochs: Array(epochQty).fill(epoch) },
  });
}

function getCircle<T extends keyof EpochsToNotify>(
  epochPhase: T,
  circleInputs: Partial<EpochsToNotify[T]['epochs'][0]['circle']>
) {
  return { ...mockCircle[epochPhase], ...circleInputs };
}

describe('epoch Cron Logic', () => {
  beforeEach(() => {
    mockSendSocial.mockReset();
    mockMutation.mockReset();
  });
  describe('endEpoch', () => {
    test('should notify of the epoch end', async () => {
      const orgName = 'big ol party';
      const input = getEpochInput('endEpoch', {
        repeat: 0,
        circle: getCircle('endEpoch', {
          discord_webhook: 'https://webhook/webhook',
          telegram_id: '-99',
          organization: { name: orgName, telegram_id: '-77' },
        }),
      });
      const result = await endEpoch(input);
      expect(result).toEqual([]);
      expect(mockSendSocial).toBeCalledWith({
        channels: { telegram: true },
        circleId: 1,
        message:
          `${orgName}/circle with epoch that has ended epoch has just ended!\n` +
          'Users who did not allocate any GIVE:\n' +
          'person 0, person 1',
        notifyOrg: false,
        sanitize: false,
      });
      expect(mockSendSocial).toBeCalledTimes(3);
    });
    test('repeating epoch', async () => {
      mockQuery
        .mockResolvedValueOnce({ epochs_aggregate: {} })
        .mockResolvedValueOnce({ epochs: [] });
      const input = getEpochInput('endEpoch', {
        circle: getCircle('endEpoch', { telegram_id: '3' }),
      });
      const result = await endEpoch(input);
      expect(result).toEqual([]);
      //expect(mockMutation).not.toBeCalled();
      expect(mockMutation).toBeCalledWith({
        delete_pending_token_gifts: [
          { where: { epoch_id: { _eq: 9 } } },
          { affected_rows: true },
        ],
        insert_token_gifts: [
          {
            objects: [
              {
                circle_id: 1,
                epoch_id: 9,
                note: 'Consequatur sit vel et nostrum ut porro. Laborum iure molestiae et facere placeat molestiae iste molestiae. Commodi inventore sequi quia.',
                recipient_address:
                  '0x0x3A0e10aBdAca6bF2c38bc4AEea521A84d142A317',
                recipient_id: '7',
                sender_address: '0x0xE0E2B4df0ce0216F7c64153A34Ec8F1CA56a4dFC',
                sender_id: '0',
                tokens: 10,
              },
              {
                circle_id: 1,
                epoch_id: 9,
                note: 'Explicabo aut qui adipisci non. In cupiditate voluptas molestiae fuga voluptatem quia et. Id cupiditate est id voluptates dolorem recusandae est.',
                recipient_address:
                  '0x0xaEFC70a327b2DBb76E7cDD5C0DFa9c7Bc62aEd60',
                recipient_id: '0',
                sender_address: '0x0x095AdAE8EEc4E0eE86a3d0c9EBE88dF037212fb0',
                sender_id: '1',
                tokens: 10,
              },
              {
                circle_id: 1,
                epoch_id: 9,
                note: 'Deserunt eius et dolore consequatur et ipsam ut saepe vel. Perspiciatis sit consectetur temporibus officia laborum quae. Perferendis quam ab.',
                recipient_address:
                  '0x0x5908b62dc93F9ef469074B0DEDBeb5056CbbCB4c',
                recipient_id: '3',
                sender_address: '0x0xe8Ec0DFB85F1d3C4c9d76fcfA1C0ABfDD075ea97',
                sender_id: '2',
                tokens: 10,
              },
              {
                circle_id: 1,
                epoch_id: 9,
                note: 'Minus quae occaecati. Assumenda sit similique et laudantium vel. Quidem et est vel nihil.',
                recipient_address:
                  '0x0xb5eC193dd572DbBa434deb3eb3FA341bDBf0678D',
                recipient_id: '1',
                sender_address: '0x0x15F036BDD1fec43baD7a4CdC63EbEa54294aa7A0',
                sender_id: '3',
                tokens: 10,
              },
              {
                circle_id: 1,
                epoch_id: 9,
                note: 'Nulla aliquid ut. Et fuga hic. Dolorem fuga at quia.',
                recipient_address:
                  '0x0xFe4FFcebB2a7D0b3cAE068fCBfafa4C9cc5Fa465',
                recipient_id: '7',
                sender_address: '0x0x21effAd8Bf0cAFA65654de7BBb9dB1F96F37Dcb9',
                sender_id: '4',
                tokens: 10,
              },
              {
                circle_id: 1,
                epoch_id: 9,
                note:
                  'Voluptatem est placeat et. Velit inventore aut molestias laudantium non. Quibusdam corporis ullam ' +
                  'corrupti accusantium sed deserunt sunt.',
                recipient_address:
                  '0x0xEC69BCed03A1d0e1cac270FAF88AC9F9caea1BF8',
                recipient_id: '2',
                sender_address: '0x0xC38bABbDb4FAB50cf2a8E14b5f1a972Bd1B8faAA',
                sender_id: '5',
                tokens: 10,
              },
              {
                circle_id: 1,
                epoch_id: 9,
                note: 'Et asperiores eaque et est eaque consequuntur quisquam dolorum. Aut est ut odit alias minima hic omnis. Necessitatibus quibusdam excepturi repudiandae porro ratione beatae nesciunt et amet.',
                recipient_address:
                  '0x0x8E90b5EC06faDe03b67DCDcbf59Dda670Dc46CbC',
                recipient_id: '0',
                sender_address: '0x0xCdfDcFCfAA5EF8c5e3a2DBD3C5eCc66FF5Bbb6AE',
                sender_id: '6',
                tokens: 10,
              },
            ],
          },
          { __typename: true, affected_rows: true },
        ],
      });
      expect(mockMutation).toBeCalledWith({
        update_epochs_by_pk: [
          {
            pk_columns: { id: 9 },
            _set: {
              ended: true,
            },
          },
          { __typename: true },
        ],
        __alias: {
          '0_history': {
            insert_histories_one: [
              {
                object: {
                  bio: 'Repellat quisquam recusandae alias consequuntur corporis. Ratione ut sunt qui amet iure ut libero qui recusandae. Nulla quam ipsam nobis cupiditate sed dignissimos. Incidunt accusantium sed libero repudiandae esse blanditiis natus et eos. Velit omnis et porro ut et ipsam explicabo eligendi occaecati.',
                  circle_id: 1,
                  epoch_id: 9,
                  user_id: 0,
                },
              },
              { __typename: true },
            ],
          },
          '0_userReset': {
            update_users_by_pk: [
              {
                _set: {
                  bio: null,
                  epoch_first_visit: true,
                  give_token_received: 0,
                  give_token_remaining: 100,
                  non_receiver: true,
                },
                pk_columns: { id: 0 },
              },
              { __typename: true },
            ],
          },
          '1_history': {
            insert_histories_one: [
              {
                object: {
                  bio: 'Et saepe eum dicta eum eaque enim ipsum inventore debitis. Aspernatur deserunt quam tempore a velit provident velit. Nostrum ipsam qui nobis repellendus fugiat velit sit. Placeat fuga doloribus. Placeat ullam minima ducimus temporibus modi aut architecto.',
                  circle_id: 1,
                  epoch_id: 9,
                  user_id: 1,
                },
              },
              { __typename: true },
            ],
          },
          '1_userReset': {
            update_users_by_pk: [
              {
                _set: {
                  bio: null,
                  epoch_first_visit: true,
                  give_token_received: 0,
                  give_token_remaining: 200,
                  non_receiver: true,
                },
                pk_columns: { id: 1 },
              },
              { __typename: true },
            ],
          },
          '2_history': {
            insert_histories_one: [
              {
                object: {
                  bio: 'Totam voluptates explicabo exercitationem ut quis. Magni cupiditate sit. Soluta sint non. Ut ullam quos qui illo error sunt laborum ratione a. Quaerat cumque incidunt aut provident esse hic.',
                  circle_id: 1,
                  epoch_id: 9,
                  user_id: 2,
                },
              },
              { __typename: true },
            ],
          },
          '2_userReset': {
            update_users_by_pk: [
              {
                _set: {
                  bio: null,
                  epoch_first_visit: true,
                  give_token_received: 0,
                  give_token_remaining: 300,
                },
                pk_columns: { id: 2 },
              },
              { __typename: true },
            ],
          },
          '3_history': {
            insert_histories_one: [
              {
                object: {
                  bio: 'Quos esse ut ab voluptas sed quae nam. Sint autem rerum doloremque. Aut ut ut eos ducimus eos saepe. Vel in ut dolorem et molestiae ea ut sunt. Quidem est consequuntur aut est fuga est placeat ex.',
                  circle_id: 1,
                  epoch_id: 9,
                  user_id: 3,
                },
              },
              { __typename: true },
            ],
          },
          '3_userReset': {
            update_users_by_pk: [
              {
                _set: {
                  bio: null,
                  epoch_first_visit: true,
                  give_token_received: 0,
                  give_token_remaining: 400,
                },
                pk_columns: { id: 3 },
              },
              { __typename: true },
            ],
          },
          '4_history': {
            insert_histories_one: [
              {
                object: {
                  bio:
                    'Voluptas enim ex eveniet facere. Aut delectus aut nam et dolorum. Fugit repellendus hic. Qui ex culpa. Voluptate vel labore omnis ut est sunt corporis ' +
                    'alias est.',
                  circle_id: 1,
                  epoch_id: 9,
                  user_id: 4,
                },
              },
              { __typename: true },
            ],
          },
          '4_userReset': {
            update_users_by_pk: [
              {
                _set: {
                  bio: null,
                  epoch_first_visit: true,
                  give_token_received: 0,
                  give_token_remaining: 500,
                },
                pk_columns: { id: 4 },
              },
              { __typename: true },
            ],
          },
          '5_history': {
            insert_histories_one: [
              {
                object: {
                  bio: 'Sequi voluptas culpa non aut rerum impedit. Rem voluptates voluptas fuga totam. Ut non fugiat. Omnis repellat quasi ipsum rem eos quod recusandae. Optio laudantium et incidunt.',
                  circle_id: 1,
                  epoch_id: 9,
                  user_id: 5,
                },
              },
              { __typename: true },
            ],
          },
          '5_userReset': {
            update_users_by_pk: [
              {
                _set: {
                  bio: null,
                  epoch_first_visit: true,
                  give_token_received: 0,
                  give_token_remaining: 600,
                },
                pk_columns: { id: 5 },
              },
              { __typename: true },
            ],
          },
          '6_history': {
            insert_histories_one: [
              {
                object: {
                  bio: 'Molestias facere quia et ab quo occaecati quia ipsum. Qui accusantium odit. Molestias dolore aut. Quis ut incidunt omnis delectus voluptas minima quia ut. Sunt qui similique ut quam.',
                  circle_id: 1,
                  epoch_id: 9,
                  user_id: 6,
                },
              },
              { __typename: true },
            ],
          },
          '6_userReset': {
            update_users_by_pk: [
              {
                _set: {
                  bio: null,
                  epoch_first_visit: true,
                  give_token_received: 0,
                  give_token_remaining: 700,
                },
                pk_columns: { id: 6 },
              },
              { __typename: true },
            ],
          },
        },
      });
      expect(mockMutation).toBeCalledWith({
        update_epochs_by_pk: [
          { _set: { number: 1 }, pk_columns: { id: 9 } },
          { number: true },
        ],
      });
      expect(mockMutation).toBeCalledWith({
        insert_epochs_one: [
          {
            object: {
              circle_id: 1,
              repeat: 2,
              repeat_day_of_month: 7,
              days: 2,
              start_date: expect.stringMatching(isoTime),
              end_date: expect.stringMatching(isoTime),
            },
          },
          { __typename: true },
        ],
      });
      expect(mockMutation).toBeCalledWith({
        update_epochs_by_pk: [
          {
            pk_columns: { id: 9 },
            _set: {
              notified_end: expect.stringMatching(isoTime),
            },
          },
          { id: true },
        ],
      });
      expect(mockMutation).toBeCalledTimes(5);
      expect(mockSendSocial).toBeCalledWith({
        channels: { telegram: true },
        circleId: 1,
        message: expect.stringContaining(
          'A new repeating epoch has been created'
        ),
        notifyOrg: false,
        sanitize: false,
      });
      expect(mockSendSocial).toBeCalledWith({
        channels: { telegram: true },
        circleId: 1,
        message:
          'mock org/circle with epoch that has ended epoch has just ended!\n' +
          'Users who did not allocate any GIVE:\n' +
          'person 0, person 1',
        notifyOrg: false,
        sanitize: false,
      });
      expect(mockSendSocial).toBeCalledTimes(2);
    });
  });
  describe('notifyEpochEnd', () => {
    test('no notifications enabled', async () => {
      const input = getEpochInput('notifyEnd', {});
      const result = await notifyEpochEnd(input);
      expect(result).toEqual([]);
      expect(mockSendSocial).not.toBeCalled();
      expect(mockMutation).not.toBeCalled();
    });
    test('notifications enabled for Telegram', async () => {
      const input = getEpochInput('notifyEnd', {
        circle: getCircle('notifyEnd', { telegram_id: '-29' }),
      });
      const result = await notifyEpochEnd(input);
      expect(result).toEqual([]);
      expect(mockSendSocial).toBeCalledTimes(1);
      expect(mockSendSocial).toBeCalledWith({
        channels: { telegram: true },
        circleId: 1,
        notifyOrg: false,
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
      expect(mockSendSocial).toBeCalledTimes(1);
      expect(mockSendSocial).toBeCalledWith({
        channels: { discord: true },
        circleId: 1,
        message:
          'mock Org/circle with ending epoch epoch ends in less than 24 hours!\n' +
          'Users that have yet to fully allocate their GIVE:\n' +
          'bob, alice',
        sanitize: false,
        notifyOrg: false,
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
      expect(mockSendSocial).toBeCalledTimes(2);
      expect(mockSendSocial).toBeCalledWith({
        channels: { telegram: true },
        circleId: 1,
        notifyOrg: false,
        message:
          'mock Org/circle with ending epoch epoch ends in less than 24 hours!\n' +
          'Users that have yet to fully allocate their GIVE:\n' +
          'bob, alice',
        sanitize: false,
      });
      expect(mockSendSocial).toBeCalledWith({
        channels: { discord: true },
        circleId: 1,
        notifyOrg: false,
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
      expect(mockSendSocial).not.toBeCalled();
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
      expect(mockSendSocial).toBeCalledTimes(2);
      expect(mockSendSocial).toBeCalledWith({
        channels: { discord: true },
        circleId: 5,
        notifyOrg: false,
        message: expect.stringContaining(
          'A new mock Org/mockCircle epoch is active!\n' +
            '5 users will be participating and the duration of the epoch will be:\n'
        ),
        sanitize: false,
      });
      expect(mockSendSocial).toBeCalledWith({
        channels: { telegram: true },
        circleId: 5,
        notifyOrg: false,
        message: expect.stringContaining(
          'A new mock Org/mockCircle epoch is active!\n' +
            '5 users will be participating and the duration of the epoch will be:\n'
        ),
        sanitize: false,
      });
    });
    test("social message throw doesn't bubble up", async () => {
      const spy = jest.spyOn(console, 'error').mockImplementationOnce(() => {});
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
