/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useMemo } from 'react';

import { makeStyles } from '@material-ui/core';

import { OrganizationHeader } from 'components';
import { useCurrentOrg } from 'hooks/gqty';
import { useSelectedCircle } from 'recoilState/app';
import { useVaults } from 'recoilState/vaults';

// eslint-disable-next-line import/no-named-as-default
import CreateVaultModal from './CreateVaultModal';
import HasVaults from './HasVaults';
import NoVaults from './NoVaults';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(0, 8, 4),
    margin: 'auto',
    maxWidth: theme.breakpoints.values.lg,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 2, 4),
    },
  },
  title: {
    textTransform: 'capitalize',
    fontSize: 40,
    lineHeight: 1.2,
    fontWeight: 700,
    color: theme.colors.text,
    margin: theme.spacing(6, 0),
  },
}));

const VaultsPage = () => {
  const classes = useStyles();
  const [modal, setModal] = useState<'' | 'create'>('');
  const closeModal = () => setModal('');

  const {
    circleEpochsStatus: { epochs: epochsReverse },
  } = useSelectedCircle();

  const epochs = useMemo(() => fakeEpochData, [epochsReverse]);

  const currentOrg = useCurrentOrg();
  const vaults = useVaults(currentOrg.id);

  return (
    <div className={classes.root}>
      <OrganizationHeader
        buttonText="Create a Vault"
        onButtonClick={() => setModal('create')}
      />
      {vaults && vaults.length ? (

        vaults.map(vault => (
          <HasVaults key={vault.id} epochs={epochs} vault={vault} />
        ))
      ) : (
        <NoVaults onCreateButtonClick={() => setModal('create')} />
      )}
      {modal === 'create' ? <CreateVaultModal onClose={closeModal} /> : null}
    </div>
  );
};

export default VaultsPage;

const fakeEpochData = [
  {
    id: 1,
    number: 2,
    start_date: new Date('2021-10-07T00:55:35'),
    end_date: new Date('2021-10-21T20:57:00.000000Z'),
    circle_id: 1,
    created_at: new Date('2021-10-07T00:55:35.000000Z'),
    updated_at: new Date('2021-10-07T00:55:35.000000Z'),
    ended: false,
    notified_start: null,
    notified_before_end: null,
    notified_end: null,
    grant: 0.0,
    regift_days: 1,
    days: 4,
    repeat: 2,
    repeat_day_of_month: 7,
    repeatEnum: 'monthly',
    started: true,
    startDate: new Date('2021-10-07T00:55:35.000Z'),
    startDay: 'Thu',
    endDate: new Date('2021-10-21T20:57:00.000Z'),
    endDay: 'Thu',
    interval: {
      s: new Date('2021-10-07T00:55:35.000Z'),
      e: new Date('2021-10-21T20:57:00.000Z'),
    },
    invalid: null,
    isLuxonInterval: true,
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
  },
  {
    id: 1,
    number: 4,
    start_date: new Date('2021-10-07T00:55:35'),
    end_date: new Date('2021-10-30T20:57:00.000000Z'),
    circle_id: 1,
    created_at: new Date('2021-10-01T00:55:35.000000Z'),
    updated_at: new Date('2021-10-07T00:55:35.000000Z'),
    ended: false,
    notified_start: null,
    notified_before_end: null,
    notified_end: null,
    grant: 0.0,
    regift_days: 1,
    days: 4,
    repeat: 2,
    repeat_day_of_month: 7,
    repeatEnum: 'monthly',
    started: true,
    startDate: new Date('2021-10-01T00:55:35.000Z'),
    startDay: 'Thu',
    endDate: new Date('2021-10-30T20:57:00.000Z'),
    endDay: 'Thu',
    interval: {
      s: new Date('2021-10-01T00:55:35.000Z'),
      e: new Date('2021-10-30T20:57:00.000Z'),
    },
    invalid: null,
    isLuxonInterval: true,
    totalTokens: 70,
    uniqueUsers: 14,
    activeUsers: 0,
    calculatedDays: 20,
    labelGraph: 'This Epoch Oct 1 - 30',
    labelDayRange: 'Oct 1 to Oct 30',
    labelTimeStart: 'Started 12:55AM UTC',
    labelTimeEnd: 'Ends 12:55AM UTC',
    labelActivity: 'members have allocated',
    labelUntilStart: 'The Past',
    labelUntilEnd: '8 Days',
    labelYearEnd: '2021',
  },
  {
    id: 1,
    number: 5,
    start_date: new Date('2021-10-07T00:55:35'),
    end_date: new Date('2021-10-30T20:57:00.000000Z'),
    circle_id: 1,
    created_at: new Date('2021-10-01T00:55:35.000000Z'),
    updated_at: new Date('2021-10-07T00:55:35.000000Z'),
    ended: false,
    notified_start: null,
    notified_before_end: null,
    notified_end: null,
    grant: 0.0,
    regift_days: 1,
    days: 4,
    repeat: 2,
    repeat_day_of_month: 7,
    repeatEnum: 'monthly',
    started: true,
    startDate: new Date('2021-10-01T00:55:35.000Z'),
    startDay: 'Thu',
    endDate: new Date('2021-10-30T20:57:00.000Z'),
    endDay: 'Thu',
    interval: {
      s: new Date('2021-10-01T00:55:35.000Z'),
      e: new Date('2021-10-30T20:57:00.000Z'),
    },
    invalid: null,
    isLuxonInterval: true,
    totalTokens: 5000,
    uniqueUsers: 432,
    activeUsers: 0,
    calculatedDays: 20,
    labelGraph: 'This Epoch Oct 1 - 30',
    labelDayRange: 'Oct 1 to Oct 30',
    labelTimeStart: 'Started 12:55AM UTC',
    labelTimeEnd: 'Ends 12:55AM UTC',
    labelActivity: 'members have allocated',
    labelUntilStart: 'The Past',
    labelUntilEnd: '8 Days',
    labelYearEnd: '2021',
  },
];
