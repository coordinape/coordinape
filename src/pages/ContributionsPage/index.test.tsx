import { render, screen } from '@testing-library/react';

import { adminClient } from '../../../api-lib/gql/adminClient';
import { createCircle, createUser } from '../../../api-test/helpers';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { useSelectedCircle } from 'recoilState/app';
import { TestWrapper } from 'utils/testing';
import { setupMockClientForProfile } from 'utils/testing/client';

import ContributionsPage from './ContributionsPage';

jest.mock('recoilState/app', () => ({
  useSelectedCircle: jest.fn(),
}));

jest.mock('hooks/useConnectedAddress', () => jest.fn());

beforeEach(async () => {
  const circle = await createCircle(adminClient);
  (useSelectedCircle as jest.Mock).mockImplementation(() => ({
    circle: { id: circle.id },
    myUser: { role: 0 },
  }));
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
