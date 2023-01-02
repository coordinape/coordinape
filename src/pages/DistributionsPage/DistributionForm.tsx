import assert from 'assert';
import React, { useEffect, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { formatRelative, parseISO } from 'date-fns';
import { BigNumber, constants as ethersConstants } from 'ethers';
import { parseUnits, formatUnits, commify } from 'ethers/lib/utils';
import { INTEGRATION_TYPE as HEDGEY } from 'lib/hedgey';
import {
  getVaultSymbolAddressString,
  getWrappedAmount,
  removeYearnPrefix,
} from 'lib/vaults';
import round from 'lodash/round';
import { useForm, SubmitHandler, useController } from 'react-hook-form';
import { z } from 'zod';

import { DebugLogger } from '../../common-lib/log';
import { DISTRIBUTION_TYPE } from '../../config/constants';
import { paths } from '../../routes/paths';
import { IUser } from '../../types';
import {
  LoadingModal,
  FormTokenField,
  zTokenString,
  FormInputField,
} from 'components';
import { useApeSnackbar, useContracts } from 'hooks';
import { useCurrentCircleIntegrations } from 'hooks/gql/useCurrentCircleIntegrations';
import { hedgeyLockPeriods } from 'pages/CircleAdminPage/HedgeyIntegrationSettings';
import {
  AppLink,
  Box,
  Button,
  Flex,
  Panel,
  Select,
  SelectOption,
  Text,
} from 'ui';
import { TwoColumnLayout } from 'ui/layouts';
import { makeExplorerUrl } from 'utils/provider';

import {
  getPreviousDistribution,
  getPreviousLockedTokenDistribution,
} from './queries';
import type { EpochDataResult, Gift } from './queries';
import { useLockedTokenDistribution } from './useLockedTokenDistributions';
import { useSubmitDistribution } from './useSubmitDistribution';
import { mapProfileIdsByAddress } from './utils';

const logger = new DebugLogger('DistributionForm');

const headerStyle = {
  fontWeight: '$bold',
  color: '$headingText',
};

const vaultSelectionPanel = {
  padding: '$md',
  minHeight: '11rem',
  mb: '$lg',
};

const { Zero } = ethersConstants;

type SubmitFormProps = {
  epoch: EpochDataResult;
  users: (Gift['recipient'] & { received: number })[];
  setAmount: (amount: string) => void;
  setGiftVaultId: (giftVaultId: string) => void;
  vaults: {
    id: number;
    symbol: string;
    vault_address: string;
    simple_token_address: string;
  }[];
  circleUsers: IUser[];
  giftVaultId: string;
  formGiftAmount: string;
  refetch: () => void;
  circleDist: EpochDataResult['distributions'][0] | undefined;
  fixedDist: EpochDataResult['distributions'][0] | undefined;
  totalGive: number;
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
  totalGive,
}: SubmitFormProps) {
  const [giftSubmitting, setGiftSubmitting] = useState(false);
  const [fixedSubmitting, setFixedSubmitting] = useState(false);

  const [previousLockedTokenDistribution, setPreviousLockedTokenDistribution] =
    useState({} as any);

  const loadPreviousLockedTokenDistribution = () => {
    getPreviousLockedTokenDistribution(epoch.id).then(result =>
      setPreviousLockedTokenDistribution(result)
    );
  };

  useEffect(() => {
    loadPreviousLockedTokenDistribution();
  }, [epoch]);

  const [sufficientFixedPaymentTokens, setSufficientFixPaymentTokens] =
    useState(false);
  const [sufficientGiftTokens, setSufficientGiftTokens] = useState(false);
  const [maxGiftTokens, setMaxGiftTokens] = useState<BigNumber>();
  const [maxFixedPaymentTokens, setMaxFixedPaymentTokens] =
    useState<BigNumber>();

  const { showError } = useApeSnackbar();
  const submitDistribution = useSubmitDistribution();
  const lockedTokenDistribution = useLockedTokenDistribution();
  const contracts = useContracts();
  const circle = epoch.circle;
  assert(circle);
  const fixedPaymentVaultId = circle.fixed_payment_vault_id;
  const totalFixedPayment = circleUsers
    .map(g => g.fixed_payment_amount ?? 0)
    .reduce((total, tokens) => tokens + total, 0)
    .toString();

  const [isUsingHedgey, setIsUsingHedgey] = useState(false);

  const findVault = (vaultId: string | undefined) =>
    circle.organization?.vaults?.find(v => v.id.toString() === vaultId);

  const fpVault = findVault(fixedPaymentVaultId?.toString());

  const giftDecimals = findVault(giftVaultId)?.decimals || 0;
  const DistributionFormSchema = z.object({
    amount: zTokenString(
      '0',
      formatUnits(maxGiftTokens || Zero, giftDecimals),
      giftDecimals
    ),
    selectedVaultId: z.string().optional(),
    selectedHedgeyVaultId: z.string().optional(),
    hedgeyLockPeriod: z.string().optional(),
    hedgeyTransferable: z.string().optional(),
    tokenContractAddress: z.string(),
  });

  const FixedDistributionFormSchema = z.object({
    amount: z.string(),
    selectedVaultId: z.string(),
  });
  type TDistributionForm = z.infer<typeof DistributionFormSchema>;
  type TFixedDistributionForm = z.infer<typeof FixedDistributionFormSchema>;
  const {
    handleSubmit,
    control,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TDistributionForm>({
    mode: 'all',
    resolver: zodResolver(DistributionFormSchema),
    defaultValues: {
      selectedVaultId: vaults[0] ? vaults[0].id.toString() : undefined,
      selectedHedgeyVaultId: vaults[0] ? vaults[0].id.toString() : undefined,
    },
  });

  const {
    handleSubmit: fixedHandleSubmit,
    control: fixedControl,
    register: fixedRegister,
  } = useForm<TFixedDistributionForm>({
    resolver: zodResolver(FixedDistributionFormSchema),
    defaultValues: {
      selectedVaultId: vaults[0] ? vaults[0].id.toString() : undefined,
    },
  });

  const { field: amountField } = useController({
    name: 'amount',
    control,
    defaultValue: '0',
  });

  const { field: fixedAmountField } = useController({
    name: 'amount',
    control: fixedControl,
    defaultValue: '0',
  });

  const { field: tokenContractAddress } = useController({
    name: 'tokenContractAddress',
    control,
    defaultValue: '',
  });

  const selectedHedgeyVaultId = watch('selectedHedgeyVaultId');

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (circleDist) {
      setGiftVaultId(circleDist.vault.id.toString());
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
    if (fpVault)
      updateBalanceState(fpVault.id.toString(), totalFixedPayment, 'fixed');
  }, [fixedPaymentVaultId, totalFixedPayment]);

  const integrations = useCurrentCircleIntegrations();

  const hedgeyIntegration = integrations?.data?.find(i => i.type === HEDGEY);

  const [customToken, setCustomToken] = useState<{
    symbol: string;
    decimals: number;
    address: string;
    availableBalance: number | BigNumber;
  }>();

  useEffect(() => {
    if (
      !tokenContractAddress.value ||
      tokenContractAddress.value.toLowerCase() === customToken?.address
    )
      return;
    const getTokenDetails = async () => {
      const tokenContract = contracts?.getERC20(tokenContractAddress.value);
      if (!tokenContract) return;
      const tokenDecimals = await tokenContract.decimals();
      const tokenSymbol = await tokenContract.symbol();
      const availableBalance =
        (contracts &&
          (await tokenContract.balanceOf(await contracts.getMyAddress()))) ||
        0;
      setCustomToken({
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        address: tokenContractAddress.value.toLowerCase(),
        availableBalance,
      });
    };
    getTokenDetails();
  }, [tokenContractAddress]);

  const onFixedFormSubmit: SubmitHandler<TFixedDistributionForm> = async () => {
    assert(epoch?.id && circle);
    setFixedSubmitting(true);
    const vault = fpVault;
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
      isCombinedDistribution() && !circleDist && Number(formGiftAmount) > 0
        ? DISTRIBUTION_TYPE.COMBINED
        : DISTRIBUTION_TYPE.FIXED;
    const gifts = {} as Record<string, number>;
    if (type === DISTRIBUTION_TYPE.COMBINED) {
      users.forEach(user => {
        if (!(user.address in gifts)) gifts[user.address] = 0;
        gifts[user.address] += user.received;
      });
    }

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
        profileIdsByAddress: mapProfileIdsByAddress(circleUsers),
        previousDistribution: await getPreviousDistribution(
          circle.id,
          vault.id
        ),
        circleId: circle.id,
        description: `Submit Distribution for ${circle.name}: ${
          epoch.description ?? `Epoch ${epoch.number}`
        }`,
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
      updateBalanceState(vault.id.toString(), totalFixedPayment, 'fixed');
    } catch (e) {
      showError(e);
      console.error('DistributionsPage.onSubmit:', e);
      setFixedSubmitting(false);
    }
  };

  const onSubmit: SubmitHandler<TDistributionForm> = async (
    value: TDistributionForm
  ) => {
    assert(epoch?.id && circle);
    setGiftSubmitting(true);
    const vault = findVault(value.selectedVaultId);
    logger.log(
      `onSubmit: [${value.selectedVaultId}, ${value.tokenContractAddress}]`
    );

    let result;

    const gifts = users.reduce((ret, user) => {
      ret[user.address] = user.received;
      return ret;
    }, {} as Record<string, number>);

    if (isUsingHedgey) {
      const hedgeyVault = findVault(value.selectedHedgeyVaultId);
      try {
        result = await lockedTokenDistribution({
          amount: value.amount.toString(),
          tokenContractAddress: value.tokenContractAddress?.toString(),
          gifts,
          vault: hedgeyVault,
          hedgeyLockPeriod: value.hedgeyLockPeriod,
          hedgeyTransferable: value.hedgeyTransferable,
          epochId: epoch.id,
          circleId: circle.id,
          totalGive,
        });
      } catch (err) {
        showError(err);
        console.error('DistributionsPage.onSubmit:', err);
        setGiftSubmitting(false);
      }

      setGiftSubmitting(false);

      // could be due to user cancellation
      if (!result) return;

      loadPreviousLockedTokenDistribution();
      refetch();
      return;
    }

    assert(vault);
    try {
      const result = await submitDistribution({
        amount: value.amount.toString(),
        vault,
        gifts,
        fixedGifts: {},
        profileIdsByAddress: mapProfileIdsByAddress(circleUsers),
        previousDistribution: await getPreviousDistribution(
          circle.id,
          vault.id
        ),
        circleId: circle.id,
        description: `Submit Distribution for ${circle.name}: Epoch ${epoch.number}`,
        epochId: epoch.id,
        fixedAmount: '0',
        giftAmount: value.amount.toString(),
        type: DISTRIBUTION_TYPE.GIFT,
      });
      setGiftSubmitting(false);

      // could be due to user cancellation
      if (!result) return;

      refetch();
      updateBalanceState(vault.id.toString(), value.amount, 'gift');
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
      const v = findVault(vaultId);
      if (v) return v.decimals;
    }
    return 0;
  };

  const getButtonText = (
    sufficientTokens: boolean,
    vaultId: string,
    amount: string,
    type: 'fixed' | 'gift' | 'combined'
  ): string => {
    if (Number.parseFloat(amount) === 0) {
      return type === 'fixed'
        ? 'No users have fixed payments'
        : `Please input a token amount`;
    }
    if (!sufficientTokens) return 'Insufficient tokens';
    if (
      (giftSubmitting && type === 'gift') ||
      (fixedSubmitting && type === 'fixed')
    )
      return 'Submitting...';
    return `Submit ${findVault(vaultId)?.symbol} Vault Distribution`;
  };

  const isCombinedDistribution = () => {
    if (isUsingHedgey) {
      return false;
    }
    return (
      ((fixedDist && circleDist) || (!fixedDist && !circleDist)) &&
      giftVaultId &&
      fpVault?.id.toString() === giftVaultId
    );
  };

  const updateBalanceStateWhenUsingCustomToken = (amountSet: string) => {
    const amountSetBN = parseUnits(amountSet || '0', customToken?.decimals);
    assert(contracts, 'This network is not supported');
    const tokenBalance: BigNumber = BigNumber.from(
      customToken?.availableBalance || 0
    );

    const totalAmt: BigNumber = amountSetBN;
    setSufficientGiftTokens(tokenBalance.gte(totalAmt) && totalAmt.gt(0));
    setMaxGiftTokens(tokenBalance);
  };

  const updateBalanceState = async (
    vaultId: string,
    amountSet: string,
    formType: string
  ): Promise<void> => {
    if (!mounted.current) return;
    function calculateIfCombinedDist() {
      if (isUsingHedgey) {
        return false;
      }
      return (
        // check if the two symbols are the same
        ((formType === 'gift' && fpVault?.id.toString() === vaultId) ||
          (formType === 'fixed' && giftVaultId === vaultId)) &&
        // check if a non combined distribution is selected
        ((!fixedDist && !circleDist) || (circleDist && fixedDist))
      );
    }
    assert(circle);
    const vault = findVault(vaultId);
    // If we're using hedgey with a custom token from a wallet
    if (
      isUsingHedgey &&
      vaultId === '0' &&
      customToken &&
      formType === 'gift'
    ) {
      updateBalanceStateWhenUsingCustomToken(amountSet);
      return;
    }

    assert(vault);
    const amountSetBN = parseUnits(amountSet || '0', vault.decimals);
    assert(contracts, 'This network is not supported');
    const tokenBalance = await contracts.getVaultBalance(vault);
    if (!mounted.current) return;
    const isCombinedDist = calculateIfCombinedDist();
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
      if (fpVault?.id.toString() === vaultId)
        setSufficientFixPaymentTokens(
          (maxFixedPaymentTokens || Zero).gte(totalFixedPayment) &&
            Zero.lt(totalFixedPayment)
        );
    } else {
      setSufficientFixPaymentTokens(
        tokenBalance.gte(totalAmt) && totalAmt.gt(0)
      );
      setMaxFixedPaymentTokens(tokenBalance);
    }
  };

  const shouldDisableGiftInput = () => {
    if (previousLockedTokenDistribution?.tx_hash) return true;
    if (hedgeyIntegration?.data.enabled) return false;
    else
      return (
        giftSubmitting || !!circleDist || vaults.length === 0 || totalGive === 0
      );
  };

  const displayAvailableAmount = (type: 'gift' | 'fixed') => {
    const max = type === 'gift' ? maxGiftTokens : maxFixedPaymentTokens;
    const distribution = type === 'gift' ? circleDist : fixedDist;
    const vaultId = type === 'gift' ? giftVaultId : fpVault?.id.toString();
    if (!vaultId) return '';

    if (!max) {
      // updateBalanceState hasn't run yet
      return 'Avail...';
    }
    const decimals = getDecimals({ distribution, vaultId });
    const humanNumber = Number(formatUnits(max, decimals));
    return `Avail. ${commify(round(humanNumber, 2))}`;
  };

  const getVaultOptions = (options: {
    includeHedgey: boolean;
    includeConnectWallet: boolean;
  }) => {
    let vaultOptions: SelectOption[] = [];
    if (vaults.length) {
      vaultOptions = vaults.map(t => {
        return {
          value: t.id.toString(),
          label: options?.includeHedgey
            ? getVaultSymbolAddressString(t)
            : `CoVault: ${getVaultSymbolAddressString(t)}`,
        };
      });
    }

    if (options?.includeHedgey) {
      vaultOptions.push({ value: 'hedgey', label: 'Hedgey' });
    }

    if (options?.includeConnectWallet) {
      vaultOptions.push({ value: '', label: 'Connected wallet' });
    }

    if (vaultOptions.length === 0 && !options?.includeConnectWallet) {
      vaultOptions.push({ value: '', label: 'No Vaults Available' });
    }

    return vaultOptions;
  };

  const onVaultOrSourceChange = (value: string) => {
    if (value === 'hedgey') {
      setIsUsingHedgey(true);
      setGiftVaultId('');
      setValue('selectedVaultId', '', { shouldDirty: true });
      return;
    }
    setIsUsingHedgey(false);
    setValue('selectedVaultId', value, { shouldDirty: true });
    setGiftVaultId(value);
    updateBalanceState(value, formGiftAmount, 'gift');
  };

  const onHedgeyVaultChange = (value: string) => {
    setValue('selectedHedgeyVaultId', value, { shouldDirty: true });
    setGiftVaultId(value);
    updateBalanceState(value, formGiftAmount, 'gift');
  };

  const onChangeHedgeyLockPeriod = (value: string) => {
    setValue('hedgeyLockPeriod', value, { shouldDirty: true });
  };

  useEffect(() => {
    setValue('hedgeyLockPeriod', hedgeyIntegration?.data?.lockPeriod);
    setValue('hedgeyTransferable', hedgeyIntegration?.data?.transferable);
  }, [hedgeyIntegration]);

  return (
    <TwoColumnLayout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Panel invertForm css={vaultSelectionPanel}>
          <Text h2 css={headerStyle}>
            Gift Circle
          </Text>
          <TwoColumnLayout css={{ pt: '$md' }}>
            <Box css={{ width: '100%' }}>
              <Select
                {...(register('selectedVaultId'),
                {
                  defaultValue: circleDist
                    ? circleDist.vault.id.toString()
                    : vaults[0]
                    ? vaults[0].id.toString()
                    : '',
                  label: 'CoVault / Source',
                  disabled: shouldDisableGiftInput(),
                  onValueChange: onVaultOrSourceChange,
                })}
                options={getVaultOptions({
                  includeHedgey: hedgeyIntegration?.data.enabled,
                  includeConnectWallet: false,
                })}
              ></Select>
            </Box>
            <Box css={{ width: '100%' }}>
              {!isUsingHedgey && (
                <FormTokenField
                  {...amountField}
                  symbol={removeYearnPrefix(
                    findVault(giftVaultId)?.symbol || ''
                  )}
                  decimals={getDecimals({
                    distribution: circleDist,
                    vaultId: giftVaultId,
                  })}
                  type="text"
                  placeholder="0"
                  error={!!errors.amount}
                  errorText={errors.amount ? 'Insufficient funds.' : ''}
                  value={
                    circleDist
                      ? circleDist.gift_amount?.toString() || '0'
                      : amountField.value.toString()
                  }
                  disabled={
                    giftSubmitting ||
                    totalGive === 0 ||
                    (vaults.length > 0 && !!circleDist)
                  }
                  max={formatUnits(
                    maxGiftTokens || Zero,
                    getDecimals({
                      distribution: circleDist,
                      vaultId: giftVaultId,
                    })
                  )}
                  prelabel="Amount"
                  infoTooltip={
                    <>
                      CoVault funds to be allocated to the distribution of this
                      gift circle.
                    </>
                  }
                  label={displayAvailableAmount('gift')}
                  onChange={value => {
                    amountField.onChange(value);
                    setAmount(value);
                    updateBalanceState(giftVaultId, value, 'gift');
                  }}
                  apeSize="small"
                />
              )}
            </Box>
          </TwoColumnLayout>
          {isUsingHedgey && (
            <>
              <TwoColumnLayout>
                <Box css={{ width: '100%', marginTop: '1em' }}>
                  <Select
                    {...(register('selectedHedgeyVaultId'),
                    {
                      defaultValue: circleDist
                        ? circleDist.vault.id.toString()
                        : vaults[0]
                        ? vaults[0].id.toString()
                        : '',
                      label: 'Distribution source',
                      disabled: shouldDisableGiftInput(),
                      onValueChange: onHedgeyVaultChange,
                    })}
                    options={getVaultOptions({
                      includeHedgey: false,
                      includeConnectWallet: true,
                    })}
                  />
                </Box>
                <Box css={{ width: '100%', marginTop: '1em' }}>
                  {!selectedHedgeyVaultId && (
                    <FormInputField
                      {...tokenContractAddress}
                      control={control}
                      id="token_contract_address"
                      name="tokenContractAddress"
                      label="Token Contract Address"
                      infoTooltip="The contract address of the token you would like to lock up in NFTs"
                      showFieldErrors
                    />
                  )}
                </Box>
              </TwoColumnLayout>
              <Box css={{ width: '100%', marginTop: '1em' }}>
                {!selectedHedgeyVaultId && (
                  <FormTokenField
                    prelabel="Amount"
                    symbol={customToken?.symbol || ''}
                    decimals={customToken?.decimals || 18}
                    type="text"
                    placeholder="0"
                    value={amountField.value.toString()}
                    max={formatUnits(
                      customToken?.availableBalance || 0,
                      customToken?.decimals || 18
                    )}
                    label={`Avail. ${formatUnits(
                      customToken?.availableBalance || 0,
                      customToken?.decimals || 18
                    )}`}
                    onChange={value => {
                      amountField.onChange(value);
                      setAmount(value);
                      updateBalanceState(
                        selectedHedgeyVaultId || '0',
                        value,
                        'gift'
                      );
                    }}
                    apeSize="small"
                    infoTooltip="The total amount of tokens to be allocated to the distribution of this gift circle."
                  />
                )}
                {selectedHedgeyVaultId && (
                  // Use the standard value input field
                  <FormTokenField
                    {...amountField}
                    symbol={removeYearnPrefix(
                      findVault(giftVaultId)?.symbol || ''
                    )}
                    decimals={getDecimals({
                      distribution: circleDist,
                      vaultId: giftVaultId,
                    })}
                    type="text"
                    placeholder="0"
                    error={!!errors.amount}
                    errorText={errors.amount ? 'Insufficient funds.' : ''}
                    value={
                      circleDist
                        ? circleDist.gift_amount?.toString() || '0'
                        : amountField.value.toString()
                    }
                    disabled={
                      giftSubmitting ||
                      totalGive === 0 ||
                      (vaults.length > 0 && !!circleDist)
                    }
                    max={formatUnits(
                      maxGiftTokens || Zero,
                      getDecimals({
                        distribution: circleDist,
                        vaultId: giftVaultId,
                      })
                    )}
                    prelabel="Amount"
                    infoTooltip={
                      <>
                        CoVault funds to be allocated to the distribution of
                        this gift circle
                      </>
                    }
                    label={displayAvailableAmount('gift')}
                    onChange={value => {
                      amountField.onChange(value);
                      setAmount(value);
                      updateBalanceState(giftVaultId, value, 'gift');
                    }}
                    apeSize="small"
                  />
                )}
              </Box>
              <TwoColumnLayout>
                <Box css={{ width: '100%', marginTop: '1em' }}>
                  <Select
                    css={{ width: '100%' }}
                    options={hedgeyLockPeriods}
                    {...(register('hedgeyLockPeriod'),
                    {
                      id: 'hedgey-default-lock-period',
                      label: 'Lock period',
                      infoTooltip:
                        "How long tokens are locked within the recipient's NFT",
                      defaultValue: hedgeyIntegration?.data.lockPeriod,
                      onValueChange: onChangeHedgeyLockPeriod,
                    })}
                  />
                </Box>
                <Box css={{ width: '100%', marginTop: '1em' }}>
                  <Select
                    css={{ width: '100%' }}
                    options={[
                      { label: 'Yes', value: '1' },
                      { label: 'No', value: '0' },
                    ]}
                    {...(register('hedgeyTransferable'),
                    {
                      label: 'Transferable',
                      infoTooltip:
                        'Allow the recipient to transfer their NFT (and their access to the locked tokens) to a different wallet address',
                      id: 'hedgey-transferable',
                      defaultValue: hedgeyIntegration?.data.transferable,
                      onValueChange: value =>
                        setValue('hedgeyTransferable', value, {
                          shouldDirty: true,
                        }),
                    })}
                  />
                </Box>
              </TwoColumnLayout>
            </>
          )}
        </Panel>
        {(fixedDist || circleDist) && <Summary distribution={circleDist} />}
        <Flex css={{ justifyContent: 'center', mb: '$sm' }}>
          {previousLockedTokenDistribution?.tx_hash ? (
            <EtherscanButton
              tx_hash={previousLockedTokenDistribution.tx_hash}
              chain_id={previousLockedTokenDistribution.chain_id}
            />
          ) : isUsingHedgey && customToken?.symbol ? (
            <Button
              color="primary"
              outlined
              disabled={giftSubmitting || !sufficientGiftTokens}
              fullWidth
            >
              Submit {customToken.symbol} Distribution
            </Button>
          ) : circleDist ? (
            <EtherscanButton
              tx_hash={circleDist.tx_hash as string}
              chain_id={circleDist.vault.chain_id}
            />
          ) : isCombinedDistribution() ? (
            <Text css={{ fontSize: '$small' }}>
              Combined Distribution. Total{' '}
              {renderCombinedSum(formGiftAmount, totalFixedPayment)}{' '}
              {fpVault?.symbol}
            </Text>
          ) : vaults[0] ? (
            <Button
              color="primary"
              outlined
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
          ) : null}
        </Flex>
      </form>

      <form onSubmit={fixedHandleSubmit(onFixedFormSubmit)}>
        <Panel invertForm css={vaultSelectionPanel}>
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

          {!fixedPaymentVaultId ? (
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
                    {...(fixedRegister('selectedVaultId'),
                    {
                      defaultValue: fpVault
                        ? fixedDist
                          ? fixedDist.vault.id.toString()
                          : fpVault.id.toString()
                        : '',
                      disabled: true,
                      label: 'CoVault',
                    })}
                    options={
                      fpVault
                        ? [
                            {
                              value: fpVault.id.toString(),
                              label: getVaultSymbolAddressString(fpVault),
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
                      fpVault
                        ? fixedDist
                          ? removeYearnPrefix(fixedDist.vault.symbol)
                          : removeYearnPrefix(fpVault.symbol)
                        : ''
                    }
                    decimals={getDecimals({
                      distribution: fixedDist,
                      vaultId: fpVault?.id.toString(),
                    })}
                    type="text"
                    placeholder="0"
                    value={
                      fixedDist
                        ? fixedDist.fixed_amount.toString()
                        : totalFixedPayment
                    }
                    disabled={true}
                    max={formatUnits(
                      maxFixedPaymentTokens || Zero,
                      getDecimals({
                        distribution: fixedDist,
                        vaultId: fpVault?.id.toString(),
                      })
                    )}
                    prelabel="Amount"
                    infoTooltip={
                      <>
                        CoVault funds to be allocated to the distribution of the
                        fixed payment.
                      </>
                    }
                    label={displayAvailableAmount('fixed')}
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
        <Flex css={{ justifyContent: 'center', mb: '$sm' }}>
          {fixedDist ? (
            <EtherscanButton
              tx_hash={fixedDist.tx_hash as string}
              chain_id={fixedDist.vault.chain_id}
            />
          ) : fpVault ? (
            <Button
              color="primary"
              outlined
              disabled={fixedSubmitting || !sufficientFixedPaymentTokens}
              fullWidth
            >
              {getButtonText(
                sufficientFixedPaymentTokens,
                fpVault.id.toString(),
                isCombinedDistribution()
                  ? renderCombinedSum(formGiftAmount, totalFixedPayment)
                  : totalFixedPayment,
                isCombinedDistribution() ? 'combined' : 'fixed'
              )}
            </Button>
          ) : null}
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
  formatUnits(parseUnits(giftAmt || '0').add(parseUnits(fixedAmt)));

const EtherscanButton = ({
  chain_id,
  tx_hash,
}: {
  chain_id: number;
  tx_hash: string;
}) => {
  const explorerHref = makeExplorerUrl(chain_id, tx_hash);
  return (
    <Button
      type="button"
      color="primary"
      outlined
      fullWidth
      as="a"
      target="_blank"
      href={explorerHref}
    >
      View on Etherscan
    </Button>
  );
};
