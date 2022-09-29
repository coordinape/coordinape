import assert from 'assert';
import React, { useState, useMemo, useEffect } from 'react';

import { constants as ethersConstants } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { isUserAdmin } from 'lib/users';
import { useQuery } from 'react-query';

import { ActionDialog, LoadingModal } from 'components';
import { useApiAdminCircle, useContracts } from 'hooks';
import { useCircleOrg } from 'hooks/gql/useCircleOrg';
import { useVaults } from 'hooks/gql/useVaults';
import useMobileDetect from 'hooks/useMobileDetect';
import { Search } from 'icons/__generated';
import { getCircleSettings } from 'pages/CircleAdminPage/getCircleSettings';
import {
  getFixedPayment,
  QUERY_KEY_FIXED_PAYMENT,
} from 'pages/CircleAdminPage/getFixedPayment';
import { useSelectedCircle } from 'recoilState/app';
import { NEW_CIRCLE_CREATED_PARAMS, paths } from 'routes/paths';
import { AppLink, Box, Button, Flex, Panel, Text, TextField } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';
import { numberWithCommas } from 'utils';

import {
  getActiveNominees,
  QUERY_KEY_ACTIVE_NOMINEES,
} from './getActiveNominees';
import { MembersTable } from './MembersTable';
import { NomineesTable } from './NomineeTable';

import { IUser } from 'types';

const AdminPage = () => {
  const { isMobile } = useMobileDetect();

  const [keyword, setKeyword] = useState<string>('');
  const [deleteUserDialog, setDeleteUserDialog] = useState<IUser | undefined>(
    undefined
  );
  const [newCircle, setNewCircle] = useState<boolean>(false);
  const [maxGiftTokens, setMaxGiftTokens] = useState(ethersConstants.Zero);

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

  const { data: fixedPayment } = useQuery(
    [QUERY_KEY_FIXED_PAYMENT, circleId],
    () => getFixedPayment(circleId),
    {
      // the query will not be executed untill circleId exists
      enabled: !!circleId,
      //minmize background refetch
      refetchOnWindowFocus: false,

      staleTime: Infinity,
      notifyOnChangeProps: ['data'],
    }
  );

  const contracts = useContracts();
  const orgQuery = useCircleOrg(circleId);

  const vaultsQuery = useVaults({
    orgId: orgQuery.data?.id,
    chainId: Number(contracts?.chainId),
  });

  const vaultOptions = vaultsQuery.data
    ? [
        { value: '', label: '- None -' },
        ...vaultsQuery.data.map(vault => {
          return { value: vault.id, label: vault.symbol };
        }),
      ]
    : [
        {
          value: '',
          label:
            vaultsQuery.isLoading || orgQuery.isLoading
              ? 'Loading...'
              : 'None Available',
        },
      ];

  useEffect(() => {
    updateBalanceState(stringifiedVaultId());
  }, [vaultOptions.length]);

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

  const findVault = (vaultId: string) => {
    return vaultsQuery?.data?.find(v => v.id === parseInt(vaultId));
  };

  const updateBalanceState = async (vaultId: string): Promise<void> => {
    assert(circle);
    const vault = findVault(vaultId);
    assert(contracts, 'This network is not supported');

    if (vault) {
      const tokenBalance = await contracts.getVaultBalance(vault);
      setMaxGiftTokens(tokenBalance);
    } else {
      setMaxGiftTokens(ethersConstants.Zero);
    }
  };

  const stringifiedVaultId = () => {
    const id = circle?.fixed_payment_vault_id;
    if (id == null) {
      return '';
    }
    return `${id}`;
  };

  const getDecimals = (vaultId: string) => {
    if (vaultId) {
      const v = findVault(vaultId);
      if (v) return v.decimals;
    }
    return 0;
  };

  const availableFixedTokens = numberWithCommas(
    formatUnits(maxGiftTokens, getDecimals(stringifiedVaultId()))
  );

  if (isLoading || isIdle) return <LoadingModal visible />;
  if (isError) {
    if (error instanceof Error) {
      console.warn(error.message);
    }
  }
  return (
    <SingleColumnLayout>
      <Panel nested css={{ gap: '$1xl' }}>
        <Box>
          <Flex css={{ alignItems: 'center', mb: '$md' }}>
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
                        css={{
                          whiteSpace: 'pre-wrap',
                          color: '$secondaryText',
                        }}
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
                <AppLink to={paths.membersNominate(selectedCircle.id)}>
                  <Button
                    size="small"
                    color="primary"
                    outlined
                    disabled={cannotVouch}
                  >
                    Nominate Member
                  </Button>
                </AppLink>
                )}
              </Flex>
            )}
          </Flex>
          <Text size="medium">Manage, nominate and vouch for members.</Text>
        </Box>
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
                <AppLink to={paths.membersNominate(selectedCircle.id)}>
                  <Button
                    size="small"
                    color="primary"
                    outlined
                    disabled={cannotVouch}
                    css={{ minWidth: '130px' }}
                  >
                    Nominate Member
                  </Button>
                </AppLink>
              )}
            </Flex>
          </Flex>
        )}
        {circle?.vouching && (
          <NomineesTable
            refetchNominees={refetch}
            isNonGiverVoucher={circle?.only_giver_vouch}
            myUser={me}
            nominees={activeNominees}
            vouchingText={circle.vouchingText}
          />
        )}
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
              css={{
                pd: '25px',
                background: `${(<Search />)} no-repeat right`,
                backgroundSize: '20px',
              }}
            />
          </Flex>
          {circle && (
            <MembersTable
              visibleUsers={visibleUsers}
              myUser={me}
              circle={circle}
              filter={filterUser}
              perPage={15}
              fixedPayment={fixedPayment}
              availableInVault={availableFixedTokens}
              setDeleteUserDialog={setDeleteUserDialog}
            />
          )}
        </Panel>
      </Panel>
      {}
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
