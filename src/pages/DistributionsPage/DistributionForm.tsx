import assert from 'assert';
import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { BigNumber } from 'ethers';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { NavLink } from 'react-router-dom';
import { z } from 'zod';

import { FormControl, MenuItem, Select } from '@material-ui/core';

import { paths } from '../../routes/paths';
import { IUser } from '../../types';
import { LoadingModal, ApeTextField } from 'components';
import { useApeSnackbar, useContracts } from 'hooks';
import { Box, Button, Text } from 'ui';

import { getPreviousDistribution } from './queries';
import type { EpochDataResult, Gift } from './queries';
import { useSubmitDistribution } from './useSubmitDistribution';

const twoColStyle = {
  display: 'grid',
  width: '100%',
  'grid-template-columns': '1fr 1fr',
  'column-gap': '$sm',
};

const headerStyle = {
  fontSize: '$large',
  fontWeight: '$bold',
  marginBottom: '$md',
};

const vaultInputStyles = {
  color: '$text',
  fontSize: '$medium',
  fontWeight: '$bold',
  lineHeight: '$shorter',
  marginBottom: '$md',
  textAlign: 'center',
};

const DistributionFormSchema = z.object({
  amount: z.number().gte(0),
  selectedVaultId: z.number(),
});

type TDistributionForm = z.infer<typeof DistributionFormSchema>;

type SubmitFormProps = {
  epoch: EpochDataResult;
  users: (Gift['recipient'] & { received: number })[];
  setAmount: (amount: number) => void;
  setVaultId: (vaultId: string) => void;
  vaults: { id: number; symbol: string }[];
  circleUsers: IUser[];
  vault1Id: string;
  form1Amount: number;
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
  circleUsers,
  vault1Id,
  form1Amount,
}: SubmitFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [sufficientFixedPaymentTokens, setSufficientFixPaymentTokens] =
    useState(false);
  const [sufficientGiftTokens, setSufficientGiftTokens] = useState(false);
  const [maxGiftTokens, setMaxGiftTokens] = useState(0);
  const [maxFixedPaymentTokens, setMaxFixedPaymentTokens] = useState(0);

  const { showError } = useApeSnackbar();
  const submitDistribution = useSubmitDistribution();
  const contracts = useContracts();
  assert(epoch);
  const circle = epoch.circle;
  assert(circle);
  const fixed_payment_token_type = circle.fixed_payment_token_type;
  const totalFixedPayment = circleUsers
    .map(g => g.fixed_payment_amount ?? 0)
    .reduce((total, tokens) => tokens + total);
  const fixedPaymentTokenSel = fixed_payment_token_type
    ? vaults.filter(
        v => v.symbol.toLowerCase() === fixed_payment_token_type.toLowerCase()
      )
    : [];
  const { handleSubmit, control } = useForm<TDistributionForm>({
    defaultValues: {
      selectedVaultId: vaults[0]?.id,
      amount: 0,
    },
    resolver: zodResolver(DistributionFormSchema),
  });

  const circleDist = epoch.distributions.find(
    d => d.distribution_type === 1 || d.distribution_type === 3
  );
  const fixedDist = epoch.distributions.find(
    d => d.distribution_type === 2 || d.distribution_type === 3
  );

  useEffect(() => {
    if (circleDist) {
      updateBalanceState(circleDist.vault.id, circleDist.gift_amount, 'gift');
    } else if (vaults[0]) {
      setVaultId(String(vaults[0].id));
      updateBalanceState(vaults[0].id, form1Amount, 'gift');
    }
    if (fixedPaymentTokenSel[0])
      updateBalanceState(
        fixedPaymentTokenSel[0].id,
        totalFixedPayment,
        'fixed'
      );
  }, [vaults, fixedPaymentTokenSel, circleDist]);

  const onFixedFormSubmit: SubmitHandler<TDistributionForm> = async (
    value: any
  ) => {
    assert(epoch?.id && circle);
    setSubmitting(true);
    const vault = circle.organization?.vaults?.find(
      v => v.id === Number(value.selectedVaultId)
    );
    assert(vault);

    const gifts = circleUsers.reduce((ret, user) => {
      if (user.fixed_payment_amount && user.fixed_payment_amount > 0)
        ret[user.address] = user.fixed_payment_amount;
      return ret;
    }, {} as Record<string, number>);
    const type = isCombinedDistribution() && !circleDist ? 3 : 2;
    if (type === 3) {
      users.map(user => {
        if (!(user.address in gifts)) gifts[user.address] = 0;
        gifts[user.address] += user.received;
      });
    }
    const userIdsByAddress = circleUsers.reduce((ret, user) => {
      ret[user.address.toLowerCase()] = user.id;
      return ret;
    }, {} as Record<string, number>);

    try {
      await submitDistribution({
        amount:
          type === 3
            ? String(totalFixedPayment + form1Amount)
            : String(totalFixedPayment),
        vault,
        gifts,
        userIdsByAddress,
        previousDistribution: await getPreviousDistribution(
          circle.id,
          vault.id
        ),
        circleId: circle.id,
        epochId: epoch.id,
        fixedAmount: String(totalFixedPayment),
        giftAmount: type === 3 ? String(form1Amount) : '0',
        type,
      });
      setSubmitting(false);
    } catch (e) {
      showError(e);
      console.error('DistributionsPage.onSubmit:', e);
      setSubmitting(false);
    }
  };

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

    const profileIdsByAddress = users.reduce((ret, user) => {
      ret[user.address.toLowerCase()] = user.profile.id;
      return ret;
    }, {} as Record<string, number>);

    try {
      await submitDistribution({
        amount: value.amount,
        vault,
        gifts,
        profileIdsByAddress,
        previousDistribution: await getPreviousDistribution(
          circle.id,
          vault.id
        ),
        circleId: circle.id,
        epochId: epoch.id,
        fixedAmount: '0',
        giftAmount: value.amount,
        type: 1,
      });
      setSubmitting(false);
    } catch (e) {
      showError(e);
      console.error('DistributionsPage.onSubmit:', e);
      setSubmitting(false);
    }
  };

  const isCombinedDistribution = () => {
    return (
      fixedPaymentTokenSel.length &&
      vault1Id &&
      fixedPaymentTokenSel[0].id.toString() === vault1Id
    );
  };

  const updateBalanceState = async (
    vaultId: number,
    amountSet: number,
    formType: string
  ) => {
    assert(circle);
    const vault = circle.organization?.vaults?.find(v => v.id === vaultId);
    assert(vault);
    assert(contracts, 'This network is not supported');
    const cVault = await contracts.getVault(vault.vault_address);
    const tokenBalance = (await cVault.underlyingValue())
      .div(BigNumber.from(10).pow(vault.decimals))
      .toNumber();
    if (formType === 'gift') {
      setMaxGiftTokens(tokenBalance);
    } else {
      setMaxFixedPaymentTokens(tokenBalance);
    }
    const isCombinedDist =
      fixedPaymentTokenSel[0] && fixedPaymentTokenSel[0].id === vaultId;
    const totalAmt = isCombinedDist ? amountSet + totalFixedPayment : amountSet;
    if (formType === 'gift' && !isCombinedDist) {
      setSufficientGiftTokens(tokenBalance >= totalAmt);
      if (fixedPaymentTokenSel[0] && vaultId !== fixedPaymentTokenSel[0].id) {
        const fixedVault = circle.organization?.vaults?.find(
          v => v.id === fixedPaymentTokenSel[0].id
        );
        assert(fixedVault);
        const cVault = await contracts.getVault(fixedVault.vault_address);
        const tokenBalance = (await cVault.underlyingValue())
          .div(BigNumber.from(10).pow(fixedVault.decimals))
          .toNumber();
        setSufficientFixPaymentTokens(tokenBalance >= totalFixedPayment);
      }
    } else setSufficientFixPaymentTokens(tokenBalance >= totalAmt);
  };

  return (
    <Box css={twoColStyle}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box css={headerStyle}>Gift Circle</Box>
        <Box css={{ display: 'flex', justifyContent: 'center', pt: '$lg' }}>
          <Box css={{ mb: '$lg', mt: '$xs', mr: '$md', width: '100%' }}>
            <FormControl fullWidth>
              <Box css={vaultInputStyles}>Select Vault</Box>
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
                        value={circleDist ? circleDist.vault.id : value || ''}
                        label="coVault"
                        error={!!error}
                        disabled={submitting || !!circleDist}
                        onChange={({ target: { value } }) => {
                          onChange(value);
                          setVaultId(String(value));
                          updateBalanceState(
                            Number(value),
                            form1Amount,
                            'gift'
                          );
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
          <Box css={{ width: '100%' }}>
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
                  value={circleDist ? circleDist.gift_amount : value}
                  disabled={submitting || !!circleDist}
                  onChange={({ target: { value } }) => {
                    onChange(Number(value));
                  }}
                  onBlur={({ target: { value } }) => {
                    setAmount(Number(value));
                    updateBalanceState(Number(vault1Id), Number(value), 'gift');
                  }}
                  label={`Available: ${maxGiftTokens}`}
                  onFocus={event =>
                    (event.currentTarget as HTMLInputElement).select()
                  }
                />
              )}
            />
          </Box>
        </Box>
        {!circleDist && (
          <Box css={{ display: 'flex', justifyContent: 'center' }}>
            {isCombinedDistribution() ? (
              <span>
                Combined Distribution. Total {totalFixedPayment + form1Amount}{' '}
                {fixedPaymentTokenSel[0].symbol}
              </span>
            ) : (
              <Button
                color="primary"
                outlined
                size="medium"
                disabled={submitting || !sufficientGiftTokens}
                fullWidth
              >
                {sufficientGiftTokens
                  ? submitting
                    ? 'Submitting...'
                    : 'Submit Distribution'
                  : 'Insufficient Tokens'}
              </Button>
            )}
          </Box>
        )}
      </form>
      <form onSubmit={handleSubmit(onFixedFormSubmit)}>
        <Box css={twoColStyle}>
          <Box css={headerStyle}>Fixed Payment</Box>
          <Box css={{ textAlign: 'right' }}>
            <NavLink to={paths.circleAdmin(circle.id)}>Edit Settings</NavLink>
          </Box>
        </Box>

        {!fixed_payment_token_type ? (
          <Box css={{ opacity: '0.3', textAlign: 'center' }}>
            Fixed Payments are Disabled
          </Box>
        ) : (
          <Box>
            <Box css={{ display: 'flex', justifyContent: 'center', pt: '$lg' }}>
              <Box css={{ mb: '$lg', mt: '$xs', mr: '$md', width: '100%' }}>
                <FormControl fullWidth>
                  <Box css={vaultInputStyles}>Select Vault</Box>
                  <Controller
                    name="selectedVaultId"
                    control={control}
                    render={({ fieldState: { error } }) => {
                      return (
                        <>
                          <Select
                            value={
                              fixedPaymentTokenSel.length
                                ? fixedDist
                                  ? fixedDist.vault.id
                                  : fixedPaymentTokenSel[0].id
                                : '0'
                            }
                            label="coVault"
                            error={!!error}
                            disabled={true}
                          >
                            {fixedPaymentTokenSel.length ? (
                              fixedPaymentTokenSel.map(vault => (
                                <MenuItem key={vault.id} value={vault.id}>
                                  {vault.symbol}
                                </MenuItem>
                              ))
                            ) : (
                              <MenuItem key="0" value="0">
                                No Vault
                              </MenuItem>
                            )}
                          </Select>
                          {error && (
                            <Text
                              css={{
                                fontSize: '$small',
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
              <Box css={{ width: '100%' }}>
                <Controller
                  name={'amount'}
                  control={control}
                  render={({ fieldState: { error } }) => (
                    <ApeTextField
                      type="number"
                      error={!!error}
                      helperText={error ? error.message : null}
                      value={
                        fixedDist ? fixedDist.fixed_amount : totalFixedPayment
                      }
                      disabled={true}
                      label={`Available: ${maxFixedPaymentTokens}`}
                      onFocus={event =>
                        (event.currentTarget as HTMLInputElement).select()
                      }
                    />
                  )}
                />
              </Box>
            </Box>
            {!fixedDist && (
              <Box css={{ display: 'flex', justifyContent: 'center' }}>
                {fixedPaymentTokenSel.length ? (
                  <Button
                    color="primary"
                    outlined
                    size="medium"
                    disabled={submitting || !sufficientFixedPaymentTokens}
                    fullWidth
                  >
                    {sufficientFixedPaymentTokens
                      ? submitting
                        ? 'Submitting...'
                        : 'Submit Distribution'
                      : 'Insufficient Tokens'}
                  </Button>
                ) : (
                  <Button color="primary" outlined size="medium" fullWidth>
                    Export CSV
                  </Button>
                )}
              </Box>
            )}

            {submitting && <LoadingModal visible />}
          </Box>
        )}
      </form>
    </Box>
  );
}
