import type { VercelRequest, VercelResponse } from '@vercel/node';
import mixpanel from 'mixpanel';

import { createCircle, createUser } from '../../api-test/helpers';
import { adminClient } from '../gql/adminClient';

import handler from './sendInteractionEventToMixpanel';

let circle: any, user: any;

jest.mock('mixpanel', () => {
  const mp = {
    track: jest.fn(async (eventName, props, callback) => callback()),
  };

  return {
    init: jest.fn(() => mp),
    Mixpanel: null,
  };
});

beforeAll(async () => {
  circle = await createCircle(adminClient);
  user = await createUser(adminClient, { circle_id: circle.id });
});

test('include circle and org name if only circle id is included', async () => {
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
    status: jest.fn(() => res),
    json: jest.fn(),
  } as unknown as VercelResponse;

  await handler(req, res);

  const mockTrack = mixpanel.init('').track as jest.Mock;
  expect(mockTrack).toHaveBeenCalledTimes(2);

  const userEvent = mockTrack.mock.calls[0];
  expect(userEvent[0]).toEqual('test_event');
  expect(userEvent[1]).toEqual(
    expect.objectContaining({
      circle_name: circle.name,
      org_id: circle.organization.id,
      organization_name: circle.organization.name,
    })
  );

  const circleEvent = mockTrack.mock.calls[1];
  expect(circleEvent[0]).toEqual('circle_test_event');
  expect(circleEvent[1]).toEqual(
    expect.objectContaining({
      circle_name: circle.name,
      org_id: circle.organization.id,
      organization_name: circle.organization.name,
    })
  );

  expect((res.json as jest.Mock).mock.calls[0][0].message).toEqual(
    'user event recorded'
  );
});
