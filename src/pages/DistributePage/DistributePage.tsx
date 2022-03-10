import assert from 'assert';
import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { BigNumber, utils } from 'ethers';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { z } from 'zod';

import { FormControl, MenuItem, Select } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { createDistribution } from '../../lib/merkle-distributor';
import { Link, Box, Panel, Button, Text } from '../../ui';
import { ApeTextField } from 'components';
import { useDistributor, useApeSnackbar, useVaultWrapper } from 'hooks';
import { useCurrentOrg } from 'hooks/gql';
import { useCircle } from 'recoilState';
import { useVaults } from 'recoilState/vaults';
import * as paths from 'routes/paths';

import AllocationTable from './AllocationsTable';
import ShowMessage from './ShowMessage';
import { useGetAllocations } from './useGetAllocations';

import { IAllocateUser, IVault } from 'types';

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
  const currentOrg = useCurrentOrg();
  const vaults = useVaults(currentOrg?.id);
  const { uploadEpochRoot } = useDistributor();
  const [selectedVault, setSelectedVault] = useState<IVault | undefined>();
  const { getYVault } = useVaultWrapper(selectedVault as IVault);
  const { apeError } = useApeSnackbar();

  const { isLoading, isError, data } = useGetAllocations(Number(epochId));
  const { myUser: currentUser } = useCircle(data?.epochs_by_pk?.circle?.id);

  const circle = data?.epochs_by_pk?.circle;
  const epoch = data?.epochs_by_pk;
  const users = data?.epochs_by_pk?.circle?.users;

  const totalGive = users?.reduce(
    (total, { received_gifts: g }) =>
      total + g.reduce((userTotal, { tokens }) => userTotal + tokens, 0),
    0
  );

  const schema = z.object({
    amount: z.number(),
    selectedVaultId: z.string(),
  });
  type DistributionForm = z.infer<typeof schema>;
  const { register, handleSubmit, control } = useForm<DistributionForm>({
    resolver: zodResolver(schema),
  });

  let vaultOptions: Array<{ value: number; label: string; id: string }> = [];

  const onSubmit: SubmitHandler<DistributionForm> = async (value: any) => {
    setLoadingTrx(true);
    if (!users) throw new Error('No users found');

    const gifts = users.reduce((userList, user) => {
      const amount = user.received_gifts.reduce(
        (t, { tokens }) => t + tokens,
        0
      );
      if (amount > 0) userList[user.address] = amount;
      return userList;
    }, {} as Record<string, number>);

    assert(selectedVault && circle);
    const totalDistributionAmount = BigNumber.from(value.amount).mul(
      BigNumber.from(10).pow(selectedVault.decimals)
    );

    try {
      const vaultAddress = await getYVault();
      const distribution = createDistribution(gifts, totalDistributionAmount);
      const trx = await uploadEpochRoot(
        selectedVault.id,
        utils.formatBytes32String(circle.id.toString()),
        vaultAddress.toString(),
        distribution.merkleRoot,
        totalDistributionAmount,
        utils.hexlify(1)
      );

      if (trx) {
        setLoadingTrx(false);
        console.log(trx); // eslint-disable-line
      }
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

    if (!currentUser.isCircleAdmin || currentUser.role < 1)
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

  vaultOptions = vaults.map((vault, index) => ({
    value: index,
    label: vault.type,
    id: vault.id,
  }));

  return (
    <Box
      css={{
        display: 'flex',
        flexDirection: 'column',
        m: '$lg',
        margin: 'auto',
        maxWidth: '90%',
      }}
    >
      <Panel>
        <Box
          css={{
            display: 'flex',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
            mt: '$lg',
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
                  name={'selectedVaultId'}
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
                            setSelectedVault(vaults.find(v => v.id === value));
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
            <Button color="red" size="medium">
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
        <Box css={{ m: '$lg' }}>
          {totalGive ? (
            <AllocationTable
              users={users as IAllocateUser[]}
              totalAmountInVault={updateAmount}
              tokenName={
                selectedVaultId
                  ? vaults.find(vault => vault.id === selectedVaultId)?.type
                  : undefined
              }
              totalGive={totalGive}
            />
          ) : (
            <ShowMessage
              path={paths.getVaultsPath()}
              message="No GIVE was allocated for this epoch"
            />
          )}
        </Box>
      </Panel>
    </Box>
  );
}

export default DistributePage;
