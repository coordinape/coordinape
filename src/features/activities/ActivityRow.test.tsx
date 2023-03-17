import { act, fireEvent, render, screen } from '@testing-library/react';

import { TestWrapper } from 'utils/testing';

import { ActivityRow } from './ActivityRow';
import { Activity } from './useInfiniteActivities';

test('shows unknown activity if data is missing', async () => {
  const activity: Activity = {
    reactions: [],
    id: 129,
    action: 'created',
    created_at: new Date('2022-03-15T09:30:00'),
  };

  const Harness = () => {
    return <ActivityRow activity={activity} />;
  };

  await act(async () => {
    await render(
      <TestWrapper withWeb3>
        <Harness />
      </TestWrapper>
    );
  });

  expect(screen.getByText(/Unknown activity:/));
});

test('shows epoch activity row', async () => {
  const activity: Activity = {
    id: 114723,
    action: 'epochs_insert',
    created_at: new Date().toISOString(),
    circle: {
      id: 242,
      name: 'Tools',
    },
    epoch: {
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      number: 1,
      ended: false,
    },
    reactions: [],
  };

  const Harness = () => {
    return <ActivityRow activity={activity} />;
  };

  await act(async () => {
    await render(
      <TestWrapper withWeb3>
        <Harness />
      </TestWrapper>
    );
  });

  expect(screen.getByText('Epoch Created'));
  expect(screen.getByText('Tools'));
  expect(screen.getByText(/Starts/));
});

test('shows new user activity row', async () => {
  const activity: Activity = {
    id: 114801,
    action: 'users_insert',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    circle: {
      id: 242,
      name: 'Tools',
    },
    target_profile: {
      name: 'Leon',
      avatar: '🦒',
      address: '0x14dc79964da2c08b23698b3d3cc7ca32193d9955',
    },
    reactions: [],
  };

  const Harness = () => {
    return <ActivityRow activity={activity} />;
  };

  await act(async () => {
    await render(
      <TestWrapper withWeb3>
        <Harness />
      </TestWrapper>
    );
  });

  expect(screen.getByText('Leon'));
  expect(screen.getByText('joined'));
  expect(screen.getByText('Tools'));
  expect(screen.getByText(/days ago/));
});

test('shows contribution activity row', async () => {
  const activity: Activity = {
    id: 114715,
    action: 'contributions_insert',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    actor_profile: {
      name: 'Francine',
      avatar: 'https://coordinape-prod.s3.amazonaws.com/sdao-francine.jpg',
      address: '0xff0ca13819312375171fecd98460e5fb71c7ff6f',
    },
    circle: {
      id: 251,
      name: 'Tools',
      logo: 'b90806b4-d724-40c4-b9c1-aa89225844a8.jpg',
    },
    contribution: {
      description: '*Building the integrations page*',
    },
    reactions: [],
  };

  const Harness = () => {
    return <ActivityRow activity={activity} />;
  };

  await act(async () => {
    await render(
      <TestWrapper withWeb3>
        <Harness />
      </TestWrapper>
    );
  });

  expect(screen.getByText('Francine'));
  expect(screen.getByText(/days ago/));
  // TODO: test the markdown preview
  // this approach fails
  // await waitFor(() => {
  //   expect(screen.getByText(/Building/));
  // });
});

describe('reactions', () => {
  const activity: Activity = {
    id: 114715,
    action: 'contributions_insert',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    actor_profile: {
      name: 'Francine',
      avatar: 'https://coordinape-prod.s3.amazonaws.com/sdao-francine.jpg',
      address: '0xff0ca13819312375171fecd98460e5fb71c7ff6f',
    },
    circle: {
      id: 251,
      name: 'Tools',
      logo: 'b90806b4-d724-40c4-b9c1-aa89225844a8.jpg',
    },
    contribution: {
      description: '*Building the integrations page*',
    },
    reactions: [
      {
        id: 132,
        reaction: '👀',
        profile: {
          name: 'Whoo',
          id: 5283,
        },
      },
      {
        id: 134,
        reaction: '👀',
        profile: {
          name: 'Meee',
          id: 5282,
        },
      },
      {
        id: 136,
        reaction: '💀',
        profile: {
          name: 'Meee',
          id: 5282,
        },
      },
    ],
  };

  test('renders existing reactions', async () => {
    const Harness = () => {
      return <ActivityRow activity={activity} />;
    };

    await act(async () => {
      await render(
        <TestWrapper withWeb3>
          <Harness />
        </TestWrapper>
      );
    });

    expect(screen.getByText('👀 2'));
    expect(screen.getByText('💀 1'));
  });

  test('can be added via click', async () => {
    const Harness = () => {
      return <ActivityRow activity={activity} />;
    };

    await act(async () => {
      await render(
        <TestWrapper withWeb3>
          <Harness />
        </TestWrapper>
      );
    });

    expect(screen.getByText('👀 2'));
    expect(screen.getByText('💀 1'));

    const reactButton = screen.getByLabelText('react');
    fireEvent.click(reactButton);
    expect(screen.queryAllByText('🧠').length).toBeGreaterThan(1);
  });
});
