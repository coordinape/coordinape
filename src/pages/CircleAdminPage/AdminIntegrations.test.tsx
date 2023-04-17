import { act, render, screen } from '@testing-library/react';

import { fixtures, TestWrapper } from 'utils/testing';

import { AdminIntegrations } from './AdminIntegrations';

const snapshotState: any = {};

afterEach(() => snapshotState.release?.());

jest.mock('lib/gql/client', () => ({
  client: { query: jest.fn(() => ({ circles_by_pk: {} })) },
}));

test('dework integration callback link', async () => {
  await act(async () => {
    await render(
      <TestWrapper>
        <AdminIntegrations circleId={fixtures.circle.id} />
      </TestWrapper>
    );
  });

  const button = await screen.findByText('Add Dework Connection');
  expect((button as HTMLLinkElement).href).toEqual(
    `https://app.dework.xyz/apps/install/coordinape?redirect=http://${window.location.host}/circles/1/admin/connect-integration`
  );
});
