import React, { useState, useMemo, useEffect } from 'react';

import { isUserAdmin } from 'lib/users';
import { useQuery, useQueryClient } from 'react-query';

import { ActionDialog } from 'components';
import { useApiAdminCircle } from 'hooks';
import useMobileDetect from 'hooks/useMobileDetect';
import { getCircleSettings } from 'pages/CircleAdminPage/getCircleSettings';
import { QUERY_KEY_ACTIVE_NOMINEES } from 'pages/VouchingPage/getActiveNominees';
import { NewNominationModal } from 'pages/VouchingPage/NewNominationModal';
import { useSelectedCircle } from 'recoilState/app';
import { NEW_CIRCLE_CREATED_PARAMS, paths } from 'routes/paths';
import { AppLink, Button, Flex, Panel, Text, TextField } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { AdminUserModal } from './AdminUserModal';
import { MembersTable } from './components';
import {
  getNominationsData,
  QUERY_KEY_NOMINATIONS_DATA,
} from './getNominationsData';

import { IUser } from 'types';

const AdminPage = () => {
  const { isMobile } = useMobileDetect();

  const [keyword, setKeyword] = useState<string>('');
  const [editUser, setEditUser] = useState<IUser | undefined>(undefined);
  const [deleteUserDialog, setDeleteUserDialog] = useState<IUser | undefined>(
    undefined
  );
  const [newCircle, setNewCircle] = useState<boolean>(false);
  const [isNewNomination, setNewNomination] = useState<boolean>(false);

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
  const queryClient = useQueryClient();

  const { deleteUser } = useApiAdminCircle(circleId);

  const onChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  const isAdmin = isUserAdmin(me);

  const { data: nominations } = useQuery(
    [QUERY_KEY_NOMINATIONS_DATA, circleId],
    () => getNominationsData(circleId),
    {
      enabled: !!circleId,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      notifyOnChangeProps: ['data'],
    }
  );

  const nomineeCount = nominations?.nominees_aggregate?.aggregate?.count || 0;
  const cannotVouch = circle?.only_giver_vouch && me.non_giver;

  // User Columns
  const filterUser = useMemo(
    () => (u: IUser) => {
      const r = new RegExp(keyword, 'i');
      return r.test(u.name) || r.test(u.address);
    },
    [keyword]
  );

  const refetch = () => {
    queryClient.invalidateQueries(QUERY_KEY_ACTIVE_NOMINEES);
    queryClient.invalidateQueries(QUERY_KEY_NOMINATIONS_DATA);
  };

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
              <Text size={'small'} css={{ color: '$headingText' }}>
                <Text>
                  {visibleUsers.length} Member
                  {visibleUsers.length > 1 ? 's' : ''}
                </Text>
                {circle?.vouching && (
                  <>
                    <Text
                      css={{ whiteSpace: 'pre-wrap', color: '$secondaryText' }}
                    >
                      {' | '}
                    </Text>
                    <Text>
                      {nomineeCount} Nominee{nomineeCount > 1 ? 's' : ''}
                    </Text>
                  </>
                )}
              </Text>
              {isAdmin && (
                <AppLink to={paths.membersAdd(selectedCircle.id)}>
                  <Button color="primary" outlined size="small">
                    Add Members
                  </Button>
                </AppLink>
              )}
              {circle?.hasVouching && (
                <Button
                  size="small"
                  color="primary"
                  outlined
                  disabled={cannotVouch}
                  onClick={() => setNewNomination(true)}
                >
                  Nominate Member
                </Button>
              )}
            </Flex>
          )}
        </Flex>
        {isMobile && (
          <Flex
            column
            css={{
              justifyContent: 'space-between',
              width: 'auto',
              marginTop: '$xl',
              gap: '$xs',
            }}
          >
            <Text h3>Users</Text>
            <Text size={'small'} css={{ color: '$headingText' }}>
              <Text>
                {visibleUsers.length} Member
                {visibleUsers.length > 1 ? 's' : ''}
              </Text>
              {circle?.vouching && (
                <>
                  <Text
                    css={{ whiteSpace: 'pre-wrap', color: '$secondaryText' }}
                  >
                    {' | '}
                  </Text>
                  <Text>
                    {nomineeCount} Nominee{nomineeCount > 1 ? 's' : ''}
                  </Text>
                </>
              )}
            </Text>
            <Flex
              css={{
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                gap: '$xs',
              }}
            >
              {isAdmin && (
                <AppLink to={paths.membersAdd(selectedCircle.id)}>
                  <Button
                    color="primary"
                    outlined
                    size="small"
                    css={{ minWidth: '130px' }}
                  >
                    Add Members
                  </Button>
                </AppLink>
              )}
              {circle?.hasVouching && (
                <Button
                  size="small"
                  color="primary"
                  outlined
                  disabled={cannotVouch}
                  onClick={() => setNewNomination(true)}
                  css={{ minWidth: '130px' }}
                >
                  Nominate Member
                </Button>
              )}
            </Flex>
          </Flex>
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
      {isNewNomination && (
        <NewNominationModal
          onClose={() => setNewNomination(false)}
          visible={isNewNomination}
          refetchNominees={refetch}
        />
      )}
    </SingleColumnLayout>
  );
};

export default AdminPage;
