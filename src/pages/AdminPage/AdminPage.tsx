import React, { useState, useMemo, useEffect } from 'react';

import { isUserAdmin } from 'lib/users';
import { useQuery } from 'react-query';

import { ActionDialog, LoadingModal } from 'components';
import { useApiAdminCircle } from 'hooks';
import useMobileDetect from 'hooks/useMobileDetect';
import { getCircleSettings } from 'pages/CircleAdminPage/getCircleSettings';
import { useSelectedCircle } from 'recoilState/app';
import { NEW_CIRCLE_CREATED_PARAMS, paths } from 'routes/paths';
import { AppLink, Button, Flex, Panel, Text, TextField } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { AdminUserModal } from './AdminUserModal';
import { MembersTable } from './components';
import {
  getActiveNominees,
  QUERY_KEY_ACTIVE_NOMINEES,
} from './getActiveNominees';
import { NewNominationModal } from './NewNominationModal';
import { NomineesTable } from './NomineeTable';

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

  const { deleteUser } = useApiAdminCircle(circleId);

  const onChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  const isAdmin = isUserAdmin(me);

  const {
    isLoading,
    isError,
    isIdle,
    error,
    data: activeNominees,
    refetch: refetchNominees,
  } = useQuery(
    [QUERY_KEY_ACTIVE_NOMINEES, circleId],
    () => getActiveNominees(circleId),
    {
      // the query will not be executed untill circleId exists
      enabled: !!circleId,

      //minmize background refetch
      refetchOnWindowFocus: false,

      notifyOnChangeProps: ['data'],
    }
  );

  const nomineeCount = activeNominees?.length || 0;
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
    refetchNominees();
  };

  if (isLoading || isIdle) return <LoadingModal visible />;
  if (isError) {
    if (error instanceof Error) {
      console.warn(error.message);
    }
  }
  return (
    <SingleColumnLayout>
      <Panel nested>
        <Flex css={{ alignItems: 'center', mb: '$lg' }}>
          <Text h2>Circle Members</Text>
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
        <Text size="medium">Mange, nominate and vouch for members.</Text>
        {isMobile && (
          <Flex
            column
            css={{
              width: 'auto',
              marginTop: '$xl',
              gap: '$sm',
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
                justifyContent: 'flex-start',
                gap: '$sm',
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
        {circle?.vouching && (
          <Panel nested css={{ mt: '$1xl', px: 0 }}>
            <NomineesTable
              refetchNominees={refetch}
              isNonGiverVoucher={circle?.only_giver_vouch}
              myUser={me}
              nominees={activeNominees}
              vouchingText={circle.vouchingText}
            />
          </Panel>
        )}
        <Panel nested css={{ mt: '$2xl', px: 0 }}>
          <Panel>
            <Flex css={{ justifyContent: 'space-between', mb: '$md' }}>
              <Text h3 css={{ fontWeight: '$semibold', color: '$headingText' }}>
                Members
              </Text>
              <TextField
                inPanel
                size="sm"
                onChange={onChangeKeyword}
                placeholder="🔍 Search"
                value={keyword}
              />
            </Flex>
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
        </Panel>
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
