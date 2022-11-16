import assert from 'assert';
import React, { MouseEvent, useState, useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { constants as ethersConstants } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import {
  getVaultSymbolAddressString,
  removeAddressSuffix,
  removeYearnPrefix,
} from 'lib/vaults';
import { useForm, SubmitHandler, useController } from 'react-hook-form';
import { useQuery } from 'react-query';
import * as z from 'zod';

import { FormInputField, FormRadioGroup, LoadingModal } from 'components';
import isFeatureEnabled from 'config/features';
import { useApeSnackbar, useApiAdminCircle, useContracts } from 'hooks';
import { useCircleOrg } from 'hooks/gql/useCircleOrg';
import { useVaults } from 'hooks/gql/useVaults';
import { Info } from 'icons/__generated';
import { useSelectedCircle } from 'recoilState/app';
import { paths } from 'routes/paths';
import {
  Box,
  Button,
  Divider,
  Link,
  Flex,
  Form,
  FormLabel,
  HR,
  Panel,
  Text,
  Tooltip,
  CheckBox,
  AppLink,
  Select,
} from 'ui';
import { SingleColumnLayout } from 'ui/layouts';
import { numberWithCommas } from 'utils';

import { AdminIntegrations } from './AdminIntegrations';
import { CircleApiKeys } from './CircleApi';
import { CircleLogoUpload } from './CircleLogoUpload';
import {
  getCircleSettings,
  QUERY_KEY_CIRCLE_SETTINGS,
} from './getCircleSettings';
import { getFixedPayment, QUERY_KEY_FIXED_PAYMENT } from './getFixedPayment';
import { RemoveCircleModal } from './RemoveCircleModal';

const panelStyles = {
  alignItems: 'start',
  display: 'grid',
  gridTemplateColumns: '1fr 3fr',
  gap: '$md',
  '@sm': { gridTemplateColumns: '1fr' },
};

const RadioToolTip = ({
  optionsInfo = [{ label: '', text: '' }],
  href = '',
  anchorText = '',
}) => {
  return (
    <>
      {optionsInfo.map(info => (
        <div key={info.label}>
          <strong>{info.label}</strong> - {info.text}
          <br />
        </div>
      ))}
      {href && (
        <Link
          css={{
            display: 'block',
            margin: '$sm 0 0',
            textAlign: 'center',
            color: '$link',
          }}
          rel="noreferrer"
          target="_blank"
          href={href}
        >
          {anchorText}
        </Link>
      )}
    </>
  );
};

const radioGroupOptions = {
  yesNo: [
    { value: 'true', label: 'Yes' },
    { value: 'false', label: 'No' },
  ],
  onOff: [
    { value: 'true', label: 'On' },
    { value: 'false', label: 'Off' },
  ],
};

const stringBoolTransform = (val: string) => {
  return val === 'true';
};

const schema = z.object({
  circle_name: z.optional(
    z
      .string()
      .max(255)
      .refine(val => val.trim().length >= 3, {
        message: 'Circle name must be at least 3 characters long.',
      })
  ),
  alloc_text: z.optional(
    z
      .string()
      .max(5000)
      .refine(val => val.trim().length >= 20, {
        message: 'Allocation text must be at least 20 characters long.',
      })
  ),
  auto_opt_out: z.string().transform(stringBoolTransform),
  discord_webhook: z.optional(z.string().url().or(z.literal(''))),
  min_vouches: z.optional(
    z.number().refine(val => val > 0, {
      message: 'Number of vouchers can not be 0',
    })
  ),
  nomination_days_limit: z.optional(
    z.number().refine(val => val > 0, {
      message: 'Nomination period should be 1 day at least',
    })
  ),
  only_giver_vouch: z.string().transform(stringBoolTransform),
  team_sel_text: z.optional(
    z.string().refine(val => val.trim().length > 20, {
      message: 'Contribution help text must be at least 20 characters long.',
    })
  ),
  team_selection: z.string().transform(stringBoolTransform),
  token_name: z.optional(
    z
      .string()
      .max(255, {
        message: 'Token name length must be between 3 and 255 characters.',
      })
      .refine(val => val.trim().length >= 3, {
        message: 'Token name length must be between 3 and 255 characters.',
      })
  ),
  vouching: z.boolean(),
  vouching_text: z.optional(
    z.string().refine(val => val.trim().length >= 20, {
      message: 'Vouching text must be at least 20 characters long.',
    })
  ),
  fixed_payment_token_type: z.optional(
    z.optional(
      z.string().max(200, {
        message:
          'Fixed payment token type length can not exceed 200 characters',
      })
    )
  ),
  fixed_payment_vault_id: z.optional(z.string().optional()),
});

type CircleAdminFormSchema = z.infer<typeof schema>;

export const CircleAdminPage = () => {
  const { circleId, circle: initialData } = useSelectedCircle();

  const {
    isLoading,
    isIdle,
    isError,
    isRefetching,
    refetch,
    error,
    data: circle,
  } = useQuery(
    [QUERY_KEY_CIRCLE_SETTINGS, circleId],
    () => getCircleSettings(circleId),
    {
      // the query will not be executed untill circleId exists
      enabled: !!circleId,
      initialData,
      //minmize background refetch
      refetchOnWindowFocus: false,

      staleTime: Infinity,
      notifyOnChangeProps: ['data'],
    }
  );

  const {
    data: fixedPayment,
    isLoading: fixedPaymentIsLoading,
    isIdle: fixedPaymentIsIdle,
  } = useQuery(
    [QUERY_KEY_FIXED_PAYMENT, circleId],
    () => getFixedPayment(circleId),
    {
      // the query will not be executed untill circleId exists
      enabled: !!circleId,
      //minmize background refetch
      refetchOnWindowFocus: false,

      staleTime: Infinity,
      notifyOnChangeProps: ['data'],
    }
  );

  const contracts = useContracts();
  const { showInfo } = useApeSnackbar();
  const orgQuery = useCircleOrg(circleId);

  const vaultsQuery = useVaults({
    orgId: orgQuery.data?.id,
    chainId: Number(contracts?.chainId),
  });

  const vaultOptions = vaultsQuery.data
    ? [
        { value: '', label: '- None -' },
        ...vaultsQuery.data.map(vault => {
          return { value: vault.id, label: getVaultSymbolAddressString(vault) };
        }),
      ]
    : [
        {
          value: '',
          label:
            vaultsQuery.isLoading || orgQuery.isLoading
              ? 'Loading...'
              : 'None Available',
        },
      ];

  const { updateCircle, getDiscordWebhook } = useApiAdminCircle(circleId);
  const [maxGiftTokens, setMaxGiftTokens] = useState(ethersConstants.Zero);

  const [allowEdit, setAllowEdit] = useState(false);

  const stringifiedVaultId = () => {
    const id = circle?.fixed_payment_vault_id;
    if (id == null) {
      return '';
    }
    return `${id}`;
  };

  const [circleToRemove, setCircleToRemove] = useState<number | undefined>(
    undefined
  );
  const {
    control,
    handleSubmit,
    register,
    setValue,
    getValues,
    watch,
    formState: { isDirty },
  } = useForm<CircleAdminFormSchema>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      fixed_payment_vault_id: stringifiedVaultId(),
      fixed_payment_token_type: circle?.fixed_payment_token_type || '',
    },
  });

  const { field: vouching } = useController({
    name: 'vouching',
    control,
    defaultValue: circle?.vouching,
  });

  const { field: discordWebhook, fieldState: discordWebhookState } =
    useController({
      name: 'discord_webhook',
      control,
      defaultValue: '',
    });

  const watchFixedPaymentVaultId = watch('fixed_payment_vault_id');

  const editDiscordWebhook = async (event: MouseEvent) => {
    event.preventDefault();
    try {
      const _webhook = await getDiscordWebhook();
      discordWebhook.onChange(_webhook);
      setAllowEdit(true);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    updateBalanceState(stringifiedVaultId());
  }, [vaultOptions.length]);

  const onSubmit: SubmitHandler<CircleAdminFormSchema> = async data => {
    try {
      let discordWebhookValue = data.discord_webhook;
      if (!allowEdit) {
        discordWebhookValue = await getDiscordWebhook();
      }

      await updateCircle({
        circle_id: circleId,
        name: data.circle_name,
        vouching: data.vouching,
        token_name: data.token_name,
        min_vouches: data.min_vouches,
        team_sel_text: data.team_sel_text,
        nomination_days_limit: data.nomination_days_limit,
        alloc_text: data.alloc_text,
        discord_webhook: discordWebhookValue,
        vouching_text: data.vouching_text,
        only_giver_vouch: data.only_giver_vouch,
        team_selection: data.team_selection,
        auto_opt_out: data.auto_opt_out,
        fixed_payment_token_type: data.fixed_payment_token_type,
        fixed_payment_vault_id: data.fixed_payment_vault_id
          ? parseInt(data.fixed_payment_vault_id)
          : null,
      });

      refetch();
      showInfo('Saved changes');
    } catch (e) {
      console.warn(e);
    }
  };

  const getDecimals = (vaultId: string) => {
    if (vaultId) {
      const v = findVault(vaultId);
      if (v) return v.decimals;
    }
    return 0;
  };

  const findVault = (vaultId: string) => {
    return vaultsQuery?.data?.find(v => v.id === parseInt(vaultId));
  };

  const updateBalanceState = async (vaultId: string): Promise<void> => {
    assert(circle);
    const vault = findVault(vaultId);
    assert(contracts, 'This network is not supported');

    if (vault) {
      const tokenBalance = await contracts.getVaultBalance(vault);
      setMaxGiftTokens(tokenBalance);
    } else {
      setMaxGiftTokens(ethersConstants.Zero);
    }
  };

  const fixedPaymentToken = (vaultId: string | undefined) => {
    const tokenType = circle?.fixed_payment_token_type;
    const fixedVault = findVault(getValues('fixed_payment_vault_id') || '');
    return vaultId && fixedVault
      ? removeAddressSuffix(
          removeYearnPrefix(fixedVault?.symbol ?? ''),
          fixedVault.vault_address
        )
      : tokenType
      ? tokenType.startsWith('Yearn')
        ? removeYearnPrefix(tokenType)
        : tokenType
      : '';
  };

  if (
    isLoading ||
    isIdle ||
    isRefetching ||
    !circle ||
    (isFeatureEnabled('vaults') && !vaultsQuery.data) ||
    !orgQuery.data ||
    fixedPaymentIsLoading ||
    fixedPaymentIsIdle
  )
    return <LoadingModal visible />;
  if (isError) {
    if (error instanceof Error) {
      console.warn(error);
    }
  }

  const IS_CUSTOM_TOKEN_NAME = circle?.token_name !== 'GIVE';

  return (
    <Form id="circle_admin">
      <SingleColumnLayout>
        <Flex
          alignItems="center"
          css={{
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            mb: '$lg',
            gap: '$md',
          }}
        >
          <Text h1>Circle Admin</Text>
          <Button
            color="primary"
            size="medium"
            type="submit"
            form="circle_admin"
            outlined
            disabled={!isDirty}
            onClick={handleSubmit(onSubmit)}
          >
            Save Settings
          </Button>
        </Flex>
        <Panel css={panelStyles}>
          <Text h2>General</Text>
          <Panel nested>
            <Text h3 semibold css={{ mb: '$sm' }}>
              Circle Settings
            </Text>
            <Text p as="p" size="small">
              Coordinape circles allow you to collectively reward circle members
              through equitable and transparent payments.{' '}
              <span>
                <Link
                  href="https://docs.coordinape.com/get-started/admin/update-circle-settings"
                  rel="noreferrer"
                  target="_blank"
                >
                  Learn More
                </Link>
              </span>
            </Text>
            <Box
              css={{
                mt: '$lg',
                display: 'grid',
                gridTemplateColumns: `1fr 1fr ${
                  IS_CUSTOM_TOKEN_NAME ? '1fr' : ''
                }`,
                gap: '$lg',
                '@sm': { gridTemplateColumns: '1fr' },
              }}
            >
              <FormInputField
                id="circle_name"
                name="circle_name"
                control={control}
                defaultValue={circle?.name}
                label="Circle Name"
                infoTooltip="This will be the circle name that your users will select"
                showFieldErrors
              />

              <Flex column alignItems="start" css={{ gap: '$xs' }}>
                <Text variant="label" as="label">
                  Circle logo
                  <Tooltip
                    css={{ ml: '$xs' }}
                    content={<div>Upload a logo to your circle</div>}
                  >
                    <Info size="sm" />
                  </Tooltip>
                </Text>

                <CircleLogoUpload
                  circleId={circle.id}
                  circleName={circle.name ?? ''}
                  original={circle.logo}
                />
              </Flex>
              {IS_CUSTOM_TOKEN_NAME && (
                <FormInputField
                  id="token_name"
                  name="token_name"
                  control={control}
                  defaultValue={circle?.token_name}
                  label="Token Name [deprecated]"
                  infoTooltip="[deprecated] This feature is no longer available"
                  showFieldErrors
                  disabled
                />
              )}
            </Box>
            <Flex
              css={{
                flexWrap: 'wrap',
                mt: '$lg',
                gap: '$2xl',
              }}
            >
              <FormRadioGroup
                label="Only Givers can vouch"
                name="only_giver_vouch"
                control={control}
                options={radioGroupOptions.yesNo}
                defaultValue={circle?.only_giver_vouch ? 'true' : 'false'}
                infoTooltip={
                  <RadioToolTip
                    optionsInfo={[
                      {
                        label: 'Yes',
                        text: `Only members who are eligible to send ${
                          circle?.tokenName || 'GIVE'
                        } can vouch for new members`,
                      },
                      {
                        label: 'No',
                        text: 'Anyone in the circle can vouch for new members',
                      },
                    ]}
                  />
                }
              />
              <FormRadioGroup
                label="Team Selection"
                name="team_selection"
                control={control}
                options={radioGroupOptions.onOff}
                defaultValue={circle?.team_selection ? 'true' : 'false'}
                infoTooltip={
                  <RadioToolTip
                    optionsInfo={[
                      {
                        label: 'Yes',
                        text: 'Members select a team during allocation and make allocations only to that team',
                      },
                      {
                        label: 'No',
                        text: 'Members make allocations to anyone in the circle',
                      },
                    ]}
                  />
                }
              />
              <FormRadioGroup
                label="Auto Opt Out"
                name="auto_opt_out"
                control={control}
                options={radioGroupOptions.onOff}
                defaultValue={circle?.auto_opt_out ? 'true' : 'false'}
                infoTooltip={
                  <RadioToolTip
                    optionsInfo={[
                      {
                        label: 'ON',
                        text: "If a member doesn't make allocations in an epoch, they'll be set to opt out of receiving allocations in the next epoch. They can still opt back in.",
                      },
                      {
                        label: 'OFF',
                        text: "Members' opt-in/opt-out settings will not be changed automatically.",
                      },
                    ]}
                  />
                }
              />
            </Flex>
            <Divider css={{ mt: '$1xl', mb: '$lg' }} />
            <Text h3 semibold css={{ mb: '$sm' }}>
              Epoch Timing
            </Text>
            <Text p as="p" size="small">
              Edit your epoch timing on the{' '}
              <AppLink to={paths.history(circleId)}>Epoch Overview</AppLink> by
              creating or editing an epoch.
            </Text>
          </Panel>
        </Panel>
        {isFeatureEnabled('fixed_payments') && (
          <Panel css={panelStyles}>
            <Text h2>Fixed Payments</Text>
            <Panel nested>
              <Box
                css={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '$lg',
                  '@sm': { gridTemplateColumns: '1fr' },
                }}
              >
                <Box>
                  <Select
                    {...(register('fixed_payment_vault_id'),
                    {
                      onValueChange: value => {
                        setValue('fixed_payment_vault_id', value, {
                          shouldDirty: true,
                        });
                        setValue(
                          'fixed_payment_token_type',
                          value == '' ? '' : findVault(value)?.symbol,
                          { shouldDirty: true }
                        );
                        updateBalanceState(
                          getValues('fixed_payment_vault_id') ?? ''
                        );
                      },
                      defaultValue: stringifiedVaultId(),
                    })}
                    id="fixed_payment_vault_id"
                    options={vaultOptions}
                    label="Fixed Payment Vault"
                  />
                </Box>
                <FormInputField
                  id="fixed_payment_token_type"
                  name="fixed_payment_token_type"
                  control={control}
                  defaultValue={circle?.fixed_payment_token_type}
                  label="Token name for CSV export"
                  infoTooltip="This will be the token name displayed in exported CSVs"
                  disabled={!!watchFixedPaymentVaultId}
                  showFieldErrors
                />
              </Box>
              <Flex css={{ gap: '$lg', mt: '$lg' }}>
                <Flex column>
                  <Text variant="label" css={{ mb: '$xs' }}>
                    Members
                  </Text>
                  <Text size="medium">{fixedPayment?.fixedPaymentNumber}</Text>
                </Flex>
                <Flex column>
                  <Text variant="label" css={{ mb: '$xs' }}>
                    Fixed Payments Total
                  </Text>
                  <Text size="medium">{`${
                    fixedPayment?.fixedPaymentTotal
                  } ${fixedPaymentToken(watchFixedPaymentVaultId)}`}</Text>
                </Flex>
                <Flex column>
                  <Text variant="label" css={{ mb: '$xs' }}>
                    Available in Vault
                  </Text>{' '}
                  <Text size="medium">{`${numberWithCommas(
                    formatUnits(
                      maxGiftTokens,
                      getDecimals(getValues('fixed_payment_vault_id') ?? '')
                    )
                  )} ${fixedPaymentToken(watchFixedPaymentVaultId)}`}</Text>
                </Flex>
              </Flex>
            </Panel>
          </Panel>
        )}
        <Panel css={panelStyles}>
          <Text h2>Customization</Text>
          <Panel nested>
            <Text h3 semibold css={{ mb: '$sm' }}>
              Allocation Placeholder Text
            </Text>
            <Text p as="p" size="small">
              Change the default text contributors see during epoch allocation
            </Text>
            <Box
              css={{
                mt: '$lg',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '$lg',
                '@sm': { gridTemplateColumns: '1fr' },
              }}
            >
              <FormInputField
                textArea
                id="contribution_text"
                name="team_sel_text"
                control={control}
                defaultValue={circle?.teamSelText}
                css={{ flexGrow: 1, textAlign: 'flex-start' }}
                label="Contribution Help Text"
                description="Change the default text contributors see on team selection"
                showFieldErrors
              />

              <FormInputField
                textArea
                id="alloc_text"
                name="alloc_text"
                control={control}
                defaultValue={circle?.allocText}
                css={{ flexGrow: 1, textAlign: 'flex-start' }}
                label="Allocation Help Text"
                description="Change the default text contributors see during epoch allocation"
                showFieldErrors
              />
            </Box>
          </Panel>
        </Panel>
        <Panel css={panelStyles}>
          <Text h2>Vouching</Text>
          <Panel nested>
            <Text h3 semibold css={{ mb: '$sm' }}>
              Vouching Settings
            </Text>
            <Text p as="p" size="small">
              Vouching default text and settings.{' '}
              <Link
                href="https://docs.coordinape.com/get-started/admin/enable-vouching"
                rel="noreferrer"
                target="_blank"
              >
                Learn More
              </Link>
            </Text>
            <Box
              css={{
                mt: '$lg',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '$lg',
                '@sm': { gridTemplateColumns: '1fr' },
              }}
            >
              <Box
                css={{
                  gridColumnEnd: 'span 2',
                  '@sm': { gridColumnEnd: 'span 1' },
                }}
              >
                <FormLabel type="label">
                  Enable Vouching?{' '}
                  <Tooltip
                    content={
                      <div>
                        {
                          <RadioToolTip
                            optionsInfo={[
                              {
                                label: 'Enabled',
                                text: 'Circle members can invite new people to the circle; they become new members if enough other members vouch for them',
                              },
                              {
                                label: 'Disabled',
                                text: 'Only circle admins may add new members',
                              },
                            ]}
                          />
                        }
                      </div>
                    }
                  >
                    <Info size="sm" />
                  </Tooltip>
                </FormLabel>
                <CheckBox {...vouching} label="Vouching" />
              </Box>
              <FormInputField
                id="min_vouches"
                name="min_vouches"
                control={control}
                defaultValue={circle?.min_vouches}
                number
                inputProps={{ type: 'number' }}
                disabled={!vouching.value}
                label="Minimum vouches to add member"
                infoTooltip=" Minimum number of Vouches for a nominee to be accepted as a user of the circle"
                showFieldErrors
              />
              <FormInputField
                id="nomination_length"
                name="nomination_days_limit"
                control={control}
                defaultValue={circle?.nomination_days_limit}
                number
                inputProps={{ type: 'number' }}
                disabled={!vouching.value}
                label="Length of Nomination Period"
                infoTooltip="Set the length of Nomination period in days"
                showFieldErrors
              />
              <FormInputField
                textArea
                id="vouching_text"
                name="vouching_text"
                control={control}
                areaProps={{
                  placeholder:
                    'This is a custom note we can optionally display to users on the vouching page, with guidance on who to vouch for and how.',
                }}
                disabled={!vouching.value}
                defaultValue={circle?.vouchingText}
                label="Vouching Text"
                description="Change the default text contributors see in vouching page"
                showFieldErrors
              />
            </Box>
          </Panel>
        </Panel>
        <Flex
          column
          alignItems="end"
          css={{
            gap: '$xs',
          }}
        >
          <Button
            color="primary"
            size="medium"
            type="submit"
            form="circle_admin"
            outlined
            disabled={!isDirty}
            onClick={handleSubmit(onSubmit)}
          >
            Save Settings
          </Button>
        </Flex>
        <HR />
        <Panel css={panelStyles}>
          <Text h2>Integration</Text>
          <Panel nested>
            <AdminIntegrations circleId={circleId} />
            <HR />
            <Box>
              <Text h3 semibold css={{ mb: '$md' }}>
                Discord Webhook
              </Text>
              {allowEdit && (
                <>
                  <input readOnly={!allowEdit} {...discordWebhook} />
                  {discordWebhookState.error && (
                    <Text color="alert" css={{ px: '$xl', fontSize: '$3' }}>
                      {discordWebhookState.error.message}
                    </Text>
                  )}
                </>
              )}

              <div>
                {!allowEdit && (
                  <Button onClick={editDiscordWebhook} color="primary" outlined>
                    Edit WebHook
                  </Button>
                )}
              </div>
            </Box>
          </Panel>
        </Panel>
        <Panel css={panelStyles}>
          <Text h2>Circle API Keys</Text>
          <Panel nested>
            <CircleApiKeys />
          </Panel>
        </Panel>
        <Panel css={panelStyles}>
          <Text inline bold h2 font="inter">
            Danger Zone
          </Text>
          <Panel nested>
            <Text h3 semibold css={{ mb: '$lg' }}>
              Permanently Remove Circle
            </Text>
            <Button
              color="destructive"
              outlined
              css={{
                width: '163px',
              }}
              onClick={event => {
                event.preventDefault();
                setCircleToRemove(1);
              }}
            >
              Remove Circle
            </Button>
            <RemoveCircleModal
              circleId={circleId}
              onClose={() => {
                setCircleToRemove(undefined);
              }}
              visible={!!circleToRemove}
            ></RemoveCircleModal>
          </Panel>
        </Panel>
      </SingleColumnLayout>
    </Form>
  );
};

export default CircleAdminPage;
