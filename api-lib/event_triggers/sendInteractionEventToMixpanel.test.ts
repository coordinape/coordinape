import type { VercelRequest, VercelResponse } from '@vercel/node';
import mixpanel from 'mixpanel';
import { Mock, vi } from 'vitest';

import {
  createCircle,
  createOrganization,
  createUser,
} from '../../api-test/helpers';
import { adminClient } from '../gql/adminClient';

import handler from './sendInteractionEventToMixpanel';

vi.mock('mixpanel', () => {
  const mp = {
    track: vi.fn(async (eventName, props, callback) => callback()),
  };

  return {
    default: {
      init: vi.fn(() => mp),
      Mixpanel: null,
    },
  };
});

afterEach(() => {
  vi.clearAllMocks();
});

test('include circle and org name if only circle id is included', async () => {
  const circle = await createCircle(adminClient);
  const user = await createUser(adminClient, { circle_id: circle.id });
  const req = {
    body: {
      event: {
        data: {
          new: {
            profile_id: user.profile.id,
            circle_id: circle.id,
            id: 'event_id',
            event_type: 'test_event',
            event_subtype: 'subtype',
          },
        },
      },
    },
  } as VercelRequest;

  const res = {
    status: vi.fn(() => res),
    json: vi.fn(),
  } as unknown as VercelResponse;

  await handler(req, res);

  const mockTrack = mixpanel.init('').track as Mock;
  expect(mockTrack).toHaveBeenCalledTimes(2);

  const userEvent = mockTrack.mock.calls[0];
  expect(userEvent[0]).toEqual('test_event');
  expect(userEvent[1]).toEqual(
    expect.objectContaining({
      circle_name: circle.name,
      org_id: circle.organization.id,
      organization_name: circle.organization.name,
    }),
  );

  const circleEvent = mockTrack.mock.calls[1];
  expect(circleEvent[0]).toEqual('circle_test_event');
  expect(circleEvent[1]).toEqual(
    expect.objectContaining({
      circle_name: circle.name,
      org_id: circle.organization.id,
      organization_name: circle.organization.name,
    }),
  );

  expect((res.json as Mock).mock.calls[0][0].message).toEqual(
    'user event recorded',
  );
});

test('ignore sample org events', async () => {
  const org = await createOrganization(adminClient, { sample: true });
  const circle = await createCircle(adminClient, { organization_id: org.id });
  const user = await createUser(adminClient, { circle_id: circle.id });
  const req = {
    body: {
      event: {
        data: {
          new: {
            circle_id: circle.id,
            profile_id: user.profile.id,
            id: 'event_id',
            event_type: 'test_event',
            event_subtype: 'subtype',
          },
        },
      },
    },
  } as VercelRequest;

  const res = {
    status: vi.fn(() => res),
    json: vi.fn(),
  } as unknown as VercelResponse;

  await handler(req, res);

  const mockTrack = mixpanel.init('').track as Mock;
  expect(mockTrack).toHaveBeenCalledTimes(0);

  expect((res.json as Mock).mock.calls[0][0].message).toEqual(
    'user event skipped',
  );
});
