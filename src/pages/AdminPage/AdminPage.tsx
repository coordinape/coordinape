import React, { useState, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { ActionDialog } from 'components';
import { useApiAdminCircle } from 'hooks';
import useMobileDetect from 'hooks/useMobileDetect';
import { EditIcon, PlusCircleIcon } from 'icons';
import { useSelectedCircle } from 'recoilState/app';
import { NEW_CIRCLE_CREATED_PARAMS, paths } from 'routes/paths';
import { AppLink, Button, Flex, Panel, Text, TextField } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

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

const AdminPage = () => {
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
    <SingleColumnLayout>
      <Panel>
        <Flex css={{ alignItems: 'center', mb: '$sm' }}>
          <Text h2 css={{ my: '$xl' }}>
            {selectedCircle?.name}
          </Text>
          {!isMobile ? (
            <Flex
              css={{
                flexGrow: 1,
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
                gap: '$md',
                mb: '$md',
              }}
            >
              <AppLink to={paths.circleAdmin(selectedCircle.id)}>
                <Button color="primary" outlined css={{ minWidth: '180px' }}>
                  <EditIcon />
                  Settings
                </Button>
              </AppLink>
              <AddContributorButton
                onClick={() => setNewUser(true)}
                tokenName={selectedCircle.tokenName}
              />
              <CreateEpochButton
                onClick={() => setNewEpoch(true)}
                tokenName={selectedCircle.tokenName}
              />
              <Button
                color="primary"
                outlined
                onClick={() => navigate(paths.createCircle)}
                css={{ minWidth: '180px' }}
              >
                <PlusCircleIcon />
                Add Circle
              </Button>
            </Flex>
          ) : (
            <AppLink to={paths.circleAdmin(selectedCircle.id)}>
              <SettingsIconButton />
            </AppLink>
          )}
        </Flex>
        {isMobile && (
          <EpochsTableHeader
            onClick={() => setNewEpoch(true)}
            tokenName={selectedCircle.tokenName}
          />
        )}

        <EpochsTable
          circle={selectedCircle}
          epochs={epochs}
          downloadCSV={downloadCSV}
          setEditEpoch={setEditEpoch}
          setDeleteEpochDialog={setDeleteEpochDialog}
          setNewEpoch={setNewEpoch}
        />

        {isMobile && (
          <UsersTableHeader
            onClick={() => setNewUser(true)}
            tokenName={selectedCircle.tokenName}
          />
        )}
        <TextField
          inPanel
          size="sm"
          css={{
            my: '$md',
          }}
          onChange={onChangeKeyword}
          placeholder="🔍 Search"
          value={keyword}
        />

        <ContributorsTable
          users={visibleUsers}
          myUser={me}
          circle={selectedCircle}
          setNewUser={setNewUser}
          filter={filterUser}
          setEditUser={setEditUser}
          setDeleteUserDialog={setDeleteUserDialog}
          perPage={15}
        />
      </Panel>
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
      <ActionDialog
        open={newCircle}
        title="Congrats! You just launched a new circle."
        onClose={() => setNewCircle(false)}
        onPrimary={() => setNewCircle(false)}
      >
        You’ll need to add your teammates to your circle and schedule an epoch
        before you can start allocating {selectedCircle.tokenName}.
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
    </SingleColumnLayout>
  );
};

export default AdminPage;
