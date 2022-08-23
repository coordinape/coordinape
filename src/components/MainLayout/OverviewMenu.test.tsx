import { act, fireEvent, render, screen } from '@testing-library/react';

import { TestWrapper } from 'utils/testing';

import { OverviewMenu } from './OverviewMenu';

test('basic rendering', async () => {
  const data = {
    organizations: [
      {
        id: 1,
        name: 'Foo',
        circles: [
          { id: 1, name: 'Circle A', users: [{ role: 1 }] },
          { id: 2, name: 'Circle B', users: [{ role: 0 }] },
        ],
      },
    ],
    claims_aggregate: {},
  };

  await act(async () => {
    await render(
      <TestWrapper>
        <OverviewMenu data={data} />
      </TestWrapper>
    );
  });

  const button = await screen.findByText('Overview');
  fireEvent.mouseOver(button);
  screen.getByText('Foo');
  screen.getByText('Circle A');
  screen.getByText('Circle B');
});
