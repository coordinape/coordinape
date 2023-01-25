import assert from 'assert';

import { render, screen } from '@testing-library/react';
import { CircleTokenType } from 'common-lib/circleShareTokens';
import { useAuthStore } from 'features/auth';
import { setMockHeaders } from 'lib/gql/client';
import { Routes, Route } from 'react-router-dom';

import { adminClient } from '../../../api-lib/gql/adminClient';
import { createProfile } from '../../../api-test/helpers';
import { createCircle } from '../../../api-test/helpers/circles';
import { TestWrapper } from 'utils/testing';

import { JoinCirclePage } from './JoinCirclePage';

import { Awaited } from 'types/shim';

let circle: Awaited<ReturnType<typeof createCircle>>,
  profile: Awaited<ReturnType<typeof createProfile>>,
  joinToken: string;

beforeAll(async () => {
  profile = await createProfile(adminClient);
  circle = await createCircle(adminClient);

  const resp = await adminClient.mutate(
    {
      __alias: {
        createJoinToken: {
          insert_circle_share_tokens_one: [
            {
              object: { circle_id: circle.id, type: CircleTokenType.Magic },
            },
            { uuid: true },
          ],
        },
      },
    },
    { operationName: 'test' }
  );
  joinToken = resp.createJoinToken?.uuid;
});

describe('join page', () => {
  test('invalid token', async () => {
    render(<TestWrapper withRoutes routeHistory={[`/join/foo`]} />);
    await screen.findByText(/Invalid invite link/);
  });

  test('valid token, logged out', async () => {
    render(<TestWrapper withRoutes routeHistory={[`/join/${joinToken}`]} />);

    assert(circle);
    await screen.findByText(circle.name);
    screen.getByText('Connect Wallet');
  });

  test('valid token, logged in', async () => {
    useAuthStore.setState({ step: 'done', address: profile.address });
    setMockHeaders({
      'x-hasura-role': 'user',
      'x-hasura-address': profile.address,
      'x-hasura-user-id': profile.id.toString(),
    });

    render(
      <TestWrapper routeHistory={[`/join/${joinToken}`]}>
        <Routes>
          <Route path="/join/:token" element={<JoinCirclePage />} />
        </Routes>
      </TestWrapper>
    );
    await screen.findByText('Wallet Address');
    screen.getByText(
      (_, el) => el instanceof HTMLInputElement && el.value === profile.address
    );
  });
});

describe('welcome page', () => {
  test.todo('wrong address');
  test.todo('already a member');
});
