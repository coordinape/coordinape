import assert from 'assert';
import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { BigNumber, FixedNumber, utils } from 'ethers';
import { ValueTypes } from 'lib/gql/__generated__/zeus';
import { isUserAdmin } from 'lib/users';
import { encodeCircleId } from 'lib/vaults';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { z } from 'zod';

import { FormControl, MenuItem, Select } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { createDistribution } from '../../lib/merkle-distributor';
import { Link, Box, Panel, Button, Text } from '../../ui';
import { ApeTextField } from 'components';
import { useDistributor, useApeSnackbar } from 'hooks';
import { useCurrentOrg } from 'hooks/gql/useCurrentOrg';
import { useVaults } from 'hooks/gql/useVaults';
import { useContracts } from 'hooks/useContracts';
import * as paths from 'routes/paths';

import AllocationTable from './AllocationsTable';
import { useSaveEpochDistribution, useUpdateDistribution } from './mutations';
import { useCurrentUserForEpoch, useGetAllocations } from './queries';
import ShowMessage from './ShowMessage';

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
function DistributePage() {
  // Route Parameters
  const { epochId } = useParams();
  const [loadingTrx, setLoadingTrx] = useState(false);
  const [updateAmount, setUpdateAmount] = useState(0);
  const [selectedVaultId, setSelectedVaultId] = useState('');

  const contracts = useContracts();
  const currentOrg = useCurrentOrg();
  const { isLoading: vaultLoading, data: vaults } = useVaults(
    currentOrg.data?.id as number
  );

  const { uploadEpochRoot } = useDistributor();
  const selectedVault = vaults?.find(v => v.id === Number(selectedVaultId));
  const { apeError } = useApeSnackbar();
  const { mutateAsync } = useSaveEpochDistribution();
  const { mutateAsync: updateDistributionMutateAsync } =
    useUpdateDistribution();

  const {
    isLoading: isAllocationsLoading,
    isError,
    data,
  } = useGetAllocations(Number(epochId));

  const currentUser = useCurrentUserForEpoch(Number(epochId));

  const isLoading =
    isAllocationsLoading || currentUser.isLoading || vaultLoading;

  const circle = data?.epochs_by_pk?.circle;
  const epoch = data?.epochs_by_pk;
  const users = data?.epochs_by_pk?.circle?.users;

  const totalGive = users?.reduce(
    (total, { received_gifts: g }) =>
      total + g.reduce((userTotal, { tokens }) => userTotal + tokens, 0),
    0
  );

  const { register, handleSubmit, control } = useForm<DistributionForm>({
    resolver: zodResolver(DistributionFormSchema),
  });

  let vaultOptions: Array<{ value: number; label: string; id: number }> = [];

  //TODO: Migrate this method to a separate file and enable previous distributions
  const onSubmit: SubmitHandler<DistributionForm> = async (value: any) => {
    setLoadingTrx(true);
    assert(selectedVault && circle);
    if (!users) throw new Error('No users found');

    const gifts = users.reduce((userList, user) => {
      const amount = user.received_gifts.reduce(
        (t, { tokens }) => t + tokens,
        0
      );
      if (amount > 0) userList[user.address] = amount;
      return userList;
    }, {} as Record<string, number>);

    const denominator = BigNumber.from(10).pow(selectedVault.decimals);
    const totalDistributionAmount = BigNumber.from(value.amount).mul(
      denominator
    );

    try {
      assert(contracts);
      assert(currentUser.data);
      const yVaultAddress = await contracts
        .getVault(selectedVault.vault_address)
        .vault();
      const distribution = createDistribution(gifts, totalDistributionAmount);
      const claims: ValueTypes['claims_insert_input'][] = Object.entries(
        distribution.claims
      ).map(([address, claim]) => ({
        address,
        index: claim.index,
        amount: Number(
          FixedNumber.from(BigNumber.from(claim.amount)).divUnsafe(
            FixedNumber.from(denominator)
          )
        ),
        proof: claim.proof.toString(),
        user_id: users.find(({ address }) => address === address)?.id,
      }));

      const updateDistribution: ValueTypes['distributions_insert_input'] = {
        total_amount: Number(
          FixedNumber.from(totalDistributionAmount, 'fixed128x18')
        ),
        epoch_id: Number(epochId),
        merkle_root: distribution.merkleRoot,
        claims: {
          data: claims,
        },
        vault_id: Number(selectedVault.id),
      };

      const { insert_distributions_one } = await mutateAsync(
        updateDistribution
      );
      assert(insert_distributions_one, 'Distribution was not saved.');

      await uploadEpochRoot(
        selectedVault.vault_address,
        encodeCircleId(circle.id),
        yVaultAddress.toString(),
        distribution.merkleRoot,
        totalDistributionAmount,
        utils.hexlify(1)
      );

      await updateDistributionMutateAsync(insert_distributions_one.id);
      setLoadingTrx(false);
    } catch (e) {
      console.error(e);
      apeError(e);
      setLoadingTrx(false);
    }
  };

  const pageMessage = () => {
    if (isLoading) return 'Loading...';
    if (!epoch) return `Sorry, epoch ${epochId} was not found.`;
    if (!data?.epochs_by_pk) return `Sorry, Epoch ${epochId} was not found.`;

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
  if (message)
    return <ShowMessage path={paths.getVaultsPath()} message={message} />;

  if (vaults)
    vaultOptions = vaults.map(vault => ({
      value: vault.id,
      label: vault.symbol || '...',
      id: vault.id,
    }));

  return (
    <Box
      css={{
        margin: '$lg auto',
        maxWidth: '$mediumScreen',
      }}
    >
      <Panel>
        <Box
          css={{
            display: 'flex',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
          }}
        >
          <Box css={{ minWidth: '15%' }}>
            <Link
              href={paths.getVaultsPath()}
              css={{
                fontSize: '$4',
                lineHeight: '$shorter',
                alignSelf: 'center',
                color: '$text',
                display: 'flex',
                alignItems: 'center',
                ml: '$lg',
              }}
            >
              <ArrowBackIcon />
              Back to Vaults
            </Link>
          </Box>
          <Box
            css={{
              textTransform: 'capitalize',
              fontSize: '$9',
              lineHeight: '$shorter',
              fontWeight: '$bold',
              color: '$text',
            }}
          >
            {`${circle?.name}: Epoch ${epoch?.number} has completed`}
          </Box>
          <Box css={{ minWidth: '15%' }}></Box>
        </Box>
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
                          value={value}
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
                    {...register('amount')}
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
        <Box
          css={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <Box css={{ pt: '$md', color: '$text' }}>
            Please review the distribution details below and if all looks good,
            approve the Merkle root so that contributoros can claim their funds.
          </Box>
        </Box>
        <Box css={{ mt: '$lg' }}>
          {totalGive ? (
            <AllocationTable
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
    </Box>
  );
}

export default DistributePage;
