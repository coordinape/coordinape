/* eslint-disable @typescript-eslint/no-unused-vars */

/*
first get distributions
if there's already one, show it
otherwise, show form
*/

import assert from 'assert';
import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { client } from 'lib/gql/client';
import { isUserAdmin } from 'lib/users';
import { Contracts } from 'lib/vaults';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { z } from 'zod';

import { FormControl, MenuItem, Select } from '@material-ui/core';

import { ApeTextField, LoadingModal, NewApeAvatar } from 'components';
import { useCurrentOrg } from 'hooks/gql/useCurrentOrg';
import { useVaults } from 'hooks/gql/useVaults';
import { paths } from 'routes/paths';
import { Box, Panel, Button, Text, Flex } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';
import { shortenAddress } from 'utils';

import { AllocationsTable } from './AllocationsTable';
import {
  PreviousDistribution,
  useCurrentUserForEpoch,
  useGetAllocations,
  usePreviousDistributions,
} from './queries';
import ShowMessage from './ShowMessage';
import { Table, TableBorder } from './Table';
import { useSubmitDistribution } from './useSubmitDistribution';
import type { SubmitDistribution } from './useSubmitDistribution';

import { IAllocateUser } from 'types';

const DistributionFormSchema = z.object({
  amount: z.number(),
  selectedVaultId: z.number(),
});

type DistributionForm = z.infer<typeof DistributionFormSchema>;

/**
 * Displays a list of allocations and allows generation of Merkle Root for a given circle and epoch.
 * @param epochId string
 * @returns JSX.Element
 */
export function DistributionsPage() {
  // Route Parameters
  const { epochId } = useParams();
  const [loadingTrx, setLoadingTrx] = useState(false);
  const [updateAmount, setUpdateAmount] = useState(0);
  const [selectedVaultId, setSelectedVaultId] = useState('');

  const currentOrg = useCurrentOrg();
  const submitDistribution = useSubmitDistribution();
  const currentUser = useCurrentUserForEpoch(epochId as number | undefined);

  const { isLoading: vaultLoading, data: vaults } = useVaults(
    currentOrg.data?.id
  );

  const {
    isLoading: isAllocationsLoading,
    isError,
    data,
  } = useGetAllocations(epochId as number | undefined);

  const {
    data: previousDistribution,
    isLoading: loadingPreviousDistributions,
  } = usePreviousDistributions(data?.circle?.id);

  const isLoading =
    isAllocationsLoading ||
    currentUser.isLoading ||
    vaultLoading ||
    loadingPreviousDistributions;

  const circle = data?.circle;
  const epoch = data;
  const users = data?.circle?.users;

  const totalGive = users?.reduce(
    (total, { received_gifts: g }) =>
      total +
      g.reduce((userTotal: any, { tokens }: any) => userTotal + tokens, 0),
    0
  );

  const { handleSubmit, control } = useForm<DistributionForm>({
    resolver: zodResolver(DistributionFormSchema),
  });

  let vaultOptions: Array<{ value: number; label: string; id: number }> = [];

  const onSubmit: SubmitHandler<DistributionForm> = async (value: any) => {
    setLoadingTrx(true);
    const vault = vaults?.find(v => v.id === Number(value.selectedVaultId));
    assert(vault && users && circle);

    const gifts = users.reduce((userList, user) => {
      const amount = user.received_gifts.reduce(
        (t, { tokens }) => t + tokens,
        0
      );
      if (amount > 0) userList[user.address] = amount;
      return userList;
    }, {} as Record<string, number>);

    const usersRecord = users.reduce((userList, user) => {
      userList[user.address.toLowerCase()] = user.id;
      return userList;
    }, {} as Record<string, number>);

    const submitDTO: SubmitDistribution = {
      amount: value.amount,
      vault,
      gifts,
      users: usersRecord,
      previousDistribution:
        previousDistribution &&
        (previousDistribution.find(
          d => d.vault_id === vault.id
        ) as PreviousDistribution),
      circleId: circle.id,
      epochId: Number(epochId),
    };

    try {
      await submitDistribution(submitDTO);
      setLoadingTrx(false);
    } catch (e) {
      console.error('DistributionsPage.onSubmit:', e);
      setLoadingTrx(false);
    }
  };

  if (isLoading) return <LoadingModal visible />;

  const pageMessage = () => {
    if (!epoch) return `Sorry, epoch was not found.`;
    if (!data) return `Sorry, epoch was not found.`;

    if (currentUser.data && !isUserAdmin(currentUser.data))
      return "Sorry, you are not a circle admin so you can't access this feature.";

    if (isError)
      return 'Sorry, there was an error retrieving your epoch information.';

    if (!epoch?.ended)
      return `Sorry, ${circle?.name}: Epoch ${epoch?.number} is still active. You can only distribute epochs that have ended.`;

    if (!vaults?.length)
      return 'No vaults have been associated with your address. Please create a vault.';
  };

  const message = pageMessage();
  if (message) return <ShowMessage path={paths.vaults} message={message} />;

  if (vaults)
    vaultOptions = vaults.map(vault => ({
      value: vault.id,
      label: vault.symbol || '...',
      id: vault.id,
    }));

  return (
    <SingleColumnLayout>
      <Panel>
        <Text variant="sectionHeader" css={{ mb: '$sm' }}>
          Distributions
        </Text>
        <Text variant="sectionHeader" normal>
          {circle?.name}: Epoch {epoch?.number}
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box css={{ display: 'flex', justifyContent: 'center', pt: '$lg' }}>
            <Box css={{ mb: '$lg', mt: '$xs', mr: '$md', minWidth: '15vw' }}>
              <FormControl fullWidth>
                <Box
                  css={{
                    color: '$text',
                    fontSize: '$4',
                    fontWeight: '$bold',
                    lineHeight: '$shorter',
                    marginBottom: '$md',
                    textAlign: 'center',
                  }}
                >
                  Select Vault
                </Box>
                <Controller
                  name="selectedVaultId"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => {
                    return (
                      <>
                        <Select
                          value={value || ''}
                          label="Vault"
                          error={!!error}
                          disabled={loadingTrx}
                          onChange={({ target: { value } }) => {
                            onChange(value);
                            setSelectedVaultId(String(value));
                          }}
                        >
                          {vaultOptions.map(vault => (
                            <MenuItem key={vault.id} value={vault.id}>
                              {vault.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {error && (
                          <Text
                            css={{
                              fontSize: '$3',
                              lineHeight: '$shorter',
                              fontWeight: '$semibold',
                              color: '$red',
                              textAlign: 'center',
                              paddingTop: '$sm',
                            }}
                            className="error"
                          >
                            {error.message}
                          </Text>
                        )}
                      </>
                    );
                  }}
                />
              </FormControl>
            </Box>
            <Box>
              <Controller
                name={'amount'}
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <ApeTextField
                    type="number"
                    error={!!error}
                    helperText={error ? error.message : null}
                    value={value}
                    disabled={loadingTrx}
                    onChange={({ target: { value } }) => {
                      onChange(Number(value));
                    }}
                    onBlur={({ target: { value } }) => {
                      setUpdateAmount(Number(value));
                    }}
                    label="Total Distribution Amount"
                  />
                )}
              />
            </Box>
          </Box>
          <Box css={{ display: 'flex', justifyContent: 'center' }}>
            <Button color="red" size="medium" disabled={loadingTrx}>
              {loadingTrx
                ? `Transaction Pending...`
                : `Submit Distribution to Vault`}
            </Button>
          </Box>
        </form>
        <Box css={{ mt: '$lg' }}>
          {totalGive ? (
            <AllocationsTable
              users={users as IAllocateUser[]}
              totalAmountInVault={updateAmount}
              tokenName={
                selectedVaultId
                  ? vaults?.find(vault => vault.id === Number(selectedVaultId))
                      ?.symbol
                  : undefined
              }
              totalGive={totalGive}
            />
          ) : (
            <Text
              css={{
                fontSize: '$7',
                fontWeight: '$bold',
                textAlign: 'center',
                display: 'block',
              }}
            >
              No GIVE was allocated for this epoch
            </Text>
          )}
        </Box>
      </Panel>
    </SingleColumnLayout>
  );
}
