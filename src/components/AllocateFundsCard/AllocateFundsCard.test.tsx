import { render } from '@testing-library/react';

import { Button } from '../../ui';

import { AllocateFundsCard, AllocateFundsCardProps } from './AllocateFundsCard';

const props: AllocateFundsCardProps = {
  title: 'Allocate to',
  epoch: 'Yearn Community: E22',
  period: 'Aug 15 to Aug 31',
  recurringLabel: 'monthly',
  fundsAvailable: 20000,
  onFundValue: () => null,
  fundValue: 1,
  children: (
    <Button data-testid="fund-this-epoch" size="small" color="red">
      Fund This Epoch
    </Button>
  ),
};
describe('AllocateFundsCard', () => {
  it('should render properly', () => {
    const { getByTestId } = render(<AllocateFundsCard {...props} />);
    const actionButton = getByTestId('fund-this-epoch');
    expect(getByTestId('fund-this-epoch')).toBeInTheDocument();

    expect(actionButton.textContent).toEqual('Fund This Epoch');
  });
});
