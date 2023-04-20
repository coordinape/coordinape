import { render, screen } from '@testing-library/react';

import { adminClient } from '../../../api-lib/gql/adminClient';
import { createCircle, createUser } from '../../../api-test/helpers';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { useCircleIdParam } from 'routes/hooks';
import { TestWrapper } from 'utils/testing';
import { setupMockClientForProfile } from 'utils/testing/client';

import ContributionsPage from './ContributionsPage';

jest.mock('routes/hooks', () => ({
  useCircleIdParam: jest.fn(),
}));

jest.mock('features/auth/useLoginData', () => ({
  useMyUser: () => ({ role: 0 }),
}));

jest.mock('hooks/useConnectedAddress', () => jest.fn());

beforeEach(async () => {
  const circle = await createCircle(adminClient);
  (useCircleIdParam as jest.Mock).mockImplementation(() => circle.id);
  const user = await createUser(adminClient, {
    circle_id: circle.id,
  });

  (useConnectedAddress as jest.Mock).mockImplementation(() => user.address);

  setupMockClientForProfile(user.profile);
});

test('basic rendering with no contributions', async () => {
  render(
    <TestWrapper>
      <ContributionsPage />
    </TestWrapper>
  );
  await screen.findByText('Contributions');
});
