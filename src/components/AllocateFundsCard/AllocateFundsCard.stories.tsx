import { ComponentStory, ComponentMeta } from '@storybook/react';
import { DateTime, Interval } from 'luxon';
import { withDesign } from 'storybook-addon-designs';

import { Box, Button } from '../../ui';

import { AllocateFundsCard } from './AllocateFundsCard';

import { IEpoch } from 'types';

export default {
  title: 'Design System/Molecules/AllocateFundsCard',
  component: AllocateFundsCard,
  decorators: [withDesign],
} as ComponentMeta<typeof AllocateFundsCard>;

const epoch: IEpoch = {
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
  startDate: new DateTime(),
  startDay: 'Thu',
  endDate: new DateTime(),
  endDay: 'Thu',
  interval: new Interval(),
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

const Template: ComponentStory<typeof AllocateFundsCard> = args => {
  return (
    <Box
      css={{
        display: 'grid',
        placeItems: 'center',
        padding: '$md',
        backgroundColor: '$gray',
      }}
    >
      <AllocateFundsCard {...args}>{args.children}</AllocateFundsCard>
    </Box>
  );
};

export const SingleAllocateFundsCard = Template.bind({});

SingleAllocateFundsCard.args = {
  title: 'Allocate to',
  epoch,
  children: (
    <Button data-testid="fund-this-epoch" size="small" color="red">
      Commit Budget
    </Button>
  ),
};

export const EditAllocateFundsCard = Template.bind({});

EditAllocateFundsCard.args = {
  title: 'Edit Allowances for',
  epoch,
  children: (
    <>
      <Button data-testid="fund-this-epoch" size="small" color="gray">
        Remove Allowance
      </Button>
      <Button data-testid="fund-this-epoch" size="small" color="red">
        Edit Allowance
      </Button>
    </>
  ),
};

SingleAllocateFundsCard.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/wXF7xGVv1j2SqwWfgbamS8/App-1.0?node-id=2136%3A23884',
  },
};
