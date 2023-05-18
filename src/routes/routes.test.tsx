import { render, screen } from '@testing-library/react';
import { useAuthStore } from 'features/auth';

import { adminClient } from '../../api-lib/gql/adminClient';
import { createUser } from '../../api-test/helpers';
import { TestWrapper } from 'utils/testing';

import { Awaited } from 'types/shim';

let user: Awaited<ReturnType<typeof createUser>>;

// without this mock, we get `RangeError: Maximum call stack size exceeded at
// Function.keys`. it doesn't happen if the call to useLocation in
// useRecordPageView is commented out, so it is probably some prototype
// pollution issue caused by react-router
jest.mock('@typeform/embed-react', () => ({
  PopupButton: ({ children }: { children: any }) => <div>{children}</div>,
}));

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
