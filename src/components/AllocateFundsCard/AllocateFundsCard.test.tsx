import { render } from '@testing-library/react';
import { DateTime, Interval } from 'luxon';

import { Button } from '../../ui';

import { AllocateFundsCard, AllocateFundsCardProps } from './AllocateFundsCard';

import { IEpoch } from 'types';

export const epoch: IEpoch = {
  id: 1,
  number: 2,
  start_date: '2021-10-07T00:55:35',
  end_date: '2021-10-21T20:57:00.000000Z',
  circle_id: 1,
  created_at: '2021-10-07T00:55:35.000000Z',
  updated_at: '2021-10-07T00:55:35.000000Z',
  ended: false,
  grant: '0.0',
  regift_days: 1,
  days: 4,
  repeat: 2,
  repeat_day_of_month: 7,
  repeatEnum: 'monthly',
  started: true,
  startDate: DateTime.fromJSDate(new Date()),
  startDay: 'Thu',
  endDate: DateTime.fromJSDate(new Date()),
  endDay: 'Thu',
  interval: Interval.fromDateTimes(
    DateTime.fromJSDate(new Date()),
    DateTime.fromJSDate(new Date())
  ),
  totalTokens: 0,
  uniqueUsers: 0,
  activeUsers: 0,
  calculatedDays: 14.83431712962963,
  labelGraph: 'This Epoch Oct 1 - 21',
  labelDayRange: 'Oct 7 to Oct 21',
  labelTimeStart: 'Started 12:55AM UTC',
  labelTimeEnd: 'Ends 12:55AM UTC',
  labelActivity: 'members will allocate ',
  labelUntilStart: 'The Past',
  labelUntilEnd: '8 Days',
  labelYearEnd: '2021',
};

const props: AllocateFundsCardProps = {
  title: 'Allocate to',
  epoch,
  recurringLabel: 'monthly',
  fundsAvailable: 20000,
  onChange: () => null,
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
