import assert from 'assert';
import React, { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { formatRelative, parseISO } from 'date-fns';
import { BigNumber } from 'ethers';
import { getWrappedAmount } from 'lib/vaults';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { z } from 'zod';

import { FormControl } from '@material-ui/core';

import { DISTRIBUTION_TYPE } from '../../config/constants';
import { paths } from '../../routes/paths';
import { IUser } from '../../types';
import { numberWithCommas } from '../../utils';
import { LoadingModal, FormTokenField, FormAutocomplete } from 'components';
import { useApeSnackbar, useContracts } from 'hooks';
import { AppLink, Box, Button, Flex, Panel, Text } from 'ui';
import { TwoColumnLayout } from 'ui/layouts';
import { makeExplorerUrl } from 'utils/provider';

import { getPreviousDistribution } from './queries';
import type { EpochDataResult, Gift } from './queries';
import { useSubmitDistribution } from './useSubmitDistribution';

const headerStyle = {
  fontWeight: '$bold',
  color: '$headingText',
};

const DistributionFormSchema = z.object({
  amount: z.number().gte(0),
  selectedVaultSymbol: z.string(),
});

type TDistributionForm = z.infer<typeof DistributionFormSchema>;

type SubmitFormProps = {
  epoch: EpochDataResult;
  users: (Gift['recipient'] & { received: number })[];
  setAmount: (amount: number) => void;
  setGiftVaultSymbol: (giftVaultSymbol: string) => void;
  vaults: { id: number; symbol: string }[];
  circleUsers: IUser[];
  giftVaultSymbol: string;
  formGiftAmount: number;
  refetch: () => void;
  circleDist: EpochDataResult['distributions'][0] | undefined;
  fixedDist: EpochDataResult['distributions'][0] | undefined;
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
  setGiftVaultSymbol,
  vaults,
  circleUsers,
  giftVaultSymbol,
  formGiftAmount,
  refetch,
  circleDist,
  fixedDist,
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
  const circle = epoch.circle;
  assert(circle);
  const fixedPaymentTokenType = circle.fixed_payment_token_type;
  const totalFixedPayment = circleUsers
    .map(g => g.fixed_payment_amount ?? 0)
    .reduce((total, tokens) => tokens + total);
  const fpTokenSymbol = fixedPaymentTokenType
    ? vaults.find(
        v => v.symbol.toLowerCase() === fixedPaymentTokenType.toLowerCase()
      )?.symbol
    : undefined;
  const { handleSubmit, control } = useForm<TDistributionForm>({
    defaultValues: {
      selectedVaultSymbol: vaults[0]?.symbol,
      amount: 0,
    },
    resolver: zodResolver(DistributionFormSchema),
  });

  useEffect(() => {
    if (circleDist) {
      updateBalanceState(
        circleDist.vault.symbol,
        circleDist.gift_amount,
        'gift'
      );
    } else if (vaults[0] && !giftVaultSymbol) {
      setGiftVaultSymbol(String(vaults[0].symbol));
      updateBalanceState(vaults[0].symbol, formGiftAmount, 'gift');
    }
  }, [vaults]);

  useEffect(() => {
    if (fpTokenSymbol)
      updateBalanceState(fpTokenSymbol, totalFixedPayment, 'fixed');
  }, [fixedPaymentTokenType, totalFixedPayment]);

  const onFixedFormSubmit: SubmitHandler<TDistributionForm> = async (
    value: TDistributionForm
  ) => {
    assert(epoch?.id && circle);
    setSubmitting(true);
    const vault = findVault({ symbol: value.selectedVaultSymbol });
    assert(vault);
    assert(contracts, 'This network is not supported');

    // compute wrapped amounts for fixed gifts
    const fixedGiftsArray: [string, BigNumber][] = await Promise.all(
      circleUsers.map(async (user): Promise<[string, BigNumber]> => {
        const amt = user.fixed_payment_amount || 0;
        const wrappedAmount = await getWrappedAmount(
          amt.toString(),
          vault,
          contracts
        );
        return [user.address, wrappedAmount];
      })
    );

    // marshall fixed gifts into an object
    const fixedGifts = await fixedGiftsArray.reduce(
      (ret, [userAddress, amount]) => {
        if (amount.gt(0)) ret[userAddress] = amount;
        return ret;
      },
      {} as Record<string, BigNumber>
    );
    const type =
      isCombinedDistribution() && !circleDist && formGiftAmount > 0
        ? DISTRIBUTION_TYPE.COMBINED
        : DISTRIBUTION_TYPE.FIXED;
    const gifts = {} as Record<string, number>;
    if (type === DISTRIBUTION_TYPE.COMBINED) {
      users.map(user => {
        if (!(user.address in gifts)) gifts[user.address] = 0;
        gifts[user.address] += user.received;
      });
    }

    const profileIdsByAddress = circleUsers.reduce((ret, user) => {
      if (user.profile) ret[user.address.toLowerCase()] = user.profile.id;
      return ret;
    }, {} as Record<string, number>);
    try {
      const result = await submitDistribution({
        amount:
          type === DISTRIBUTION_TYPE.COMBINED
            ? String(totalFixedPayment + formGiftAmount)
            : String(totalFixedPayment),
        vault,
        gifts,
        fixedGifts,
        profileIdsByAddress,
        previousDistribution: await getPreviousDistribution(
          circle.id,
          vault.id
        ),
        circleId: circle.id,
        epochId: epoch.id,
        fixedAmount: String(totalFixedPayment),
        giftAmount:
          type === DISTRIBUTION_TYPE.COMBINED ? String(formGiftAmount) : '0',
        type,
      });
      setSubmitting(false);

      // could be due to user cancellation
      if (!result) return;

      refetch();
      updateBalanceState(value.selectedVaultSymbol, totalFixedPayment, 'fixed');
    } catch (e) {
      showError(e);
      console.error('DistributionsPage.onSubmit:', e);
      setSubmitting(false);
    }
  };

  const findVault = ({
    vaultId,
    symbol,
  }: {
    vaultId?: number | undefined;
    symbol?: string | undefined;
  }) => {
    return circle.organization?.vaults?.find(v =>
      vaultId ? v.id === vaultId : v.symbol === symbol
    );
  };

  const onSubmit: SubmitHandler<TDistributionForm> = async (
    value: TDistributionForm
  ) => {
    assert(epoch?.id && circle);
    setSubmitting(true);
    const vault = findVault({ symbol: value.selectedVaultSymbol });
    assert(vault);

    const gifts = users.reduce((ret, user) => {
      ret[user.address] = user.received;
      return ret;
    }, {} as Record<string, number>);

    const profileIdsByAddress = circleUsers.reduce((ret, user) => {
      if (user.profile) ret[user.address.toLowerCase()] = user.profile.id;
      return ret;
    }, {} as Record<string, number>);

    try {
      const result = await submitDistribution({
        amount: value.amount.toString(),
        vault,
        gifts,
        fixedGifts: {},
        profileIdsByAddress,
        previousDistribution: await getPreviousDistribution(
          circle.id,
          vault.id
        ),
        circleId: circle.id,
        epochId: epoch.id,
        fixedAmount: '0',
        giftAmount: value.amount.toString(),
        type: DISTRIBUTION_TYPE.GIFT,
      });
      setSubmitting(false);

      // could be due to user cancellation
      if (!result) return;

      refetch();
      updateBalanceState(value.selectedVaultSymbol, value.amount, 'gift');
    } catch (e) {
      showError(e);
      console.error('DistributionsPage.onSubmit:', e);
      setSubmitting(false);
    }
  };

  const getDecimals = ({
    distribution,
    symbol,
  }: {
    distribution: EpochDataResult['distributions'][0] | undefined;
    symbol: string | undefined;
  }) => {
    if (distribution) return distribution.vault.decimals;
    if (symbol) {
      const v = findVault({ symbol });
      if (v) return v.decimals;
    }
    return 0;
  };

  const getButtonText = (
    sufficientTokens: boolean,
    symbol: string,
    amount: number
  ): string => {
    if (amount === 0) return `Please input a token amount`;
    if (!sufficientTokens) return 'Insufficient Tokens';
    if (submitting) return 'Submitting...';
    return `Submit ${symbol} Vault Distribution`;
  };

  const isCombinedDistribution = () => {
    return (
      ((fixedDist && circleDist) || (!fixedDist && !circleDist)) &&
      giftVaultSymbol &&
      fpTokenSymbol === giftVaultSymbol
    );
  };

  const updateBalanceState = async (
    symbol: string,
    amountSet: number,
    formType: string
  ): Promise<void> => {
    assert(circle);
    const vault = findVault({ symbol });
    assert(contracts, 'This network is not supported');
    const tokenBalance = vault
      ? (await contracts.getVaultBalance(vault))
          .div(BigNumber.from(10).pow(vault.decimals))
          .toNumber()
      : 0;
    const isCombinedDist =
      // check if the two symbols are the same
      ((formType === 'gift' && fpTokenSymbol === symbol) ||
        (formType === 'fixed' && giftVaultSymbol === symbol)) &&
      // check if a non combined distribution is selected
      ((!fixedDist && !circleDist) || (circleDist && fixedDist));
    const totalAmt = isCombinedDist ? amountSet + totalFixedPayment : amountSet;

    if (isCombinedDist) {
      setMaxGiftTokens(tokenBalance);
      setMaxFixedPaymentTokens(tokenBalance);
      setSufficientFixPaymentTokens(tokenBalance >= totalAmt && totalAmt > 0);
    } else if (formType === 'gift') {
      setSufficientGiftTokens(tokenBalance >= totalAmt && totalAmt > 0);
      setMaxGiftTokens(tokenBalance);
      // if switching from combined dist selection to non combined
      // we need to recheck if the fixed payment have sufficient tokens
      if (fpTokenSymbol === giftVaultSymbol)
        setSufficientFixPaymentTokens(
          maxFixedPaymentTokens >= totalFixedPayment && totalFixedPayment > 0
        );
    } else {
      setSufficientFixPaymentTokens(tokenBalance >= totalAmt && totalAmt > 0);
      setMaxFixedPaymentTokens(tokenBalance);
    }
  };

  return (
    <TwoColumnLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Panel css={{ padding: '$md', minHeight: '147px', mb: '$lg' }}>
          <Text h2 css={headerStyle}>
            Gift Circle
          </Text>
          <TwoColumnLayout css={{ pt: '$md' }}>
            <Box css={{ width: '100%' }}>
              <FormControl fullWidth>
                <Controller
                  name="selectedVaultSymbol"
                  control={control}
                  render={({ field: { onChange }, fieldState: { error } }) => (
                    <>
                      <FormAutocomplete
                        value={
                          circleDist
                            ? circleDist.vault.symbol
                            : vaults.length
                            ? giftVaultSymbol
                            : 'No Vaults Available'
                        }
                        label="CoVault"
                        error={!!error}
                        disabled={
                          submitting || !!circleDist || vaults.length === 0
                        }
                        isSelect={true}
                        options={vaults.length ? vaults.map(t => t.symbol) : []}
                        onChange={val => {
                          onChange(val);
                          if (vaults.some(v => v.symbol === val)) {
                            setGiftVaultSymbol(val);
                            updateBalanceState(val, formGiftAmount, 'gift');
                          }
                        }}
                      />
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
                  )}
                />
              </FormControl>
            </Box>
            <Box css={{ width: '100%' }}>
              <Controller
                name="amount"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <FormTokenField
                    symbol={giftVaultSymbol}
                    decimals={getDecimals({
                      distribution: circleDist,
                      symbol: giftVaultSymbol,
                    })}
                    type="number"
                    error={!!error}
                    value={circleDist ? circleDist.gift_amount : value}
                    disabled={submitting || !!circleDist || vaults.length === 0}
                    max={Number(maxGiftTokens)}
                    prelabel="Budget Amount"
                    infoTooltip={
                      <>
                        CoVault funds to be allocated to the distribution of
                        this gift circle.
                      </>
                    }
                    label={`Avail. ${numberWithCommas(
                      maxGiftTokens
                    )} ${giftVaultSymbol}`}
                    onChange={value => {
                      onChange(value);
                      setAmount(value);
                      updateBalanceState(giftVaultSymbol, value, 'gift');
                    }}
                    apeSize="small"
                  />
                )}
              />
            </Box>
          </TwoColumnLayout>
        </Panel>
        {(fixedDist || circleDist) && <Summary distribution={circleDist} />}
        <Flex css={{ justifyContent: 'center', mb: '$sm', height: '$2xl' }}>
          {(() => {
            if (!circleDist) {
              if (isCombinedDistribution()) {
                return (
                  <Text css={{ fontSize: '$small' }}>
                    Combined Distribution. Total{' '}
                    {totalFixedPayment + formGiftAmount} {fpTokenSymbol}
                  </Text>
                );
              } else {
                return (
                  <Button
                    color="primary"
                    outlined
                    size="large"
                    disabled={submitting || !sufficientGiftTokens}
                    fullWidth
                  >
                    {getButtonText(
                      sufficientGiftTokens,
                      giftVaultSymbol,
                      formGiftAmount
                    )}
                  </Button>
                );
              }
            } else {
              return <EtherscanButton distribution={circleDist} />;
            }
          })()}
        </Flex>
      </form>

      <form onSubmit={handleSubmit(onFixedFormSubmit)}>
        <Panel css={{ padding: '$md', minHeight: '147px', mb: '$lg' }}>
          <Flex>
            <Text h2 css={{ ...headerStyle, flexGrow: 1 }}>
              Fixed Payments
            </Text>
            <Box css={{ fontSize: '$small', alignSelf: 'center' }}>
              <AppLink
                to={paths.circleAdmin(circle.id)}
                css={{ textDecoration: 'none' }}
              >
                <Text css={{ color: '$primary' }}>Edit Settings</Text>
              </AppLink>
            </Box>
          </Flex>

          {!fixedPaymentTokenType ? (
            <Box
              css={{
                pt: '$lg',
                pb: '$lg',
                mt: '$md',
                textAlign: 'center',
                fontSize: '$small',
                color: '$neutral',
              }}
            >
              Fixed Payments are Disabled
            </Box>
          ) : (
            <>
              <TwoColumnLayout css={{ pt: '$md' }}>
                <Box css={{ width: '100%' }}>
                  <FormControl fullWidth>
                    <Controller
                      name="selectedVaultSymbol"
                      control={control}
                      render={({ fieldState: { error } }) => (
                        <>
                          <FormAutocomplete
                            value={
                              fpTokenSymbol
                                ? fixedDist
                                  ? fixedDist.vault.symbol
                                  : fpTokenSymbol
                                : 'No Vaults Available'
                            }
                            label="CoVault"
                            error={!!error}
                            disabled={true}
                            isSelect={true}
                            options={[
                              fpTokenSymbol ? fpTokenSymbol : 'No Vault',
                            ]}
                          />

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
                      )}
                    />
                  </FormControl>
                </Box>
                <Box css={{ width: '100%' }}>
                  <Controller
                    name="amount"
                    control={control}
                    render={({ fieldState: { error } }) => (
                      <FormTokenField
                        symbol={
                          fpTokenSymbol
                            ? fixedDist
                              ? fixedDist.vault.symbol
                              : fpTokenSymbol
                            : ''
                        }
                        decimals={getDecimals({
                          distribution: fixedDist,
                          symbol: fpTokenSymbol,
                        })}
                        type="number"
                        error={!!error}
                        value={
                          fixedDist ? fixedDist.fixed_amount : totalFixedPayment
                        }
                        disabled={true}
                        max={Number(maxFixedPaymentTokens)}
                        prelabel={'Budget Amount'}
                        infoTooltip={
                          <>
                            CoVault funds to be allocated to the distribution of
                            the fixed payment.
                          </>
                        }
                        label={`Avail. ${numberWithCommas(
                          maxFixedPaymentTokens
                        )} ${fpTokenSymbol || ''}`}
                        onChange={() => {}}
                        apeSize="small"
                      />
                    )}
                  />
                </Box>
              </TwoColumnLayout>

              {submitting && <LoadingModal visible />}
            </>
          )}
        </Panel>
        {(fixedDist || circleDist) && <Summary distribution={fixedDist} />}
        <Flex css={{ justifyContent: 'center', mb: '$sm', height: '$2xl' }}>
          {(() => {
            if (!fixedDist) {
              if (fpTokenSymbol) {
                return (
                  <Button
                    color="primary"
                    outlined
                    size="large"
                    disabled={submitting || !sufficientFixedPaymentTokens}
                    fullWidth
                  >
                    {getButtonText(
                      sufficientFixedPaymentTokens,
                      fpTokenSymbol,
                      isCombinedDistribution()
                        ? totalFixedPayment + formGiftAmount
                        : totalFixedPayment
                    )}
                  </Button>
                );
              }
            } else {
              return <EtherscanButton distribution={fixedDist} />;
            }
          })()}
        </Flex>
      </form>
    </TwoColumnLayout>
  );
}

const Summary = ({
  distribution,
}: {
  distribution: EpochDataResult['distributions'][0] | undefined;
}) => {
  return (
    <Flex
      css={{
        justifyContent: 'center',
        height: '$lg',
        fontSize: '$small',
        mb: '$lg',
      }}
    >
      {distribution && (
        <Text css={{ color: '$primary' }}>
          Distribution completed{' '}
          {formatRelative(parseISO(distribution.created_at + 'Z'), Date.now())}
        </Text>
      )}
    </Flex>
  );
};

const EtherscanButton = ({
  distribution,
}: {
  distribution: EpochDataResult['distributions'][0];
}) => {
  const explorerHref = makeExplorerUrl(
    distribution.vault.chain_id,
    distribution.tx_hash
  );
  return (
    <Button
      type="button"
      color="primary"
      outlined
      size="large"
      fullWidth
      as="a"
      target="_blank"
      href={explorerHref}
    >
      View on Etherscan
    </Button>
  );
};
