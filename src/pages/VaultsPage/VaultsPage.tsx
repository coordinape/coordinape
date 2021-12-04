/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useMemo } from 'react';

import { useRecoilState, useRecoilValue } from 'recoil';

import { makeStyles, Button, IconButton } from '@material-ui/core';

import { OrganizationHeader } from 'components';
import { useApiAdminCircle } from 'hooks';
import { DeleteIcon } from 'icons';
import { useSelectedCircle, useMyProfile } from 'recoilState/app';

// eslint-disable-next-line import/no-named-as-default
import AllocateModal from './AllocateModal';
import EditModal from './EditModal';
import HasVaults from './HasVaults';
import NoVaults from './NoVaults';

import { IUser, IEpoch, ITableColumn } from 'types';
import { IVault } from 'types/contracts.vault';

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
  allocateBtn: {
    padding: '12px',
    height: 'calc(32px * 16) * 1rem',
    marginRight: '2.5em',
  },
  twoLineCell: {
    height: 60,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    fontSize: 11,
    lineHeight: 1.5,
  },
  oneLineCell: {
    height: 60,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 11,
    lineHeight: 1.5,
  },
  twoLineCellTitle: {
    fontWeight: 600,
  },
  oneLineCellTitle: {
    fontWeight: 600,
    fontSize: 17,
    marginLeft: '1em',
  },
  oneLineCellSubtitle: {
    fontWeight: 400,
    marginLeft: '0.5em',
  },
  twoLineCellSubtitle: {
    fontWeight: 400,
    fontSize: 9,
    color: theme.colors.mediumGray,
  },
  tableActions: {
    display: 'flex',
    justifyContent: 'center',
  },
  errorColor: {
    color: theme.palette.error.main,
  },
  valueBtn: {
    width: '110.3px',
    color: theme.colors.secondary,
    fontWeight: 600,
  },
  smallP: {
    fontSize: 12,
    marginLeft: '0.4em',
    padding: 0,
    margin: 0,
  },
  editTxt: {
    color: theme.colors.lightBlue,
    textDecoration: 'underline',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
  },
  editSpan: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-end',
  },
}));

const epochDetail = (e: IEpoch) => {
  const r =
    e.repeatEnum === 'none'
      ? ''
      : e.repeatEnum === 'weekly'
      ? `${e.startDay} - ${e.endDay}`
      : 'monthly';
  return e.ended
    ? e.labelActivity
    : `${Math.floor(e.calculatedDays)} ${e.calculatedDays > 1 ? 'days' : 'day'}
        ${e.repeat ? `, repeats ${r}` : ''}`;
};

const VaultsPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const classes = useStyles();
  const [keyword, setKeyword] = useState<string>('');
  const [editUser, setEditUser] = useState<IUser | undefined>(undefined);
  const [newUser, setNewUser] = useState<boolean>(false);
  const [, setEditEpoch] = useState<IEpoch | undefined>(undefined);
  const [, setNewEpoch] = useState<boolean>(false);
  const [, setEditCircle] = useState<boolean>(false);
  // const [hasVaults] = useState<boolean>(false); //Temp boolean pending data input
  const [editOpen, setEditOpen] = useState<boolean>(false);

  const {
    circleId,
    circleEpochsStatus: { epochs: epochsReverse },
  } = useSelectedCircle();
  const { deleteEpoch } = useApiAdminCircle(circleId);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleSetEdit = () => {
    setEditOpen(!editOpen);
  };

  // const transactions = useMemo(
  //   () => [
  //     {
  //       name: 'No Name McGee',
  //       dateType: 'Deposit made on',
  //       posNeg: '+',
  //       value: 25000,
  //       vaultName: '',
  //       number: 2,
  //       activeUsers: 15,
  //       date: '11/1',
  //     },
  //     {
  //       name: 'Bob Villa',
  //       dateType: 'Distributions triggered on',
  //       posNeg: '-',
  //       value: 14000,
  //       vaultName: 'Strategists',
  //       number: 4,
  //       activeUsers: 1,
  //       date: '11/3',
  //     },
  //   ],
  //   []
  // );

  const epochs = useMemo(
    () => [
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
    ],
    [epochsReverse]
  );

  // const epochs = useMemo(() => [...epochsReverse].reverse(), [epochsReverse]);

  const renderActions = (onEdit: () => void, onDelete?: () => void) => (
    <div className={classes.tableActions}>
      <span className={classes.editSpan}>
        <Button
          className={classes.allocateBtn}
          variant="contained"
          color="primary"
          size="small"
          onClick={handleClick}
        >
          Allocate Funds
        </Button>
      </span>
      {onDelete ? (
        <IconButton
          onClick={onDelete}
          className={classes.errorColor}
          size="small"
        >
          <DeleteIcon />
        </IconButton>
      ) : undefined}
    </div>
  );

  // User Columns
  const filterUser = useMemo(
    () => (u: IUser) => {
      const r = new RegExp(keyword);
      return r.test(u.name) || r.test(u.address);
    },
    [keyword]
  );
  //TODO: Need to make an interface for transaction data
  const RenderTransactionDetails = (e: any) => {
    return e.posNeg === '-' ? (
      <div className={classes.twoLineCell}>
        <span
          className={classes.twoLineCellTitle}
          style={{ textAlign: 'left' }}
        >
          {e.vaultName}: {e.number} distibuted to {e.activeUsers} participants
        </span>
        <span
          className={classes.twoLineCellSubtitle}
          style={{ textAlign: 'left' }}
        >
          {e.dateType} {e.date}. See TX on Etherscan
        </span>
      </div>
    ) : (
      <div className={classes.twoLineCell}>
        <span
          className={classes.twoLineCellTitle}
          style={{ textAlign: 'left' }}
        >
          {e.name} made a deposit
        </span>
        <span
          className={classes.twoLineCellSubtitle}
          style={{ textAlign: 'left' }}
        >
          {e.dateType} {e.date} See TX on Etherscan
        </span>
      </div>
    );
  };

  const RenderTransactionAmount = (e: any) => (
    <div className={classes.oneLineCell}>
      <p className={classes.oneLineCellTitle}>
        {' '}
        {e.posNeg}
        {e.value}
      </p>
      <p className={classes.oneLineCellSubtitle}>usdc</p>
    </div>
  );

  // Epoch Columns
  const RenderEpochDetails = (e: IEpoch) => (
    <div className={classes.twoLineCell}>
      <span className={classes.twoLineCellTitle}>
        {e.circle_id}(CID): E{e.number}
      </span>
    </div>
  );

  const RenderEpochDates = (e: IEpoch) => (
    <div className={classes.twoLineCell}>
      <span className={classes.twoLineCellTitle}>
        {e.uniqueUsers} {e.labelActivity} {e.totalTokens} GIVE
      </span>
      <span className={classes.twoLineCellSubtitle}>
        {e.ended
          ? `Epoch ended ${e.endDate.month} ${e.endDate.day}`
          : `Epoch starts ${e.startDate.monthLong} and ends ${e.endDate.day}`}
      </span>
    </div>
  );

  const RenderRecentEpochActions = (e: IEpoch) =>
    e.ended ? (
      <>
        <Button variant="contained" color="primary" size="small">
          Allocate Funds
        </Button>
      </>
    ) : e.totalTokens > 0 ? (
      <span className={classes.editSpan}>
        <Button variant="contained" className={classes.valueBtn} size="small">
          {e.totalTokens} <p className={classes.smallP}>usdc</p>
        </Button>
        <button className={classes.editTxt} onClick={handleSetEdit}>
          Edit
        </button>
      </span>
    ) : (
      renderActions(
        () => setEditEpoch(e),
        !e.started ? () => deleteEpoch(e.id) : undefined
      )
    );

  const epochColumns = useMemo(
    () =>
      [
        {
          label: 'Circle:Epoch',
          render: RenderEpochDetails,
          leftAlign: true,
          narrow: true,
        },
        {
          label: 'Details',
          render: RenderEpochDates,
          leftAlign: true,
        },
        {
          label: 'Allowances',
          render: RenderRecentEpochActions,
          narrow: true,
        },
      ] as ITableColumn[],
    []
  );

  const transactionColumns = useMemo(
    () =>
      [
        {
          label: 'Details',
          render: RenderTransactionDetails,
          wide: true,
        },
        {
          label: 'Amount',
          render: RenderTransactionAmount,
          wide: true,
        },
      ] as ITableColumn[],
    []
  );

  return (
    <div className={classes.root}>
      <OrganizationHeader />
      {/* {vaults && selectedCircle && vaults[selectedCircle.id] ? (
        vaults[selectedCircle.id].map((vault: IVault) => ( */}
      {/* <HasVaults
            key={vault.id}
            newUser={newUser}
            setNewUser={setNewUser}
            editUser={editUser}
            setEditUser={setEditUser}
            setNewEpoch={setNewEpoch}
            epochColumns={epochColumns}
            epochs={epochs}
            vault={vault}
            transactionColumns={transactionColumns}
          /> */}
      {/* ))
      ) : (
        <NoVaults />
      )} */}
      <AllocateModal open={open} onClose={setOpen} />
      <EditModal open={editOpen} onClose={setEditOpen} />
    </div>
  );
};

export default VaultsPage;
