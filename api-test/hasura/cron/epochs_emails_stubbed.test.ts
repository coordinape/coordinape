import faker from 'faker';
import { DateTime } from 'luxon';

import {
  endEpoch,
  EpochsToNotify,
  notifyEpochEnd,
  notifyEpochStart,
} from '../../../api/hasura/cron/epochs';
import { insertActivity } from '../../../api-lib/event_triggers/activity/mutations';
import { adminClient } from '../../../api-lib/gql/adminClient';
import {
  sendEpochEndedEmail,
  sendEpochEndingSoonEmail,
  sendEpochStartedEmail,
} from '../../../api-lib/postmark';
import { sendSocialMessage } from '../../../api-lib/sendSocialMessage';

jest.mock('../../../api-lib/gql/adminClient', () => ({
  adminClient: { query: jest.fn(), mutate: jest.fn() },
}));

jest.mock('../../../api-lib/sendSocialMessage', () => ({
  sendSocialMessage: jest.fn(),
}));

jest.mock('../../../api-lib/event_triggers/activity/mutations', () => ({
  insertActivity: jest.fn(),
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
const mockInsertActivity = insertActivity as jest.MockedFunction<
  typeof insertActivity
>;

jest.mock('../../../api-lib/postmark', () => ({
  sendEpochEndedEmail: jest.fn(
    (params: {
      email: string;
      circle_name: string;
      circle_id: number;
      epoch_id: number;
      num_give_senders: number;
      num_notes_received: number;
    }) => Promise.resolve({ params })
  ),
  sendEpochStartedEmail: jest.fn(
    (params: {
      email: string;
      circle_name: string;
      circle_id: number;
      epoch_id: number;
    }) => Promise.resolve({ params })
  ),
  sendEpochEndingSoonEmail: jest.fn(
    (params: {
      email: string;
      circle_name: string;
      circle_id: number;
      epoch_id: number;
    }) => Promise.resolve({ params })
  ),
}));

faker.seed(1);
const mockCircle = {
  notifyStartEpochs: {
    users_aggregate: {
      aggregate: {
        count: 5,
      },
    },
    id: 1,
    token_name: 'GIVE',
    name: 'circle with starting epoch',
    organization: {
      id: 78,
      name: 'mock Org',
    },
    users: [
      { profile: { name: 'bob', emails: [{ email: 'bob@test.com' }] } },
      { profile: { name: 'alice', emails: [{ email: 'alice@test.com' }] } },
    ],
  },
  notifyEndEpochs: {
    id: 1,
    circle_id: 5,
    token_name: 'GIVE',
    name: 'circle with ending epoch',
    organization: { name: 'mock Org' },
    users: [
      { profile: { name: 'bob', emails: [{ email: 'bob@test.com' }] } },
      { profile: { name: 'alice', emails: [{ email: 'alice@test.com' }] } },
    ],
  },
  endEpoch: {
    id: 1,
    auto_opt_out: true,
    name: 'circle with epoch that has ended',
    organization: { id: 47, name: 'mock org' },
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
        profile: {
          name: 'person ' + i,
          emails: [i < 6 ? { email: `person${i}@test.com` } : {}],
        },
      })),
  },
};

const mockEpoch = {
  notifyStartEpochs: {
    id: 9,
    circle_id: 1,
    start_date: DateTime.now().minus({ days: 1 }),
    end_date: DateTime.now().plus({ days: 1 }),
    circle: mockCircle.notifyStartEpochs,
  },
  notifyEndEpochs: {
    id: 5,
    circle_id: 1,
    number: 3,
    end_date: DateTime.now().plus({ days: 1 }),
    circle: mockCircle.notifyEndEpochs,
    token_gifts: [{ tokens: 50 }, { tokens: 100 }],
  },
  endEpoch: {
    id: 6,
    start_date: DateTime.now().minus({ days: 1 }).toISO(),
    end_date: DateTime.now().plus({ days: 1 }).toISO(),
    repeat_data: { type: 'monthly', week: 0, time_zone: 'UTC' },
    circle: mockCircle.endEpoch,
    circle_id: 1,
    epoch_pending_token_gifts: Array(7)
      .fill(null)
      .map((_, i) => ({
        circle_id: 1,
        epoch_id: 9,
        tokens: 10,
        note: faker.lorem.sentences(3),
        sender_id: faker.datatype.number(7).toString(),
        sender_address: '0x' + faker.datatype.hexaDecimal(40),
        recipient_id: i,
        recipient_address: '0x' + faker.datatype.hexaDecimal(40),
      })),
  },
};

function getTestInput(mockInput: {
  notifyStartEpochs?: EpochsToNotify['notifyStartEpochs'];
  notifyEndEpochs?: EpochsToNotify['notifyEndEpochs'];
  endEpoch?: EpochsToNotify['endEpoch'];
}): EpochsToNotify {
  return {
    notifyStartEpochs: mockInput.notifyStartEpochs ?? [],
    notifyEndEpochs: mockInput.notifyEndEpochs ?? [],
    endEpoch: mockInput.endEpoch ?? [],
  };
}

function getEpochInput<T extends keyof EpochsToNotify>(
  epochPhase: T,
  input: Partial<EpochsToNotify[T][0]>,
  epochQty = 1
): EpochsToNotify {
  const circle = { ...mockCircle[epochPhase], ...input.circle };
  const epoch = { ...mockEpoch[epochPhase], ...input, circle };
  return getTestInput({
    [epochPhase]: Array(epochQty).fill(epoch),
  });
}
describe('send email notifications to circle members with verified emails', () => {
  beforeEach(() => {
    mockSendSocial.mockReset();
    mockMutation.mockReset();
    mockInsertActivity.mockReset();
    mockQuery.mockReset();

    mockQuery.mockResolvedValueOnce({ epochs_aggregate: {} });
    mockQuery.mockResolvedValueOnce({ epochs_by_pk: undefined });
  });

  test('on epoch end', async () => {
    const input = getEpochInput('endEpoch', {
      repeat: 0,
      repeat_data: null,
    });
    const result = await endEpoch(input);
    expect(result).toEqual([]);
    expect(sendEpochEndedEmail).toBeCalledTimes(6); //number of users with emails
    expect(sendEpochEndedEmail).nthCalledWith(1, {
      circle_id: 1,
      circle_name: 'circle with epoch that has ended',
      email: 'person0@test.com',
      epoch_id: 6,
      num_give_senders: 1,
      num_notes_received: 1,
    });
  });

  test('on epoch start', async () => {
    const input = getEpochInput('notifyStartEpochs', {
      circle_id: 5,
      number: 1,
    });
    const result = await notifyEpochStart(input);
    expect(result).toEqual([]);
    expect(sendEpochStartedEmail).toBeCalledTimes(2); //number of users with emails
    expect(sendEpochStartedEmail).nthCalledWith(1, {
      circle_id: 5,
      circle_name: 'circle with starting epoch',
      email: 'bob@test.com',
      epoch_id: 9,
    });
    expect(sendEpochStartedEmail).nthCalledWith(2, {
      circle_id: 5,
      circle_name: 'circle with starting epoch',
      email: 'alice@test.com',
      epoch_id: 9,
    });
  });

  test('for epochs ending soon', async () => {
    const input = getEpochInput('notifyEndEpochs', {
      circle_id: 5,
      number: 1,
    });
    const result = await notifyEpochEnd(input);
    expect(result).toEqual([]);
    expect(sendEpochEndingSoonEmail).toBeCalledTimes(2); //number of users with emails
    expect(sendEpochEndingSoonEmail).nthCalledWith(1, {
      circle_id: 5,
      circle_name: 'circle with ending epoch',
      email: 'bob@test.com',
      epoch_id: 5,
    });
    expect(sendEpochEndingSoonEmail).nthCalledWith(2, {
      circle_id: 5,
      circle_name: 'circle with ending epoch',
      email: 'alice@test.com',
      epoch_id: 5,
    });
  });
});

describe('No email notification for sample circles ', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockQuery.mockResolvedValueOnce({ epochs_aggregate: {} });
    mockQuery.mockResolvedValueOnce({ epochs_by_pk: undefined });
  });

  test('on epoch end', async () => {
    const input = getEpochInput('endEpoch', {
      repeat: 0,
      repeat_data: null,
      circle: { id: 1, organization: { sample: true } },
    });
    const result = await endEpoch(input);
    expect(result).toEqual([]);
    expect(sendEpochEndedEmail).toBeCalledTimes(0);
  });

  test('on epoch start', async () => {
    const input = getEpochInput('notifyStartEpochs', {
      circle_id: 5,
      number: 1,
      circle: { organization: { sample: true } },
    });
    const result = await notifyEpochStart(input);
    expect(result).toEqual([]);
    expect(sendEpochStartedEmail).toBeCalledTimes(0);
  });

  test('for epochs ending soon', async () => {
    const input = getEpochInput('notifyEndEpochs', {
      circle_id: 5,
      number: 1,
      circle: { organization: { sample: true } },
    });
    const result = await notifyEpochEnd(input);
    expect(result).toEqual([]);
    expect(sendEpochEndingSoonEmail).toBeCalledTimes(0);
  });
});
