import { render, screen } from '@testing-library/react';
import { useAuthStore } from 'features/auth';

import { TestWrapper } from 'utils/testing';

test('redirect after login', async () => {
  useAuthStore.setState({ step: 'done', address: '0x0' });
  render(<TestWrapper withRoutes routeHistory={['/login?next=/vaults']} />);
  screen.getByTestId('loading-VaultsPage');
});
