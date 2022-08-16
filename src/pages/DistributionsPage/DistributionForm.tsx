import assert from 'assert';
import React, { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { formatRelative, parseISO } from 'date-fns';
import { BigNumber, constants as ethersConstants } from 'ethers';
import { parseUnits, formatUnits } from 'ethers/lib/utils';
import { getWrappedAmount } from 'lib/vaults';
import { useForm, SubmitHandler, useController } from 'react-hook-form';
import { z } from 'zod';

import { DISTRIBUTION_TYPE } from '../../config/constants';
import { paths } from '../../routes/paths';
import { IUser } from '../../types';
import { numberWithCommas } from '../../utils';
import { LoadingModal, FormTokenField } from 'components';
import { useApeSnackbar, useContracts } from 'hooks';
import { AppLink, Box, Button, Flex, Panel, Select, Text } from 'ui';
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
  amount: z.string(),
  selectedVaultId: z.string(),
});

type TDistributionForm = z.infer<typeof DistributionFormSchema>;

type SubmitFormProps = {
  epoch: EpochDataResult;
  users: (Gift['recipient'] & { received: number })[];
  setAmount: (amount: string) => void;
  setGiftVaultId: (giftVaultId: string) => void;
  vaults: { id: number; symbol: string }[];
  circleUsers: IUser[];
  giftVaultId: string;
  formGiftAmount: string;
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
  setGiftVaultId,
  vaults,
  circleUsers,
  giftVaultId,
  formGiftAmount,
  refetch,
  circleDist,
  fixedDist,
}: SubmitFormProps) {
  const [giftSubmitting, setGiftSubmitting] = useState(false);
  const [fixedSubmitting, setFixedSubmitting] = useState(false);

  const [sufficientFixedPaymentTokens, setSufficientFixPaymentTokens] =
    useState(false);
  const [sufficientGiftTokens, setSufficientGiftTokens] = useState(false);
  const [maxGiftTokens, setMaxGiftTokens] = useState(ethersConstants.Zero);
  const [maxFixedPaymentTokens, setMaxFixedPaymentTokens] = useState(
    ethersConstants.Zero
  );

  const { showError } = useApeSnackbar();
  const submitDistribution = useSubmitDistribution();
  const contracts = useContracts();
  const circle = epoch.circle;
  assert(circle);
  const fixedPaymentTokenType = circle.fixed_payment_vault_id;
  const totalFixedPayment = circleUsers
    .map(g => g.fixed_payment_amount ?? 0)
    .reduce((total, tokens) => tokens + total, 0)
    .toString();
  const fpToken = fixedPaymentTokenType
    ? vaults.find(v => v.id === fixedPaymentTokenType)
    : undefined;
  const { handleSubmit, control, register, setValue } =
    useForm<TDistributionForm>({
      resolver: zodResolver(DistributionFormSchema),
      defaultValues: {
        selectedVaultId: vaults[0] ? vaults[0].id.toString() : undefined,
      },
    });

  const { field: amountField, fieldState: amountFieldState } = useController({
    name: 'amount',
    control,
    defaultValue: '0',
  });

  const { field: fixedAmountField, fieldState: fixedAmountFieldState } =
    useController({
      name: 'amount',
      control,
      defaultValue: '0',
    });

  useEffect(() => {
    if (circleDist) {
      updateBalanceState(
        circleDist.vault.id.toString(),
        circleDist.gift_amount.toString(),
        'gift'
      );
    } else if (vaults[0] && !giftVaultId) {
      setGiftVaultId(vaults[0].id.toString());
      updateBalanceState(vaults[0].id.toString(), formGiftAmount, 'gift');
    }
  }, [vaults]);

  useEffect(() => {
    if (fpToken)
      updateBalanceState(fpToken.id.toString(), totalFixedPayment, 'fixed');
  }, [fixedPaymentTokenType, totalFixedPayment]);

  const onFixedFormSubmit: SubmitHandler<TDistributionForm> = async (
    value: TDistributionForm
  ) => {
    assert(epoch?.id && circle);
    setFixedSubmitting(true);
    const vault = findVault({ vaultId: fpToken?.id.toString() });

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
      isCombinedDistribution() &&
      !circleDist &&
      BigNumber.from(formGiftAmount).gt(0)
        ? DISTRIBUTION_TYPE.COMBINED
        : DISTRIBUTION_TYPE.FIXED;
    const gifts = {} as Record<string, number>;
    if (type === DISTRIBUTION_TYPE.COMBINED) {
      users.forEach(user => {
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
            ? formatUnits(
                parseUnits(totalFixedPayment, vault.decimals).add(
                  parseUnits(formGiftAmount, vault.decimals)
                ),
                vault.decimals
              )
            : totalFixedPayment,
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
      setFixedSubmitting(false);

      // could be due to user cancellation
      if (!result) return;

      refetch();
      updateBalanceState(value.selectedVaultId, totalFixedPayment, 'fixed');
    } catch (e) {
      showError(e);
      console.error('DistributionsPage.onSubmit:', e);
      setFixedSubmitting(false);
    }
  };

  const findVault = ({ vaultId }: { vaultId: string | undefined }) => {
    return circle.organization?.vaults?.find(v => v.id.toString() === vaultId);
  };

  const onSubmit: SubmitHandler<TDistributionForm> = async (
    value: TDistributionForm
  ) => {
    assert(epoch?.id && circle);
    setGiftSubmitting(true);
    const vault = findVault({ vaultId: value.selectedVaultId });
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
      setGiftSubmitting(false);

      // could be due to user cancellation
      if (!result) return;

      refetch();
      updateBalanceState(value.selectedVaultId, value.amount, 'gift');
    } catch (e) {
      showError(e);
      console.error('DistributionsPage.onSubmit:', e);
      setGiftSubmitting(false);
    }
  };

  const getDecimals = ({
    distribution,
    vaultId,
  }: {
    distribution: EpochDataResult['distributions'][0] | undefined;
    vaultId: string | undefined;
  }) => {
    if (distribution) return distribution.vault.decimals;
    if (vaultId) {
      const v = findVault({ vaultId });
      if (v) return v.decimals;
    }
    return 0;
  };

  const getButtonText = (
    sufficientTokens: boolean,
    vaultId: string,
    amount: string,
    type: string
  ): string => {
    if (Number.parseFloat(amount) === 0) return `Please input a token amount`;
    if (!sufficientTokens) return 'Insufficient Tokens';
    if (
      (giftSubmitting && type === 'gift') ||
      (fixedSubmitting && type === 'fixed')
    )
      return 'Submitting...';
    return `Submit ${findVault({ vaultId })?.symbol} Vault Distribution`;
  };

  const isCombinedDistribution = () => {
    return (
      ((fixedDist && circleDist) || (!fixedDist && !circleDist)) &&
      giftVaultId &&
      fpToken &&
      fpToken.id.toString() === giftVaultId
    );
  };

  const updateBalanceState = async (
    vaultId: string,
    amountSet: string,
    formType: string
  ): Promise<void> => {
    assert(circle);
    const vault = findVault({ vaultId });
    assert(vault);
    const amountSetBN = parseUnits(amountSet || '0', vault.decimals);
    assert(contracts, 'This network is not supported');
    const tokenBalance = await contracts.getVaultBalance(vault);
    const isCombinedDist =
      // check if the two symbols are the same
      ((formType === 'gift' && fpToken?.id.toString() === vaultId) ||
        (formType === 'fixed' && giftVaultId === vaultId)) &&
      // check if a non combined distribution is selected
      ((!fixedDist && !circleDist) || (circleDist && fixedDist));
    const totalAmt: BigNumber = isCombinedDist
      ? amountSetBN.add(parseUnits(totalFixedPayment, vault.decimals))
      : amountSetBN;

    if (isCombinedDist) {
      setMaxGiftTokens(tokenBalance);
      setMaxFixedPaymentTokens(tokenBalance);
      setSufficientFixPaymentTokens(
        totalAmt.lte(tokenBalance) && totalAmt.gt(0)
      );
    } else if (formType === 'gift') {
      setSufficientGiftTokens(tokenBalance.gte(totalAmt) && totalAmt.gt(0));
      setMaxGiftTokens(tokenBalance);
      // if switching from combined dist selection to non combined
      // we need to recheck if the fixed payment have sufficient tokens
      if (fpToken?.id.toString() === vaultId)
        setSufficientFixPaymentTokens(
          maxFixedPaymentTokens.gte(totalFixedPayment) &&
            ethersConstants.Zero.lt(totalFixedPayment)
        );
    } else {
      setSufficientFixPaymentTokens(
        tokenBalance.gte(totalAmt) && totalAmt.gt(0)
      );
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
              <Select
                {...(register('selectedVaultId'),
                {
                  defaultValue: circleDist
                    ? circleDist.vault.symbol
                    : vaults[0]
                    ? vaults[0].id.toString()
                    : '',
                  label: 'CoVault',
                  disabled:
                    giftSubmitting || !!circleDist || vaults.length === 0,
                  onValueChange: value => {
                    setValue('selectedVaultId', value, {
                      shouldDirty: true,
                    });
                    setGiftVaultId(value);
                    updateBalanceState(value, formGiftAmount, 'gift');
                  },
                })}
                options={
                  vaults.length
                    ? vaults.map(t => {
                        return { value: t.id.toString(), label: t.symbol };
                      })
                    : [{ value: '', label: 'No Vaults Available' }]
                }
              ></Select>
            </Box>
            <Box css={{ width: '100%' }}>
              <FormTokenField
                {...amountField}
                symbol={findVault({ vaultId: giftVaultId })?.symbol || ''}
                decimals={getDecimals({
                  distribution: circleDist,
                  vaultId: giftVaultId,
                })}
                type="text"
                placeholder="0"
                error={!!amountFieldState.error}
                value={
                  circleDist
                    ? circleDist.gift_amount?.toString() || '0'
                    : amountField.value.toString()
                }
                disabled={giftSubmitting || !!circleDist || vaults.length === 0}
                max={formatUnits(
                  maxGiftTokens,
                  getDecimals({
                    distribution: circleDist,
                    vaultId: giftVaultId,
                  })
                )}
                prelabel="Budget Amount"
                infoTooltip={
                  <>
                    CoVault funds to be allocated to the distribution of this
                    gift circle.
                  </>
                }
                label={`Avail. ${numberWithCommas(
                  formatUnits(
                    maxGiftTokens,
                    getDecimals({
                      distribution: circleDist,
                      vaultId: giftVaultId,
                    })
                  )
                )} ${findVault({ vaultId: giftVaultId })?.symbol}`}
                onChange={value => {
                  amountField.onChange(value);
                  setAmount(value);
                  updateBalanceState(giftVaultId, value, 'gift');
                }}
                apeSize="small"
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
                    {renderCombinedSum(formGiftAmount, totalFixedPayment)}{' '}
                    {fpToken?.symbol}
                  </Text>
                );
              } else {
                return (
                  <Button
                    color="primary"
                    outlined
                    size="large"
                    disabled={giftSubmitting || !sufficientGiftTokens}
                    fullWidth
                  >
                    {getButtonText(
                      sufficientGiftTokens,
                      giftVaultId,
                      formGiftAmount,
                      'gift'
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
                  <Select
                    {...(register('selectedVaultId'),
                    {
                      defaultValue: fpToken
                        ? fixedDist
                          ? fixedDist.vault.id
                          : fpToken.id.toString()
                        : '',
                      disabled: true,
                      label: 'CoVault',
                    })}
                    options={
                      fpToken
                        ? [
                            {
                              value: fpToken.id.toString(),
                              label: fpToken.symbol,
                            },
                          ]
                        : [{ value: '', label: 'No Vaults Available' }]
                    }
                  ></Select>
                </Box>
                <Box css={{ width: '100%' }}>
                  <FormTokenField
                    {...fixedAmountField}
                    symbol={
                      fpToken
                        ? fixedDist
                          ? fixedDist.vault.symbol
                          : fpToken.symbol
                        : ''
                    }
                    decimals={getDecimals({
                      distribution: fixedDist,
                      vaultId: fpToken?.id.toString(),
                    })}
                    type="text"
                    placeholder="0"
                    error={!!fixedAmountFieldState.error}
                    value={
                      fixedDist
                        ? fixedDist.fixed_amount.toString()
                        : totalFixedPayment
                    }
                    disabled={true}
                    max={formatUnits(
                      maxFixedPaymentTokens,
                      getDecimals({
                        distribution: circleDist,
                        vaultId: fpToken?.id.toString(),
                      })
                    )}
                    prelabel={'Budget Amount'}
                    infoTooltip={
                      <>
                        CoVault funds to be allocated to the distribution of the
                        fixed payment.
                      </>
                    }
                    label={`Avail. ${numberWithCommas(
                      formatUnits(
                        maxFixedPaymentTokens,
                        getDecimals({
                          distribution: circleDist,
                          vaultId: fpToken?.id.toString(),
                        })
                      )
                    )} ${fpToken?.symbol}`}
                    onChange={() => {}}
                    apeSize="small"
                  />
                </Box>
              </TwoColumnLayout>

              {(giftSubmitting || fixedSubmitting) && <LoadingModal visible />}
            </>
          )}
        </Panel>
        {(fixedDist || circleDist) && <Summary distribution={fixedDist} />}
        <Flex css={{ justifyContent: 'center', mb: '$sm', height: '$2xl' }}>
          {(() => {
            if (!fixedDist) {
              if (fpToken) {
                return (
                  <Button
                    color="primary"
                    outlined
                    size="large"
                    disabled={fixedSubmitting || !sufficientFixedPaymentTokens}
                    fullWidth
                  >
                    {getButtonText(
                      sufficientFixedPaymentTokens,
                      fpToken?.id.toString(),
                      isCombinedDistribution()
                        ? renderCombinedSum(formGiftAmount, totalFixedPayment)
                        : totalFixedPayment,
                      'fixed'
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

const renderCombinedSum = (giftAmt: string, fixedAmt: string) =>
  formatUnits(parseUnits(giftAmt).add(parseUnits(fixedAmt)));

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
