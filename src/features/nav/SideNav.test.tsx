import { useEffect } from 'react';

import { act, render, screen } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';

import { fixtures, TestWrapper } from 'utils/testing';

import { useNavQuery } from './getNavData';
import { SideNav } from './SideNav';

jest.mock('./getNavData', () => ({
  useNavQuery: jest.fn(),
}));

jest.mock('../../pages/HistoryPage/useReceiveInfo', () => ({
  useReceiveInfo: jest.fn(() => ({})),
}));

beforeEach(() => {});

test('show circle links for distributions route', async () => {
  (useNavQuery as any).mockReturnValue({
    data: {
      organizations: [
        {
          id: fixtures.circle.organization_id,
          name: fixtures.organization.name,
          logo: fixtures.organization.logo,
          myCircles: [
            {
              id: fixtures.circle.id,
              name: fixtures.circle.name,
              logo: fixtures.circle.logo,
              users: [{ ...fixtures.user, role: 1 }],
            },
          ],
          otherCircles: [],
          members: [],
        },
      ],
      profile: { name: 'tonka' },
      claims_aggregate: { aggregate: { count: 0 } },
    },
  });
  const Harness = () => {
    const navigate = useNavigate();

    useEffect(() => {
      navigate(`/circles/${fixtures.circle.id}/distributions/10`);
    }, []);

    return <SideNav />;
  };

  await act(async () => {
    await render(
      <TestWrapper withWeb3>
        <Harness />
      </TestWrapper>
    );
  });

  expect(screen.getByText('tonka'));
  expect(screen.getByText(fixtures.organization.name));
  expect(screen.getByText(fixtures.circle.name));
  expect(screen.getByText('My Circles'));
  expect(screen.getByText('GIVE'));
  expect(screen.getByText('Members'));
  expect(screen.getByText('Admin'));
  expect(screen.getByText('Overview'));
});

test('show circle links for org members under "other circles"', async () => {
  (useNavQuery as any).mockReturnValue({
    data: {
      organizations: [
        {
          id: fixtures.circle.organization_id,
          name: fixtures.organization.name,
          logo: fixtures.organization.logo,
          myCircles: [],
          otherCircles: [
            {
              id: fixtures.circle.id,
              name: fixtures.circle.name,
              logo: fixtures.circle.logo,
            },
          ],
          members: [],
        },
      ],
      profile: { name: 'tonka' },
      claims_aggregate: { aggregate: { count: 0 } },
    },
  });

  const Harness = () => {
    const navigate = useNavigate();

    useEffect(() => {
      navigate(`/circles/${fixtures.circle.id}/members`);
    }, []);

    return <SideNav />;
  };

  await act(async () => {
    await render(
      <TestWrapper withWeb3>
        <Harness />
      </TestWrapper>
    );
  });

  expect(screen.getByText('tonka'));
  expect(screen.getByText('Other Circles'));
  expect(screen.getByText(fixtures.organization.name));
  expect(screen.getByText(fixtures.circle.name));
  expect(screen.getByText('Members'));

  expect(screen.queryByText('Admin')).toBeFalsy();
  expect(screen.queryByText('GIVE')).toBeFalsy();
});
