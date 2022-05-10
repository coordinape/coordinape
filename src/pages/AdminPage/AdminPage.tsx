import React, { useState, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { makeStyles, Button } from '@material-ui/core';

import { ActionDialog, OrganizationHeader } from 'components';
import { useApiAdminCircle } from 'hooks';
import useMobileDetect from 'hooks/useMobileDetect';
import { EditIcon, PlusCircleIcon } from 'icons';
import { useSelectedCircle } from 'recoilState/app';
import { NEW_CIRCLE_CREATED_PARAMS, paths } from 'routes/paths';
import { Text } from 'ui';

import { AdminCircleModal } from './AdminCircleModal';
import { AdminEpochModal } from './AdminEpochModal';
import { AdminUserModal } from './AdminUserModal';
import {
  AddContributorButton,
  ContributorsTable,
  CreateEpochButton,
  EpochsTable,
  EpochsTableHeader,
  SettingsIconButton,
  UsersTableHeader,
} from './components';

import { IUser, IEpoch } from 'types';

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
    background: theme.colors.surface,
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
    background: theme.colors.white,
    border: 'none',
    borderRadius: 8,
    outline: 'none',
    '&::placeholder': {
      color: theme.colors.secondaryText,
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
}));

const AdminPage = () => {
  const classes = useStyles();
  const { isMobile } = useMobileDetect();

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

  // User Columns
  const filterUser = useMemo(
    () => (u: IUser) => {
      const r = new RegExp(keyword, 'i');
      return r.test(u.name) || r.test(u.address);
    },
    [keyword]
  );

  return (
    <div className={classes.root}>
      <div className={classes.withVaults}>
        <div className={classes.actionsAndEpochs}>
          <Text h2 css={{ my: '$xl' }}>
            {selectedCircle?.name}
          </Text>
          <div className={classes.actionBar}>
            {!isMobile && (
              <div className={classes.actionBarInner}>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => setEditCircle(true)}
                >
                  Settings
                </Button>

                <AddContributorButton onClick={() => setNewUser(true)} />
                <CreateEpochButton onClick={() => setNewEpoch(true)} />
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
            )}
            {isMobile && (
              <SettingsIconButton onClick={() => setEditCircle(true)} />
            )}
          </div>
        </div>
        {isMobile && <EpochsTableHeader onClick={() => setNewEpoch(true)} />}

        <EpochsTable
          circle={selectedCircle}
          epochs={epochs}
          downloadCSV={downloadCSV}
          setEditEpoch={setEditEpoch}
          setDeleteEpochDialog={setDeleteEpochDialog}
          setNewEpoch={setNewEpoch}
        />

        {isMobile && <UsersTableHeader onClick={() => setNewUser(true)} />}
        <div className={classes.userActionBar}>
          <input
            className={classes.searchInput}
            onChange={onChangeKeyword}
            placeholder="🔍 Search"
            value={keyword}
          />
        </div>

        <ContributorsTable
          users={visibleUsers}
          myUser={me}
          setNewUser={setNewUser}
          filter={filterUser}
          setEditUser={setEditUser}
          setDeleteUserDialog={setDeleteUserDialog}
          perPage={15}
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
