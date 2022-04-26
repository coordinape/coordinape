import assert from 'assert';
import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { z } from 'zod';

import { FormControl, MenuItem, Select } from '@material-ui/core';

import { ApeTextField } from 'components';
import { Box, Button, Text } from 'ui';

import { usePreviousDistributions } from './queries';
import type { EpochDataResult, Gift } from './queries';
import { useSubmitDistribution } from './useSubmitDistribution';
import type { SubmitDistribution } from './useSubmitDistribution';

const DistributionFormSchema = z.object({
  amount: z.number(),
  selectedVaultId: z.number(),
});

type TDistributionForm = z.infer<typeof DistributionFormSchema>;

type SubmitFormProps = {
  epoch: EpochDataResult;
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
export function DistributionForm({
  epoch,
  users,
  setAmount,
  setVaultId,
  vaults,
}: SubmitFormProps) {
  const [loadingTrx, setLoadingTrx] = useState(false);

  const submitDistribution = useSubmitDistribution();

  // FIXME don't load this data until the form is ready to be submitted
  const {
    data: prev,
    isLoading,
    isError,
  } = usePreviousDistributions(epoch?.circle?.id);

  const circle = epoch?.circle;

  const { handleSubmit, control } = useForm<TDistributionForm>({
    defaultValues: {
      selectedVaultId: vaults[0].id,
      amount: 0,
    },
    resolver: zodResolver(DistributionFormSchema),
  });

  useEffect(() => {
    setVaultId(String(vaults[0].id));
  }, [vaults]);

  const onSubmit: SubmitHandler<TDistributionForm> = async (value: any) => {
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
                onFocus={event =>
                  (event.currentTarget as HTMLInputElement).select()
                }
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
