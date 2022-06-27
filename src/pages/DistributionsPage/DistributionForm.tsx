import assert from 'assert';
import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { z } from 'zod';

import { FormControl, MenuItem, Select } from '@material-ui/core';

import { LoadingModal, ApeTextField } from 'components';
import { useApeSnackbar } from 'hooks';
import { Box, Button, Text } from 'ui';

import { getPreviousDistribution } from './queries';
import type { EpochDataResult, Gift } from './queries';
import { useSubmitDistribution } from './useSubmitDistribution';

const DistributionFormSchema = z.object({
  amount: z.number().gt(0),
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
  const [submitting, setSubmitting] = useState(false);
  const { showError } = useApeSnackbar();
  const submitDistribution = useSubmitDistribution();

  const circle = epoch?.circle;

  const { handleSubmit, control } = useForm<TDistributionForm>({
    defaultValues: {
      selectedVaultId: vaults[0]?.id,
      amount: 0,
    },
    resolver: zodResolver(DistributionFormSchema),
  });

  useEffect(() => {
    if (vaults[0]) setVaultId(String(vaults[0].id));
  }, [vaults]);

  const onSubmit: SubmitHandler<TDistributionForm> = async (value: any) => {
    assert(epoch?.id && circle);
    setSubmitting(true);
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

    try {
      await submitDistribution({
        amount: value.amount,
        vault,
        gifts,
        userIdsByAddress,
        previousDistribution: await getPreviousDistribution(
          circle.id,
          vault.id
        ),
        circleId: circle.id,
        epochId: epoch.id,
      });
      setSubmitting(false);
    } catch (e) {
      showError(e);
      console.error('DistributionsPage.onSubmit:', e);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box css={{ display: 'flex', justifyContent: 'center', pt: '$lg' }}>
        <Box css={{ mb: '$lg', mt: '$xs', mr: '$md', minWidth: '15vw' }}>
          <FormControl fullWidth>
            <Box
              css={{
                color: '$text',
                fontSize: '$medium',
                fontWeight: '$bold',
                lineHeight: '$shorter',
                marginBottom: '$md',
                textAlign: 'center',
              }}
            >
              Select coVault
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
                      label="coVault"
                      error={!!error}
                      disabled={submitting}
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
                          fontSize: '$small',
                          lineHeight: '$shorter',
                          fontWeight: '$semibold',
                          color: '$alert',
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
                disabled={submitting}
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
        <Button color="primary" outlined size="medium" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Distribution'}
        </Button>
      </Box>
      {submitting && <LoadingModal visible />}
    </form>
  );
}
