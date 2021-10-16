import React, { useState, useMemo } from 'react';

import { useHistory, NavLink } from 'react-router-dom';

import { makeStyles, Button, IconButton, Avatar, Box } from '@material-ui/core';

import { ReactComponent as ArrowDown } from 'assets/svgs/button/arrow_down.svg';
import { StaticTableNew, NoticeBox, ApeAvatar, DialogNotice } from 'components';
import { useAdminApi, useProfile, useMe, useCircle } from 'hooks';
import { DeleteIcon, EditIcon, PlusCircleIcon, DownArrow } from 'icons';
import {
  useSelectedCircle,
  useSelectedMyUser,
  useSelectedCircleUsers,
  useSelectedCircleEpochs,
} from 'recoilState';
import {
  NEW_CIRCLE_CREATED_PARAMS,
  getAdminNavigation,
  checkActive,
} from 'routes/paths';
import * as paths from 'routes/paths';
import { shortenAddress } from 'utils';
import { getCSVPath } from 'utils/domain';

import AdminCircleModal from './AdminCircleModal';
import AdminEpochModal from './AdminEpochModal';
import AdminUserModal from './AdminUserModal';

import { IUser, IEpoch, ITableColumn } from 'types';

const useStyles = makeStyles((theme) => ({
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
  topMenu: {
    height: 120,
    display: 'grid',
    alignItems: 'center',
    gridTemplateColumns: '1fr 1fr',
    padding: theme.spacing(0, 4),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0, 2),
      gridTemplateColumns: '1fr 1fr',
    },
    '& > *': {
      alignSelf: 'center',
    },
    '& .MuiSkeleton-root': {
      marginLeft: theme.spacing(1.5),
    },
    '& .MuiSkeleton-rect': {
      borderRadius: 5,
    },
  },
  noVaults: {
    height: 434,
    display: 'grid',
    borderRadius: 8,
    background: theme.colors.ultraLightGray,
    alignItems: 'center',
    gridTemplateColumns: '1fr',
    padding: theme.spacing(0, 4),
    margin: theme.spacing(4, 0),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0, 2),
      gridTemplateColumns: '1fr',
    },
    '& > *': {
      alignSelf: 'center',
    },
    '& .MuiSkeleton-root': {
      marginLeft: theme.spacing(1.5),
    },
    '& .MuiSkeleton-rect': {
      borderRadius: 5,
    },
  },
  withVaults: {
    height: 434,
    display: 'grid',
    borderRadius: 8,
    background: theme.colors.ultraLightGray,
    alignItems: 'center',
    columnGap: theme.spacing(3),
    gridTemplateColumns: '1fr 1fr',
    padding: theme.spacing(0, 4),
    margin: theme.spacing(4, 0),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0, 2),
      gridTemplateColumns: '1fr',
    },
    '& > *': {
      alignSelf: 'center',
    },
    '& .MuiSkeleton-root': {
      marginLeft: theme.spacing(1.5),
    },
    '& .MuiSkeleton-rect': {
      borderRadius: 5,
    },
  },
  noVaultsInterior: {
    height: 288,
    display: 'flex',
    borderRadius: 8,
    background: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gridTemplateColumns: '1fr',
    padding: theme.spacing(0, 1),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0, 2),
      gridTemplateColumns: '1fr',
    },
    '& > *': {
      alignSelf: 'center',
    },
    '& .MuiSkeleton-root': {
      marginLeft: theme.spacing(1.5),
    },
    '& .MuiSkeleton-rect': {
      borderRadius: 5,
    },
  },
  noVaultsTitle: {
    color: theme.colors.mediumGray,
    margin: 0,
    fontSize: 24,
    fontWeight: 600,
  },
  noVaultsSubtitle: {
    color: theme.colors.mediumGray,
    fontSize: 15,
    fontWeight: 300,
  },
  organizationLinks: {
    justifySelf: 'stretch',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  organizationLink: {
    margin: theme.spacing(0, 2),
    fontSize: 20,
    fontWeight: 700,
    color: theme.colors.white,
    textDecoration: 'none',
    padding: '6px 0',
    position: 'relative',
    '&::after': {
      content: `" "`,
      position: 'absolute',
      left: '50%',
      right: '50%',
      backgroundColor: theme.colors.mediumRed,
      transition: 'all 0.3s',
      bottom: 0,
      height: 2,
    },
    '&:hover': {
      '&::after': {
        left: 0,
        right: 0,
        backgroundColor: theme.colors.mediumRed,
      },
    },
    '&.active': {
      '&::after': {
        left: 0,
        right: 0,
        backgroundColor: theme.colors.red,
      },
      '&:hover': {
        '&::after': {
          left: 0,
          right: 0,
          backgroundColor: theme.colors.red,
        },
      },
    },
  },
  navLinks: {
    justifySelf: 'stretch',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttons: {
    justifySelf: 'end',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  navLink: {
    margin: theme.spacing(0, 2),
    fontSize: 20,
    fontWeight: 400,
    color: theme.colors.mediumGray,
    textDecoration: 'none',
    padding: theme.spacing(1, 2),
    position: 'relative',
    '&:hover': {
      backgroundColor: theme.colors.ultraLightGray,
      padding: theme.spacing(1, 2),
      borderRadius: '16px',
      color: theme.colors.text,
      '&::after': {
        left: 0,
        right: 0,
        backgroundColor: theme.colors.ultraLightGray,
      },
    },
    '&:active': {
      '&::after': {
        left: 0,
        right: 0,
        backgroundColor: theme.colors.ultraLightGray,
      },
    },
  },
  title: {
    textTransform: 'capitalize',
    fontSize: 40,
    lineHeight: 1.2,
    fontWeight: 700,
    color: '#000000',
    margin: theme.spacing(6, 0),
  },
  iconGroup: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 54,
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  actionsAndEpochs: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  actionBar: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'flex-start',
    margin: theme.spacing(0, 5, 4),
  },
  actionBarInner: {
    display: 'flex',
    flexDirection: 'column',
    width: '200px',
    '& > *': {
      marginBottom: theme.spacing(2),
    },
  },
  epochsTable: {
    flexGrow: 4,
    marginBottom: theme.spacing(8),
  },
  newTable: {
    flexGrow: 4,
    height: 288,
  },
  userActionBar: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 70,
  },
  moreButton: {
    margin: 0,
    padding: theme.spacing(0, 1),
    minWidth: 20,
    fontSize: 17,
    fontWeight: 800,
    color: theme.colors.text,
  },
  searchInput: {
    margin: theme.spacing(0, 1),
    padding: theme.spacing(1),
    fontSize: 14,
    fontWeight: 500,
    textAlign: 'center',
    color: theme.colors.text,
    background: '#fff',
    border: 'none',
    borderRadius: 8,
    outline: 'none',
    '&::placeholder': {
      color: theme.colors.text,
    },
  },
  twoLineCell: {
    height: 48,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    fontSize: 11,
    lineHeight: 1.5,
  },
  twoLineCellTitle: {
    fontWeight: 600,
  },
  twoLineCellSubtitle: {
    fontWeight: 400,
  },
  avatar: {
    width: 32,
    height: 32,
    marginRight: theme.spacing(1),
  },
  avatarCell: {
    height: 48,
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
    lineHeight: 1.5,
    fontWeight: 600,
  },
  tableActions: {
    display: 'flex',
    justifyContent: 'center',
  },
  errorColor: {
    color: theme.palette.error.main,
  },
  csvLink: {
    color: '#84C7CA',
    '&:hover': {
      color: '#4e7577',
    },
  },
  tablePlaceholderTitle: {
    fontSize: 20,
    lineHeight: 1.2,
    color: theme.colors.text,
    opacity: 0.7,
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

const AdminPage1 = () => {
  const classes = useStyles();
  const [keyword, setKeyword] = useState<string>('');
  const [editUser, setEditUser] = useState<IUser | undefined>(undefined);
  const [newUser, setNewUser] = useState<boolean>(false);
  const [editEpoch, setEditEpoch] = useState<IEpoch | undefined>(undefined);
  const [newEpoch, setNewEpoch] = useState<boolean>(false);
  const [editCircle, setEditCircle] = useState<boolean>(false);
  const [newCircle, setNewCircle] = useState<boolean>(
    window.location.search === NEW_CIRCLE_CREATED_PARAMS
  );

  const history = useHistory();

  const { deleteUser, deleteEpoch } = useAdminApi();
  const me = useSelectedMyUser();
  const selectedCircle = useSelectedCircle();
  const visibleUsers = useSelectedCircleUsers();
  const epochsReverse = useSelectedCircleEpochs();

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
        labelActivity: '',
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
        totalTokens: 0,
        uniqueUsers: 0,
        activeUsers: 0,
        calculatedDays: 20,
        labelGraph: 'This Epoch Oct 1 - 30',
        labelDayRange: 'Oct 1 to Oct 30',
        labelTimeStart: 'Started 12:55AM UTC',
        labelTimeEnd: 'Ends 12:55AM UTC',
        labelActivity: '',
        labelUntilStart: 'The Past',
        labelUntilEnd: '8 Days',
        labelYearEnd: '2021',
      },
    ],
    [epochsReverse]
  );

  // const epochs = useMemo(() => [...epochsReverse].reverse(), [epochsReverse]);

  const onChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  const renderActions = (onEdit: () => void, onDelete?: () => void) => (
    <div className={classes.tableActions}>
      {onEdit ? (
        <IconButton onClick={onEdit} size="small">
          <EditIcon />
        </IconButton>
      ) : undefined}

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

  // Epoch Columns
  const RenderEpochDetails = (e: IEpoch) => (
    <div className={classes.twoLineCell}>
      <span className={classes.twoLineCellTitle}>Epoch {e.number}</span>
      <span className={classes.twoLineCellSubtitle}>{epochDetail(e)}</span>
    </div>
  );
  const RenderEpochStatus = (e: IEpoch) =>
    e.ended ? (
      <NoticeBox variant="error">Complete</NoticeBox>
    ) : e.started ? (
      <NoticeBox variant="success">Current</NoticeBox>
    ) : (
      <NoticeBox variant="warning">Upcoming</NoticeBox>
    );
  const RenderEpochDates = (e: IEpoch) => (
    <div className={classes.twoLineCell}>
      <span className={classes.twoLineCellTitle}>
        {e.labelYearEnd} - {e.labelDayRange}
      </span>
      <span className={classes.twoLineCellSubtitle}>
        {e.ended ? e.labelTimeEnd : e.labelTimeStart}
      </span>
    </div>
  );
  const RenderEpochActions = (e: IEpoch) =>
    e.ended ? (
      <a
        className={classes.csvLink}
        href={getCSVPath(e.circle_id, e.id)}
        rel="noreferrer"
        download={`${selectedCircle?.protocol}-${selectedCircle?.name}-epoch-${e?.number}.csv`}
      >
        Export CSV
      </a>
    ) : (
      renderActions(
        () => setEditEpoch(e),
        !e.started ? () => deleteEpoch(e.id) : undefined
      )
    );

  const RenderRecentEpochActions = (e: IEpoch) =>
    e.ended ? (
      <Button variant="contained" color="primary" size="small">
        Allocate Funds
      </Button>
    ) : (
      renderActions(
        () => setEditEpoch(e),
        !e.started ? () => deleteEpoch(e.id) : undefined
      )
    );

  const userColumns = useMemo(
    () =>
      [
        {
          label: 'Name',
          accessor: 'name',
          render: function UserName(u: IUser) {
            return (
              <div className={classes.avatarCell}>
                <ApeAvatar user={u} className={classes.avatar} />
                <span>{u.name}</span>
              </div>
            );
          },
          wide: true,
          leftAlign: true,
        },
        {
          label: 'ETH Wallet',
          accessor: 'address',
          render: (u: IUser) => shortenAddress(u.address),
        },
        {
          label: 'Non Giver?',
          render: (u: IUser) => (!u.non_giver ? '-' : 'Non Giver'),
        },
        {
          label: 'Opted Out?',
          render: (u: IUser) =>
            u.fixed_non_receiver
              ? 'Forced Opt Out'
              : u.non_receiver
              ? 'Opted Out'
              : '-',
        },
        {
          label: 'Are they admin?',
          render: (u: IUser) => (u.role === 0 ? '-' : 'Admin'),
        },
        {
          label: 'GIVE sent',
          accessor: 'give_token_remaining',
          render: (u: IUser) =>
            !u.non_giver || u.starting_tokens - u.give_token_remaining != 0
              ? `${u.starting_tokens - u.give_token_remaining}/${
                  u.starting_tokens
                }`
              : '-',
        },
        {
          label: 'GIVE received',
          accessor: 'give_token_received',
          render: (u: IUser) =>
            u.give_token_received === 0 &&
            (!!u.fixed_non_receiver || !!u.non_receiver)
              ? '-'
              : u.give_token_received,
        },
        {
          label: 'Actions',
          render: (u: IUser) =>
            renderActions(
              () => setEditUser(u),
              u.id !== me?.id ? () => deleteUser(u.address) : undefined
            ),
          noSort: true,
        },
      ] as ITableColumn[],
    []
  );

  const epochColumns = useMemo(
    () =>
      [
        {
          label: 'Circle:Epoch',
          render: RenderEpochDetails,
          leftAlign: true,
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
  const { selectedMyUser, hasAdminView } = useMe();
  const navButtonsVisible = !!selectedMyUser || hasAdminView;
  const navItems = getAdminNavigation({
    asCircleAdmin: selectedMyUser && selectedMyUser.role !== 0,
    asVouchingEnabled: selectedCircle && selectedCircle.vouching !== 0,
  });
  return (
    <div className={classes.root}>
      <div className={classes.topMenu}>
        <div className={classes.organizationLinks}>
          <Avatar
            alt="organization"
            src="/imgs/avatar/placeholder.jpg"
            style={{
              width: 46,
              height: 46,
              borderRadius: '50%',
              border: '1px solid rgba(94, 111, 116, 0.7)',
              marginRight: '16px',
            }}
          />
          <h2 className={classes.title}>Yearn Finance</h2>
          <Button
            aria-describedby="1"
            className={classes.moreButton}
            onClick={() => setEditCircle(true)}
          >
            <DownArrow />
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => setNewUser(true)}
            style={{
              marginLeft: '27px',
            }}
          >
            Create a Vault
          </Button>
        </div>
        <div className={classes.navLinks}>
          {navButtonsVisible &&
            navItems.map((navItem) => (
              <NavLink
                className={classes.navLink}
                isActive={(nothing, location) =>
                  checkActive(location.pathname, navItem)
                }
                key={navItem.path}
                to={navItem.path}
              >
                {navItem.label}
              </NavLink>
            ))}
        </div>
      </div>
      <div className={classes.noVaults}>
        <div className={classes.noVaultsInterior}>
          <h2 className={classes.noVaultsTitle}>You dont have any vaults</h2>
          <h3 className={classes.noVaultsSubtitle}>To get started</h3>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => setNewUser(true)}
          >
            Create a Vault
          </Button>
          <AdminUserModal
            onClose={() =>
              newUser ? setNewUser(false) : setEditUser(undefined)
            }
            user={editUser}
            open={!!editUser || newUser}
          />
        </div>
      </div>
      <div className={classes.withVaults}>
        <StaticTableNew
          label="Testing"
          className={classes.newTable}
          columns={epochColumns}
          data={epochs}
          perPage={6}
          placeholder={
            <>
              <h2 className={classes.tablePlaceholderTitle}>
                You don’t have any recent epochs
              </h2>
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<PlusCircleIcon />}
                onClick={() => setNewEpoch(true)}
              >
                Add Epoch
              </Button>
            </>
          }
        />
        <div className={classes.noVaultsInterior}>
          <h2 className={classes.noVaultsTitle}>There are no transactions</h2>
          <h3 className={classes.noVaultsSubtitle}>To get started</h3>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => setNewUser(true)}
          >
            Fund This Vault
          </Button>
          <AdminUserModal
            onClose={() =>
              newUser ? setNewUser(false) : setEditUser(undefined)
            }
            user={editUser}
            open={!!editUser || newUser}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPage1;
