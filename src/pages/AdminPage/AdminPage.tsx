import React, { useState, useMemo, useEffect } from 'react';

import { isUserAdmin } from 'lib/users';
import { useQuery } from 'react-query';

import { ActionDialog } from 'components';
import { useApiAdminCircle } from 'hooks';
import useMobileDetect from 'hooks/useMobileDetect';
import { getCircleSettings } from 'pages/CircleAdminPage/getCircleSettings';
import { useSelectedCircle } from 'recoilState/app';
import { NEW_CIRCLE_CREATED_PARAMS, paths } from 'routes/paths';
import { AppLink, Button, Flex, Panel, Text, TextField } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { AdminUserModal } from './AdminUserModal';
import { MembersTable, UsersTableHeader } from './components';
import { getNominationsData } from './getNominationsData';

import { IUser } from 'types';

const AdminPage = () => {
  const { isMobile } = useMobileDetect();

  const [keyword, setKeyword] = useState<string>('');
  const [editUser, setEditUser] = useState<IUser | undefined>(undefined);
  const [deleteUserDialog, setDeleteUserDialog] = useState<IUser | undefined>(
    undefined
  );
  const [newCircle, setNewCircle] = useState<boolean>(false);

  useEffect(() => {
    // do this initialization in useEffect because window is only available client side -g
    if (typeof window !== 'undefined') {
      setNewCircle(window.location.search === NEW_CIRCLE_CREATED_PARAMS);
    }
  }, []);

  const {
    circleId,
    myUser: me,
    users: visibleUsers,
    circle: selectedCircle,
  } = useSelectedCircle();

  const { data: circle } = useQuery(
    ['circleSettings', circleId],
    () => getCircleSettings(circleId),
    {
      initialData: selectedCircle,
      enabled: !!circleId,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      notifyOnChangeProps: ['data'],
    }
  );

  const { deleteUser } = useApiAdminCircle(circleId);

  const onChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  const isAdmin = isUserAdmin(me);

  const { data: nominations } = useQuery(
    ['nominationsData', circleId],
    () => getNominationsData(circleId),
    {
      enabled: !!circleId,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      notifyOnChangeProps: ['data'],
    }
  );

  const nomineeCount = nominations?.nominees_aggregate?.aggregate?.count || 0;

  console.log(nomineeCount);
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
        <Flex css={{ alignItems: 'center', mb: '$lg' }}>
          <Text h2>{circle?.name}</Text>
          {!isMobile && (
            <Flex
              css={{
                flexGrow: 1,
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
                gap: '$md',
              }}
            >
              {isAdmin && (
                <AppLink to={paths.membersAdd(selectedCircle.id)}>
                  <Button color="primary" outlined size="small">
                    Add Members
                  </Button>
                </AppLink>
              )}
              <Text size={'small'} css={{ color: '$headingText' }}>
                {circle?.vouching && (
                  <span>
                    {nomineeCount} Nominee{nomineeCount > 1 ? 's' : ''}
                  </span>
                )}
              </Text>

              <Button size="small" color="primary" outlined>
                Nominate Member
              </Button>
            </Flex>
          )}
        </Flex>
        {isMobile && (
          <UsersTableHeader
            circleId={selectedCircle.id}
            tokenName={circle?.tokenName || 'GIVE'}
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

        {circle && (
          <MembersTable
            visibleUsers={visibleUsers}
            myUser={me}
            circle={circle}
            filter={filterUser}
            setEditUser={setEditUser}
            setDeleteUserDialog={setDeleteUserDialog}
            perPage={15}
          />
        )}
      </Panel>
      {circle && editUser && (
        <AdminUserModal
          onClose={() => setEditUser(undefined)}
          user={editUser}
          fixedPaymentToken={circle.fixed_payment_token_type}
          tokenName={circle.tokenName}
        />
      )}
      <ActionDialog
        open={newCircle}
        title="Congrats! You just launched a new circle."
        onClose={() => setNewCircle(false)}
        onPrimary={() => setNewCircle(false)}
      >
        You’ll need to add your teammates to your circle and schedule an epoch
        before you can start allocating {circle?.tokenName}.
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
    </SingleColumnLayout>
  );
};

export default AdminPage;
