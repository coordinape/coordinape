import assert from 'assert';

import { render, screen } from '@testing-library/react';
import * as auth from 'features/auth/store';
import { Mock, vi } from 'vitest';

import { adminClient } from '../../../api-lib/gql/adminClient';
import { createCircle, createUser } from '../../../api-test/helpers';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { useCircleIdParam } from 'routes/hooks';
import { TestWrapper } from 'utils/testing';
import { setupMockClientForProfile } from 'utils/testing/client';

import ContributionsPage from './ContributionsPage';

vi.mock('routes/hooks', () => ({
  useCircleIdParam: vi.fn(),
}));

vi.mock('features/auth/useLoginData', () => ({
  useMyUser: () => ({ role: 0 }),
}));

vi.mock('hooks/useConnectedAddress', () => vi.fn());

beforeEach(async () => {
  const circle = await createCircle(adminClient);
  (useCircleIdParam as Mock).mockImplementation(() => circle.id);
  const user = await createUser(adminClient, {
    circle_id: circle.id,
  });
  assert(user.profile, 'Failed to fetch user profile');
  (useConnectedAddress as Mock).mockImplementation(() => user.profile?.address);
  vi.spyOn(auth, 'useAuthStore').mockReturnValue(user.profile_id);

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
