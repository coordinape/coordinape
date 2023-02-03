import assert from 'assert';
import React, { MouseEvent, useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { constants as ethersConstants } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import {
  getVaultSymbolAddressString,
  removeAddressSuffix,
  removeYearnPrefix,
} from 'lib/vaults';
import { SubmitHandler, useController, useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from 'react-query';
import { useLocation } from 'react-router-dom';
import * as z from 'zod';

import { fetchGuildInfo } from '../../features/guild/fetchGuildInfo';
import { Guild } from '../../features/guild/Guild';
import { GuildInfoWithMembership } from '../../features/guild/guild-api';
import { FormInputField, FormRadioGroup, LoadingModal } from 'components';
import isFeatureEnabled from 'config/features';
import { useApiAdminCircle, useApiBase, useContracts, useToast } from 'hooks';
import { useCircleOrg } from 'hooks/gql/useCircleOrg';
import { useVaults } from 'hooks/gql/useVaults';
import { Info } from 'icons/__generated';
import { useSelectedCircle } from 'recoilState/app';
import { paths } from 'routes/paths';
import {
  AppLink,
  Box,
  Button,
  CheckBox,
  ContentHeader,
  Divider,
  Flex,
  Form,
  HR,
  Link,
  Panel,
  Select,
  Text,
  Tooltip,
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
  hide_gives: z.boolean(),
  guild_id: z.optional(z.number().or(z.string())),
  guild_role_id: z.optional(z.string()),
});

type CircleAdminFormSchema = z.infer<typeof schema>;

export const CircleAdminPage = () => {
  const { circleId, circle: initialData } = useSelectedCircle();
  const { hash } = useLocation();
  const { fetchManifest } = useApiBase();

  const [hasScrolled, setHasScrolled] = useState(false);
  const scrollToGuild = (element: HTMLDivElement) => {
    if (element && !hasScrolled && hash === '#guild') {
      element.scrollIntoView(true);
      setHasScrolled(true);
    }
  };

  const queryClient = useQueryClient();
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
  const { showDefault } = useToast();
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

  const { field: hideGives } = useController({
    name: 'hide_gives',
    control,
    defaultValue: !circle?.show_pending_gives,
  });

  const { field: discordWebhook } = useController({
    name: 'discord_webhook',
    control,
    defaultValue: '',
  });

  const watchFixedPaymentVaultId = watch('fixed_payment_vault_id');
  const watchGuild = watch('guild_id');

  const [guildInfo, setGuildInfo] = useState<
    GuildInfoWithMembership | undefined
  >(undefined);
  const [guildError, setGuildError] = useState<string | undefined>(undefined);
  const [guildLoading, setGuildLoading] = useState<boolean>(false);

  useEffect(() => {
    setGuildError(undefined);
    if (watchGuild) {
      loadGuild(watchGuild);
    } else {
      setGuildInfo(undefined);
    }
  }, [watchGuild]);

  useEffect(() => {
    if (circle?.guild_id) {
      loadGuild(circle.guild_id);
    }
  }, [circle]);

  const loadGuild = (guildId: string | number) => {
    setGuildLoading(true);
    setGuildInfo(undefined);
    fetchGuildInfo(guildId)
      .then(g => {
        if (watchGuild == circle?.guild_id) {
          // if this is first load, lets be nice and put the name in there
          setValue('guild_id', g.url_name, { shouldDirty: false });
        }
        setGuildInfo(g);
      })
      .catch(() => {
        setGuildInfo(undefined);
        setGuildError('Guild not found');
      })
      .finally(() => {
        setGuildLoading(false);
      });
  };

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
    if (contracts) updateBalanceState(stringifiedVaultId());
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
        nomination_days_limit: data.nomination_days_limit,
        discord_webhook: discordWebhookValue,
        vouching_text: data.vouching_text,
        only_giver_vouch: data.only_giver_vouch,
        team_selection: data.team_selection,
        auto_opt_out: data.auto_opt_out,
        fixed_payment_token_type: data.fixed_payment_token_type,
        show_pending_gives: !data.hide_gives,
        fixed_payment_vault_id: data.fixed_payment_vault_id
          ? parseInt(data.fixed_payment_vault_id)
          : null,
        guild_id: guildInfo ? guildInfo.id : null,
        guild_role_id:
          guildInfo && data.guild_role_id && data.guild_role_id != '-1'
            ? parseInt(data.guild_role_id)
            : null,
      });
      queryClient.invalidateQueries(QUERY_KEY_FIXED_PAYMENT);
      fetchManifest();
      refetch();

      showDefault('Saved changes');
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
    (contracts && !vaultsQuery.data) ||
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
        <ContentHeader sticky>
          <Flex column css={{ gap: '$sm', flexGrow: 1 }}>
            <Text h1>Circle Admin</Text>
          </Flex>
          <Button
            color="cta"
            type="submit"
            form="circle_admin"
            disabled={!isDirty}
            onClick={handleSubmit(onSubmit)}
          >
            Save Settings
          </Button>
        </ContentHeader>
        <Panel css={panelStyles}>
          <Text h2>General</Text>
          <Panel css={{ p: '$sm 0' }}>
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
                  inlineLink
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
            <Flex column css={{ mt: '$xl' }}>
              <Text variant="label" as="label">
                GIVE Visibility?{' '}
                <Tooltip
                  content={
                    <div>
                      {
                        <RadioToolTip
                          optionsInfo={[
                            {
                              label: 'Enabled',
                              text: 'Hide received GIVEs and Map page from contributors during active epoch.',
                            },
                            {
                              label: 'Disabled',
                              text: 'Show received GIVEs and Map page to contributors during active epoch.',
                            },
                          ]}
                        />
                      }
                    </div>
                  }
                >
                  <Info size="sm" />
                </Tooltip>
              </Text>
              <CheckBox {...hideGives} label="Hide GIVE Data During Epoch " />
            </Flex>
            <Divider css={{ mt: '$1xl', mb: '$lg' }} />
            <Text h3 semibold css={{ mb: '$sm' }}>
              Epoch Timing
            </Text>
            <Text p as="p" size="small">
              Edit your epoch timing on the{' '}
              <AppLink inlineLink to={paths.history(circleId)}>
                Epoch Overview
              </AppLink>{' '}
              by creating or editing an epoch.
            </Text>
          </Panel>
        </Panel>
        {isFeatureEnabled('fixed_payments') && (
          <Panel css={panelStyles}>
            <Text h2>Fixed Payments</Text>
            <Panel css={{ p: '$sm 0' }}>
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
                        if (contracts)
                          updateBalanceState(
                            getValues('fixed_payment_vault_id') ?? ''
                          );
                      },
                      defaultValue: stringifiedVaultId(),
                    })}
                    id="fixed_payment_vault_id"
                    options={vaultOptions}
                    label="Fixed Payment Vault"
                    disabled={!contracts}
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
                  <Text size="medium">{fixedPayment?.number}</Text>
                </Flex>
                <Flex column>
                  <Text variant="label" css={{ mb: '$xs' }}>
                    Fixed Payments Total
                  </Text>
                  <Text size="medium">{`${
                    fixedPayment?.total
                  } ${fixedPaymentToken(watchFixedPaymentVaultId)}`}</Text>
                </Flex>
                {contracts && (
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
                )}
              </Flex>
            </Panel>
          </Panel>
        )}

        <Panel css={panelStyles}>
          <Text h2>Vouching</Text>
          <Panel css={{ p: '$sm 0' }}>
            <Text h3 semibold css={{ mb: '$sm' }}>
              Vouching Settings
            </Text>
            <Text p as="p" size="small">
              Vouching default text and settings.{' '}
              <Link
                href="https://docs.coordinape.com/get-started/admin/enable-vouching"
                rel="noreferrer"
                target="_blank"
                inlineLink
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
                <Text variant="label" as="label">
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
                </Text>
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
            color="cta"
            size="medium"
            type="submit"
            form="circle_admin"
            disabled={!isDirty}
            onClick={handleSubmit(onSubmit)}
          >
            Save Settings
          </Button>
        </Flex>
        <HR />
        <Panel css={panelStyles}>
          <Text h2>Integration</Text>
          <Panel css={{ p: '$sm 0' }}>
            <AdminIntegrations circleId={circleId} />
            <HR />
            <Box>
              <Text h3 semibold css={{ mb: '$md' }}>
                Discord Webhook
              </Text>
              {allowEdit && (
                <FormInputField
                  control={control}
                  css={{
                    alignItems: 'flex-start',
                    input: { width: '100%', maxWidth: '30rem' },
                  }}
                  id="discord_webhook"
                  name="discord_webhook"
                  label="Webhook Url"
                  showFieldErrors
                />
              )}

              <div>
                {!allowEdit && (
                  <Button onClick={editDiscordWebhook} color="secondary">
                    Edit WebHook
                  </Button>
                )}
              </div>
            </Box>
            {isFeatureEnabled('guild') && (
              <Box>
                <HR />
                <Text
                  ref={scrollToGuild}
                  id="guild"
                  h3
                  semibold
                  css={{ mb: '$md' }}
                >
                  Guild.xyz
                </Text>
                <FormInputField
                  id="guild_id"
                  name="guild_id"
                  control={control}
                  placeholder="https://guild.xyz/your-guild - URL or unique Guild ID"
                  defaultValue={circle?.guild_id ? '' + circle.guild_id : ''}
                  label="Connect a Guild that will grant the ability to join this Circle"
                  description=""
                  showFieldErrors
                />

                {watchGuild && (
                  <Box css={{ mt: '$md' }}>
                    {guildLoading ? (
                      <Text>Checking guild...</Text>
                    ) : guildInfo ? (
                      <Box>
                        <Text variant="label" css={{ mb: '$sm' }}>
                          Allow members of this Guild to join
                        </Text>
                        <Guild info={guildInfo} />
                        <Box css={{ mt: '$md' }}>
                          <Select
                            {...(register('guild_role_id'),
                            {
                              onValueChange: value => {
                                setValue('guild_role_id', value, {
                                  shouldDirty: true,
                                });
                              },
                              defaultValue: circle.guild_role_id
                                ? '' + circle.guild_role_id
                                : '-1',
                            })}
                            id="guild_role_id"
                            options={[
                              {
                                label: `Any Role - ${guildInfo.member_count} members`,
                                value: '-1',
                              },
                              ...guildInfo.roles.map(r => ({
                                value: '' + r.id,
                                label: r.name + ` - ${r.member_count} members`,
                              })),
                            ]}
                            label="Required Guild Role"
                            disabled={!guildInfo}
                          />
                        </Box>
                      </Box>
                    ) : guildError ? (
                      <Text color="alert">{guildError}</Text>
                    ) : (
                      <Text>No guild connected.</Text>
                    )}
                  </Box>
                )}
              </Box>
            )}
          </Panel>
        </Panel>
        <Panel css={panelStyles}>
          <Text h2>Circle API Keys</Text>
          <Panel css={{ p: '$sm 0' }}>
            <CircleApiKeys />
          </Panel>
        </Panel>
        <Panel css={panelStyles}>
          <Text inline bold h2>
            Danger Zone
          </Text>
          <Flex column alignItems="start">
            <Text h3 semibold css={{ mb: '$lg' }}>
              Permanently Remove Circle
            </Text>
            <Button
              color="destructive"
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
          </Flex>
        </Panel>
      </SingleColumnLayout>
    </Form>
  );
};

export default CircleAdminPage;
