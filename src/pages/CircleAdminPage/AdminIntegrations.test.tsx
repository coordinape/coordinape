import { act, render, screen } from '@testing-library/react';

import { rSelectedCircleIdSource } from 'recoilState';
import { fixtures, TestWrapper, useMockRecoilState } from 'utils/testing';

import { AdminIntegrations } from './AdminIntegrations';

const snapshotState: any = {};

afterEach(() => snapshotState.release?.());

jest.mock('lib/gql/client', () => ({
  client: {
    query: jest.fn(() => ({
      circles_by_pk: {},
    })),
  },
}));

test('dework integration callback link', async () => {
  const Harness = () => {
    useMockRecoilState(snapshotState, set => {
      set(rSelectedCircleIdSource, fixtures.circle.id);
    });
    return <AdminIntegrations circleId={fixtures.circle.id} />;
  };

  await act(async () => {
    await render(
      <TestWrapper>
        <Harness />
      </TestWrapper>
    );
  });

  const button = await screen.findByText('Connect Dework');
  expect((button as HTMLLinkElement).href).toEqual(
    'https://app.dework.xyz/apps/install/coordinape?redirect=http://localhost/circles/1/admin/connect-integration'
  );
});
