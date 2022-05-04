import React, { useState, useMemo } from 'react';

import { useNavigate, Link } from 'react-router-dom';
import { styled } from 'stitches.config';

import { makeStyles, Button, IconButton, Typography } from '@material-ui/core';

import {
  StaticTable,
  NoticeBox,
  ApeAvatar,
  ActionDialog,
  ApeInfoTooltip,
} from 'components';
import { USER_ROLE_ADMIN, USER_ROLE_COORDINAPE } from 'config/constants';
import { isFeatureEnabled } from 'config/features';
import { useNavigation, useApiAdminCircle } from 'hooks';
import { DeleteIcon, EditIcon, PlusCircleIcon } from 'icons';
import { useSelectedCircle } from 'recoilState/app';
import { NEW_CIRCLE_CREATED_PARAMS, paths } from 'routes/paths';
import { Box } from 'ui';
import { shortenAddress } from 'utils';

import { AdminCircleModal } from './AdminCircleModal';
import { AdminEpochModal } from './AdminEpochModal';
import { AdminUserModal } from './AdminUserModal';

import { IUser, ITableColumn, IEpoch } from 'types';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(0, 0, 4),
    margin: 'auto',
    maxWidth: theme.breakpoints.values.lg,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 2, 4),
    },
  },
  withVaults: {
    minHeight: 668,
    display: 'grid',
    gridTemplateColumns: '1fr',
    alignContent: 'space-between',
    justifyItems: 'stretch',
    borderRadius: 8,
    background: theme.colors.ultraLightGray,
    alignItems: 'center',
    columnGap: theme.spacing(3),
    padding: theme.spacing(0, 4, 4),
    margin: theme.spacing(4, 4),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(0, 2),
      gridTemplateColumns: '1fr',
    },
    '& > *': {
      alignSelf: 'start',
    },
    '& .MuiSkeleton-root': {
      marginLeft: theme.spacing(1.5),
    },
    '& .MuiSkeleton-rect': {
      borderRadius: 5,
    },
  },
  title: {
    textTransform: 'capitalize',
    fontSize: 30,
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
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  actionBarInner: {
    display: 'flex',
    flexDirection: 'row',
    '& > *': {
      marginLeft: theme.spacing(1.5),
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
    [theme.breakpoints.down('xs')]: {
      height: 'auto',
    },
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
    border: `1px solid ${theme.colors.border}`,
    cursor: 'pointer',
    transition: 'border-color .3s ease',
    '&:hover': {
      border: '1px solid rgba(239, 115, 118, 1)',
    },
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
  actionSpacer: {
    width: 30,
  },
  errorColor: {
    color: theme.palette.error.main,
  },
  tablePlaceholderTitle: {
    fontSize: 20,
    lineHeight: 1.2,
    color: theme.colors.text,
    opacity: 0.7,
  },
  infoIcon: {
    fontSize: '0.95rem',
    fontWeight: 300,
    verticalAlign: 'baseline',
    // marginLeft: 3,
    color: theme.colors.white,
    '&:hover': {
      color: theme.colors.text,
    },
  },
  tooltipWrapper: {
    marginTop: '6px',
  },
  tooltipTitle: {
    fontSize: '18px',
  },
  tooltipBodyText: {
    fontSize: '14px',
  },
  tooltip: {
    padding: theme.spacing(4),
    maxWidth: 296,
  },
}));

const TableLink = styled(Link, {
  color: '$lightBlue',
  '&:hover': {
    color: '$darkBlue',
  },
  textDecoration: 'none',
});

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

const englishCollator = new Intl.Collator('en-u-kf-upper');

const AdminPage = () => {
  const classes = useStyles();
  const [keyword, setKeyword] = useState<string>('');
  const [editUser, setEditUser] = useState<IUser | undefined>(undefined);
  const [deleteUserDialog, setDeleteUserDialog] = useState<IUser | undefined>(
    undefined
  );
  const [newUser, setNewUser] = useState<boolean>(false);
  const [editEpoch, setEditEpoch] = useState<IEpoch | undefined>(undefined);
  const [deleteEpochDialog, setDeleteEpochDialog] = useState<
    IEpoch | undefined
  >(undefined);
  const [newEpoch, setNewEpoch] = useState<boolean>(false);
  const [editCircle, setEditCircle] = useState<boolean>(false);
  const [newCircle, setNewCircle] = useState<boolean>(
    window.location.search === NEW_CIRCLE_CREATED_PARAMS
  );

  const navigate = useNavigate();
  const { getToProfile } = useNavigation();

  const {
    circleId,
    myUser: me,
    users: visibleUsers,
    circle: selectedCircle,
    circleEpochsStatus: { epochs: epochsReverse },
  } = useSelectedCircle();

  const { downloadCSV } = useApiAdminCircle(circleId);

  const { deleteUser, deleteEpoch } = useApiAdminCircle(circleId);

  const epochs = useMemo(() => [...epochsReverse].reverse(), [epochsReverse]);

  const onChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  const renderActions = (onEdit?: () => void, onDelete?: () => void) => (
    <div className={classes.tableActions}>
      {onEdit ? (
        <IconButton onClick={onEdit} size="small">
          <EditIcon />
        </IconButton>
      ) : (
        <div className={classes.actionSpacer} />
      )}

      {onDelete ? (
        <IconButton
          onClick={onDelete}
          className={classes.errorColor}
          size="small"
        >
          <DeleteIcon />
        </IconButton>
      ) : (
        <div className={classes.actionSpacer} />
      )}
    </div>
  );

  // User Columns
  const filterUser = useMemo(
    () => (u: IUser) => {
      const r = new RegExp(keyword, 'i');
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
  const RenderEpochActions = (e: IEpoch) => {
    if (e.ended) {
      // this epoch is over, so there are no edit/delete actions, only download CSV
      // assert that e.number is non-null
      if (e.number) {
        return (
          <Box css={{ display: 'flex', flexDirection: 'column' }}>
            {downloadCSVButton(e.number)}
            {isFeatureEnabled('vaults') && (
              <TableLink to={paths.distributions(e.id)}>
                Distributions
              </TableLink>
            )}
          </Box>
        );
      } else {
        // epoch/number is null, so we can't provide a download link
        return <></>;
      }
    } else {
      // epoch still in progress
      return renderActions(
        () => setEditEpoch(e),
        !e.started ? () => setDeleteEpochDialog(e) : undefined
      );
    }
  };

  const downloadCSVButton = (epoch: number) => (
    <TableLink
      to=""
      onClick={async () => {
        // use the authed api to download the CSV
        const csv = await downloadCSV(epoch);

        if (csv?.file) {
          const a = document.createElement('a');
          a.download = `${selectedCircle?.protocol.name}-${selectedCircle?.name}-epoch-${epoch}.csv`;
          a.href = csv.file;
          a.click();
          a.href = '';
        }

        return false;
      }}
    >
      Export CSV
    </TableLink>
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
                <ApeAvatar
                  user={u}
                  className={classes.avatar}
                  onClick={getToProfile(u.address)}
                />
                <span>{u.name}</span>
                <span>
                  {u.role === USER_ROLE_COORDINAPE ? (
                    <div className={classes.tooltipWrapper}>
                      <ApeInfoTooltip classes={{ tooltip: classes.tooltip }}>
                        <b className={classes.tooltipTitle}>
                          Why is Coordinape in your circle?
                        </b>
                        <p className={classes.tooltipBodyText}>
                          We&apos;re experimenting with the gift circle
                          mechanism as our revenue model. By default, Coordinape
                          appears in your circle and any user can allocate to
                          Coordinape. To remove the Coordinape user, click the
                          trash can icon on the right side of this row.
                        </p>
                        <a
                          href="https://coordinape.notion.site/Why-is-Coordinape-in-my-Circle-fd17133a82ef4cbf84d4738311fb557a"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Let us know what you think
                        </a>
                      </ApeInfoTooltip>
                    </div>
                  ) : (
                    ''
                  )}
                </span>
              </div>
            );
          },
          sortFunc: (a: string, b: string) => englishCollator.compare(a, b),
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
          render: (u: IUser) => (u.role === USER_ROLE_ADMIN ? 'Admin' : '-'),
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
              u.role !== USER_ROLE_COORDINAPE
                ? () => setEditUser(u)
                : undefined,
              u.id !== me?.id ? () => setDeleteUserDialog(u) : undefined
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

  interface IconProp {
    toolTipMessage: string;
    link: string;
  }

  const InfoIconText = ({ toolTipMessage, link }: IconProp): JSX.Element => (
    <Typography color="inherit">
      {toolTipMessage}
      <a href={link} target="_blank" rel="noreferrer">
        {' '}
        Learn More
      </a>
    </Typography>
  );

  return (
    <div className={classes.root}>
      <div className={classes.withVaults}>
        <div className={classes.actionsAndEpochs}>
          <h2 className={classes.title}>{selectedCircle?.name}</h2>
          <div className={classes.actionBar}>
            <div className={classes.actionBarInner}>
              <Button
                variant="contained"
                size="small"
                startIcon={<EditIcon />}
                onClick={() => setEditCircle(true)}
              >
                Settings
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
                endIcon={
                  <ApeInfoTooltip
                    iconTheme={classes.infoIcon}
                    enterNextDelay={1}
                    placement="bottom"
                    leaveDelay={500}
                  >
                    <InfoIconText
                      link="https://docs.coordinape.com/welcome/gift_circle#the-gift-circle"
                      toolTipMessage="A member of a circle that can receive GIVE or kudos for contributions performed."
                    />
                  </ApeInfoTooltip>
                }
                onClick={() => setNewUser(true)}
              >
                Add Contributor
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="small"
                endIcon={
                  <ApeInfoTooltip
                    iconTheme={classes.infoIcon}
                    enterNextDelay={1}
                    placement="bottom"
                    leaveDelay={500}
                  >
                    <InfoIconText
                      link=" https://docs.coordinape.com/welcome/how_to_use_coordinape#my-epoch"
                      toolTipMessage="An Epoch is a period of time where circle members contribute value & allocate GIVE tokens to one another."
                    />
                  </ApeInfoTooltip>
                }
                onClick={() => setNewEpoch(true)}
              >
                Create Epoch
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<PlusCircleIcon />}
                onClick={() => navigate(paths.createCircle)}
              >
                Add Circle
              </Button>
            </div>
          </div>
        </div>
        <StaticTable
          className={classes.epochsTable}
          columns={epochColumns}
          data={epochs}
          perPage={6}
          placeholder={
            <>
              <h2 className={classes.tablePlaceholderTitle}>
                You don’t have any epochs scheduled
              </h2>
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<PlusCircleIcon />}
                onClick={() => setNewEpoch(true)}
              >
                Create Epoch
              </Button>
            </>
          }
        />
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
          placeholder={
            <>
              <h2 className={classes.tablePlaceholderTitle}>
                You haven’t added any contributors
              </h2>
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<PlusCircleIcon />}
                onClick={() => setNewUser(true)}
              >
                Add Contributor
              </Button>
            </>
          }
        />
      </div>
      {(editUser || newUser) && (
        <AdminUserModal
          onClose={() => (newUser ? setNewUser(false) : setEditUser(undefined))}
          user={editUser}
        />
      )}
      <AdminEpochModal
        epochs={epochs}
        circleId={circleId}
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
      <ActionDialog
        open={newCircle}
        title="Congrats! You just launched a new circle."
        onClose={() => setNewCircle(false)}
        onPrimary={() => setNewCircle(false)}
      >
        You’ll need to add your teammates to your circle and schedule an epoch
        before you can start allocating GIVE.
      </ActionDialog>

      <ActionDialog
        open={!!deleteUserDialog}
        title={`Remove ${deleteUserDialog?.name} from circle`}
        onClose={() => setDeleteUserDialog(undefined)}
        primaryText="Remove"
        onPrimary={
          deleteUserDialog
            ? () =>
                deleteUser(deleteUserDialog.address)
                  .then(() => setDeleteUserDialog(undefined))
                  .catch(() => setDeleteUserDialog(undefined))
            : undefined
        }
      />

      <ActionDialog
        open={!!deleteEpochDialog}
        title={`Remove Epoch ${deleteEpochDialog?.number}`}
        onClose={() => setDeleteEpochDialog(undefined)}
        primaryText="Remove"
        onPrimary={
          deleteEpochDialog
            ? () =>
                deleteEpoch(deleteEpochDialog?.id)
                  .then(() => setDeleteEpochDialog(undefined))
                  .catch(() => setDeleteEpochDialog(undefined))
            : undefined
        }
      />
    </div>
  );
};

export default AdminPage;
