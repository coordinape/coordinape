import assert from 'assert';
import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import uniqBy from 'lodash/uniqBy';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { z } from 'zod';

import { FormControl, MenuItem, Select } from '@material-ui/core';

import { ApeTextField, LoadingModal } from 'components';
import { useContracts } from 'hooks';
import useConnectedAddress from 'hooks/useConnectedAddress';
import { Box, Panel, Button, Text } from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { AllocationsTable } from './AllocationsTable';
import { usePreviousDistributions, getEpochData } from './queries';
import { useSubmitDistribution } from './useSubmitDistribution';
import type { SubmitDistribution } from './useSubmitDistribution';

import type { Awaited } from 'types/shim';

export type QueryResult = Awaited<ReturnType<typeof getEpochData>>;
export type Gift = Exclude<QueryResult['token_gifts'], undefined>[0];

export function DistributionsPage() {
  const { epochId } = useParams();
  const address = useConnectedAddress();
  const contracts = useContracts();
  const {
    isIdle,
    isLoading,
    isError,
    error,
    data: epoch,
  } = useQuery(
    ['distributions', epochId],
    () => getEpochData(Number(epochId), address, contracts),
    { enabled: !!(contracts && address), retry: false }
  );

  const [form1Amount, setForm1Amount] = useState<number>(0);
  const [vault1Id, setVault1Id] = useState<string>();

  if (isIdle || isLoading) return <LoadingModal visible />;

  // TODO show error if user isn't circle admin
  if (isError) return <Text>{(error as any).message}</Text>;

  // TODO show error if epoch not found
  // TODO show error if epoch hasn't ended yet
  assert(epoch);

  const totalGive = epoch.token_gifts?.reduce((t, g) => t + g.tokens, 0) || 0;

  const usersWithReceivedAmounts = uniqBy(
    epoch.token_gifts?.map((g: Gift) => g.recipient),
    'id'
  ).map(user => ({
    ...user,
    received:
      epoch.token_gifts
        ?.filter(g => g.recipient.id === user.id)
        .reduce((t, g) => t + g.tokens, 0) || 0,
  }));

  const vaults = epoch.circle?.organization.vaults || [];
  const tokenName = vaults.find(v => v.id === Number(vault1Id))?.symbol;

  // TODO if distribution already happened, show summary instead of form

  return (
    <SingleColumnLayout>
      <Panel>
        <Text variant="sectionHeader" css={{ mb: '$sm' }}>
          Distributions
        </Text>
        <Text variant="sectionHeader" normal>
          {epoch?.circle?.name}: Epoch {epoch?.number}
        </Text>
        <SubmitForm
          epoch={epoch}
          users={usersWithReceivedAmounts}
          setAmount={setForm1Amount}
          setVaultId={setVault1Id}
          vaults={vaults}
        />
        <Box css={{ mt: '$lg' }}>
          {totalGive && epoch.token_gifts ? (
            <AllocationsTable
              users={usersWithReceivedAmounts}
              totalAmountInVault={form1Amount}
              tokenName={tokenName}
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

const DistributionFormSchema = z.object({
  amount: z.number(),
  selectedVaultId: z.number(),
});

type DistributionForm = z.infer<typeof DistributionFormSchema>;

type SubmitFormProps = {
  epoch: QueryResult;
  users: (Gift['recipient'] & { received: number })[];
  setAmount: (amount: number) => void;
  setVaultId: (vaultId: string) => void;
  vaults: { id: number; symbol: string }[];
};

/**
 * Displays a list of allocations and allows generation of Merkle Root for a given circle and epoch.
 * @param epochId string
 * @returns JSX.Element
 */
export function SubmitForm({
  epoch,
  users,
  setAmount,
  setVaultId,
  vaults,
}: SubmitFormProps) {
  const [loadingTrx, setLoadingTrx] = useState(false);

  const submitDistribution = useSubmitDistribution();

  const {
    data: prev,
    isLoading,
    isError,
  } = usePreviousDistributions(epoch?.circle?.id);

  const circle = epoch?.circle;

  const { handleSubmit, control } = useForm<DistributionForm>({
    resolver: zodResolver(DistributionFormSchema),
  });

  const onSubmit: SubmitHandler<DistributionForm> = async (value: any) => {
    assert(epoch?.id && circle);
    setLoadingTrx(true);
    const vault = circle.organization?.vaults?.find(
      v => v.id === Number(value.selectedVaultId)
    );
    assert(vault);

    const gifts = users.reduce((ret, user) => {
      ret[user.address] = user.received;
      return ret;
    }, {} as Record<string, number>);

    const userIdsByAddress = users.reduce((ret, user) => {
      ret[user.address.toLowerCase()] = user.id;
      return ret;
    }, {} as Record<string, number>);

    const submitDTO: SubmitDistribution = {
      amount: value.amount,
      vault,
      gifts,
      userIdsByAddress,
      previousDistribution: prev?.find(d => d.vault_id === vault.id),
      circleId: circle.id,
      epochId: epoch.id,
    };

    try {
      await submitDistribution(submitDTO);
      setLoadingTrx(false);
    } catch (e) {
      console.error('DistributionsPage.onSubmit:', e);
      setLoadingTrx(false);
    }
  };

  if (isLoading) return <Box>Loading...</Box>;

  const pageMessage = () => {
    if (!epoch) return `Sorry, epoch was not found.`;

    if (isError)
      return 'Sorry, there was an error retrieving previous distribution data.';
  };

  const message = pageMessage();
  if (message) return <Box>{message}</Box>;

  return (
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
                        setVaultId(String(value));
                      }}
                    >
                      {vaults.map(vault => (
                        <MenuItem key={vault.id} value={vault.id}>
                          {vault.symbol}
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
            render={({ field: { onChange, value }, fieldState: { error } }) => (
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
                  setAmount(Number(value));
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
  );
}
