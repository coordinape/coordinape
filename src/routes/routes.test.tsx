import { render, screen } from '@testing-library/react';
import { useAuthStore } from 'features/auth';

import { adminClient } from '../../api-lib/gql/adminClient';
import { createUser } from '../../api-test/helpers';
import { TestWrapper } from 'utils/testing';

import { Awaited } from 'types/shim';

let user: Awaited<ReturnType<typeof createUser>>;

beforeAll(async () => {
  user = await createUser(adminClient);
});

test('redirect after login', async () => {
  useAuthStore.setState({
    step: 'done',
    address: user.address,
  });
  render(
    <TestWrapper
      withRoutes
      routeHistory={[
        `/login?next=/organizations/${user.circle.organization.id}/vaults`,
      ]}
    />
  );
  screen.getByTestId('loading-VaultsPage');
});
