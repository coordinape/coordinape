import React, { useState, useMemo } from 'react';

import { makeStyles, Button, IconButton } from '@material-ui/core';

import { StaticTable, NoticeBox, ApeAvatar } from 'components';
import { useAdminApi } from 'hooks';
import { DeleteIcon, EditIcon, PlusCircleIcon } from 'icons';
import {
  useSelectedCircle,
  useSelectedMyUser,
  useSelectedCircleUsers,
  useSelectedCircleEpochs,
} from 'recoilState';
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
  title: {
    textTransform: 'capitalize',
    fontSize: 40,
    lineHeight: 1.2,
    fontWeight: 700,
    color: theme.colors.text,
    margin: theme.spacing(6, 0),
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
  userActionBar: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 70,
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
    : `${e.calculatedDays} ${e.calculatedDays > 1 ? 'days' : 'day'}${
        e.repeat ? ` repeats ${r}` : ''
      }`;
};

const AdminPage = () => {
  const classes = useStyles();
  const [keyword, setKeyword] = useState<string>('');
  const [editUser, setEditUser] = useState<IUser | undefined>(undefined);
  const [newUser, setNewUser] = useState<boolean>(false);
  const [editEpoch, setEditEpoch] = useState<IEpoch | undefined>(undefined);
  const [newEpoch, setNewEpoch] = useState<boolean>(false);
  const [editCircle, setEditCircle] = useState<boolean>(false);

  const { deleteUser, deleteEpoch } = useAdminApi();
  const me = useSelectedMyUser();
  const selectedCircle = useSelectedCircle();
  const visibleUsers = useSelectedCircleUsers();
  const epochsReverse = useSelectedCircleEpochs();

  const epochs = useMemo(() => [...epochsReverse].reverse(), [epochsReverse]);

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

  const RenderUserName = (u: IUser) => (
    <div className={classes.avatarCell}>
      <ApeAvatar user={u} className={classes.avatar} />
      <span>{u.name}</span>
    </div>
  );

  const RenderUserActions = (u: IUser) =>
    renderActions(
      () => setEditUser(u),
      u.id !== me?.id ? () => deleteUser(u.address) : undefined
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

  const userColumns = useMemo(
    () =>
      [
        {
          label: 'Name',
          accessor: 'name',
          render: RenderUserName,
          wide: true,
          leftAlign: true,
        },
        {
          label: 'ETH Wallet',
          accessor: 'address',
          render: (u: IUser) => shortenAddress(u.address),
        },
        {
          label: 'Can they give?',
          render: (u: IUser) => (u.non_giver === 0 ? 'Yes' : 'No'),
        },
        {
          label: 'Force Opt Out?',
          render: (u: IUser) => (u.fixed_non_receiver === 0 ? 'No' : 'Yes'),
        },
        {
          label: 'Are they admin?',
          render: (u: IUser) => (u.role === 0 ? 'No' : 'Yes'),
        },
        {
          label: 'GIVE sent',
          render: (u: IUser) => u.starting_tokens - u.give_token_remaining,
        },
        {
          label: 'GIVE received',
          accessor: 'give_token_received',
        },
        {
          label: 'Actions',
          render: RenderUserActions,
          noSort: true,
        },
      ] as ITableColumn[],
    []
  );

  const epochColumns = useMemo(
    () =>
      [
        {
          label: 'Epoch Details',
          render: RenderEpochDetails,
          leftAlign: true,
        },
        {
          label: 'Status',
          render: RenderEpochStatus,
        },
        {
          label: 'Dates',
          render: RenderEpochDates,
          leftAlign: true,
        },
        {
          label: 'Actions',
          render: RenderEpochActions,
          narrow: true,
        },
      ] as ITableColumn[],
    []
  );

  return (
    <div className={classes.root}>
      <h2 className={classes.title}>
        {selectedCircle?.protocol?.name} {selectedCircle?.name} Circle
      </h2>
      <div className={classes.actionsAndEpochs}>
        <div className={classes.actionBar}>
          <div className={classes.actionBarInner}>
            <Button
              variant="contained"
              size="small"
              startIcon={<EditIcon />}
              onClick={() => setEditCircle(true)}
            >
              Edit Circle Settings
            </Button>
            {/* <Button
              variant="contained"
              color="secondary"
              size="small"
              startIcon={<UploadIcon />}
            >
              Import Member CSV
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              startIcon={<UploadIcon />}
            >
              Export Member CSV
            </Button> */}
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<PlusCircleIcon />}
              onClick={() => setNewUser(true)}
            >
              Add Contributor
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<PlusCircleIcon />}
              onClick={() => setNewEpoch(true)}
            >
              Add Epoch
            </Button>
          </div>
        </div>
        <StaticTable
          className={classes.epochsTable}
          columns={epochColumns}
          data={epochs}
          perPage={6}
        />
      </div>
      <div className={classes.userActionBar}>
        <input
          className={classes.searchInput}
          onChange={onChangeKeyword}
          placeholder="🔍 Search"
          value={keyword}
        />
      </div>
      <StaticTable
        columns={userColumns}
        data={visibleUsers}
        perPage={15}
        filter={filterUser}
        sortable
      />
      <AdminUserModal
        onClose={() => (newUser ? setNewUser(false) : setEditUser(undefined))}
        user={editUser}
        open={!!editUser || newUser}
      />
      <AdminEpochModal
        epochs={epochs}
        epoch={editEpoch}
        onClose={() =>
          newEpoch ? setNewEpoch(false) : setEditEpoch(undefined)
        }
        open={!!editEpoch || newEpoch}
      />
      {!!selectedCircle && (
        <AdminCircleModal
          circle={selectedCircle}
          onClose={() => setEditCircle(false)}
          visible={editCircle}
        />
      )}
    </div>
  );
};

export default AdminPage;
