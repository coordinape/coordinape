import { act, render, screen } from '@testing-library/react';

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

  // this is only a superficial test; the underlying Popper component doesn't
  // play well with JSDOM
  await screen.findByText('Overview');
});
