import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { updateCircle } from 'lib/gql/mutations';
import { SubmitHandler, useController, useForm } from 'react-hook-form';
import { useQuery, useQueryClient } from 'react-query';
import { useLocation } from 'react-router-dom';
import * as z from 'zod';

import { GuildInfoWithMembership } from '../../features/guild/guild-api';
import { GuildSelector } from '../../features/guild/GuildSelector';
import { QUERY_KEY_GIVE_PAGE } from '../GiftCircleGivePage/queries';
import { FormInputField, FormRadioGroup, LoadingModal } from 'components';
import { useToast } from 'hooks';
import { Info } from 'icons/__generated';
import { useCircleIdParam } from 'routes/hooks';
import { givePaths } from 'routes/paths';
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
  Text,
  Tooltip,
} from 'ui';
import { SingleColumnLayout } from 'ui/layouts';

import { AdminIntegrations } from './AdminIntegrations';
import { CircleApiKeys } from './CircleApi';
import { CircleLogoUpload } from './CircleLogoUpload';
import {
  CircleSettingsResult,
  getCircleSettings,
  QUERY_KEY_CIRCLE_SETTINGS,
} from './getCircleSettings';
import { RemoveCircleModal } from './RemoveCircleModal';
import { UpdateCircleGive } from './UpdateCircleGive';

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
  allow_distribute_evenly: z.string().transform(stringBoolTransform),
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
  hide_gives: z.boolean(),
  guild_id: z.optional(z.number().or(z.string())),
  guild_role_id: z.optional(z.string()),
});

type CircleAdminFormSchema = z.infer<typeof schema>;

export const CircleAdminPage = () => {
  const circleId = useCircleIdParam();

  const {
    isRefetching,
    refetch,
    data: circle,
  } = useQuery(
    [QUERY_KEY_CIRCLE_SETTINGS, circleId],
    () => getCircleSettings(circleId),
    {
      //minmize background refetch
      refetchOnWindowFocus: false,

      staleTime: Infinity,
      notifyOnChangeProps: ['data'],
    }
  );

  if (!circle || isRefetching) return <LoadingModal visible />;
  return <CircleAdminPageInner {...{ circle, refetch }} />;
};

export const CircleAdminPageInner = ({
  circle,
  refetch,
}: {
  circle: CircleSettingsResult;
  refetch: () => void;
}) => {
  const circleId = useCircleIdParam();
  const { hash } = useLocation();

  const [hasScrolled, setHasScrolled] = useState(false);
  const scrollToGuild = (element: HTMLDivElement) => {
    if (element && !hasScrolled && hash === '#guild') {
      element.scrollIntoView(true);
      setHasScrolled(true);
    }
  };

  const queryClient = useQueryClient();

  const { showDefault, showError } = useToast();

  const [circleToRemove, setCircleToRemove] = useState<number | undefined>(
    undefined
  );
  const {
    control,
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { isDirty },
  } = useForm<CircleAdminFormSchema>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const { field: vouching } = useController({
    name: 'vouching',
    control,
    defaultValue: circle.vouching,
  });

  const { field: hideGives } = useController({
    name: 'hide_gives',
    control,
    defaultValue: !circle.show_pending_gives,
  });

  const { field: discordWebhook } = useController({
    name: 'discord_webhook',
    control,
    defaultValue: circle.circle_private?.discord_webhook || '',
  });

  const watchGuild = watch('guild_id');

  const [guildInfo, setGuildInfo] = useState<
    GuildInfoWithMembership | undefined
  >(undefined);

  const onSubmit: SubmitHandler<CircleAdminFormSchema> = async data => {
    try {
      await updateCircle({
        circle_id: circleId,
        name: data.circle_name,
        vouching: data.vouching,
        token_name: data.token_name,
        min_vouches: data.min_vouches,
        nomination_days_limit: data.nomination_days_limit,
        discord_webhook: data.discord_webhook,
        vouching_text: data.vouching_text,
        only_giver_vouch: data.only_giver_vouch,
        team_selection: data.team_selection,
        allow_distribute_evenly: data.allow_distribute_evenly,
        auto_opt_out: data.auto_opt_out,
        fixed_payment_token_type: data.fixed_payment_token_type,
        show_pending_gives: !data.hide_gives,
        guild_id: guildInfo ? guildInfo.id : null,
        guild_role_id:
          guildInfo && data.guild_role_id && data.guild_role_id != '-1'
            ? parseInt(data.guild_role_id)
            : null,
      });
      queryClient.invalidateQueries(QUERY_KEY_GIVE_PAGE);
      refetch();

      showDefault('Saved changes');
    } catch (e) {
      showError(e);
      console.warn(e);
    }
  };

  const IS_CUSTOM_TOKEN_NAME = circle.token_name !== 'GIVE';

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
        <Panel settings>
          <Text h2>General</Text>
          <Panel css={{ p: '$sm 0' }}>
            <Text large semibold css={{ mb: '$sm' }}>
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
                defaultValue={circle.name}
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
                  defaultValue={circle.token_name}
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
                '@sm': {
                  flexDirection: 'column',
                  gap: '$lg',
                },
              }}
            >
              <FormRadioGroup
                label="Only Givers can vouch"
                name="only_giver_vouch"
                control={control}
                options={radioGroupOptions.yesNo}
                defaultValue={circle.only_giver_vouch ? 'true' : 'false'}
                infoTooltip={
                  <RadioToolTip
                    optionsInfo={[
                      {
                        label: 'Yes',
                        text: `Only members who are eligible to send ${
                          circle.tokenName || 'GIVE'
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
                defaultValue={circle.team_selection ? 'true' : 'false'}
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
                defaultValue={circle.auto_opt_out ? 'true' : 'false'}
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
              <FormRadioGroup
                label='Show "Distribute Evenly" button'
                name="allow_distribute_evenly"
                control={control}
                options={radioGroupOptions.onOff}
                defaultValue={circle.allow_distribute_evenly ? 'true' : 'false'}
                infoTooltip={
                  <RadioToolTip
                    optionsInfo={[
                      {
                        label: 'ON',
                        text: 'Users will see the "Distribute Evenly" button and can distribute give evenly with a single click',
                      },
                      {
                        label: 'OFF',
                        text: '"Distribute Evenly" button will be hidden for all users of this circle.',
                      },
                    ]}
                  />
                }
              />
            </Flex>
            <Flex
              css={{
                mt: '$xl',
                columnGap: '$4xl',
                rowGap: '$xl',
                flexWrap: 'wrap',
              }}
            >
              <Flex column>
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
              <UpdateCircleGive
                circleId={circleId}
                circleStartingTokens={circle.starting_tokens}
              />
            </Flex>
            <Divider css={{ mt: '$1xl', mb: '$lg' }} />
            <Text large semibold css={{ mb: '$sm' }}>
              Epoch Timing
            </Text>
            <Text p as="p" size="small">
              Edit your epoch timing on the{' '}
              <AppLink inlineLink to={givePaths.epochs(circleId)}>
                Epoch Overview
              </AppLink>{' '}
              by creating or editing an epoch.
            </Text>
          </Panel>
        </Panel>

        <Panel settings>
          <Text h2>Vouching</Text>
          <Panel css={{ p: '$sm 0' }}>
            <Text large semibold css={{ mb: '$sm' }}>
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
                defaultValue={circle.min_vouches}
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
                defaultValue={circle.nomination_days_limit}
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
                defaultValue={circle.vouchingText}
                label="Vouching Text"
                description="Change the default text contributors see in vouching page"
                showFieldErrors
              />
            </Box>
          </Panel>
        </Panel>
        <Flex column alignItems="end" css={{ gap: '$xs' }}>
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
        <Panel settings>
          <Text h2>Integrations</Text>
          <Panel css={{ p: '$sm 0' }}>
            <AdminIntegrations circleId={circleId} />
            <HR />
            <Box>
              <Text large semibold css={{ mb: '$md' }}>
                Discord Webhook
              </Text>
              <FormInputField
                id="discord_webhook"
                control={control}
                {...discordWebhook}
                css={{
                  alignItems: 'flex-start',
                  input: { width: '100%', maxWidth: '30rem' },
                }}
                label="Webhook Url"
                showFieldErrors
              />
            </Box>
            <Box>
              <HR />
              <Text
                ref={scrollToGuild}
                id="guild"
                large
                semibold
                css={{ mb: '$md' }}
              >
                Guild.xyz
              </Text>

              <GuildSelector
                formControl={control}
                guildInput={watchGuild}
                guild_role_id={circle.guild_role_id}
                guild_id={circle.guild_id}
                guildInfo={guildInfo}
                setGuildInfo={setGuildInfo}
                setValue={setValue}
                register={register}
              />
            </Box>
          </Panel>
        </Panel>
        <Panel settings>
          <Text h2>Circle API Keys</Text>
          <Panel css={{ p: '$sm 0' }}>
            <CircleApiKeys circleId={circleId} />
          </Panel>
        </Panel>
        <Panel settings>
          <Text inline bold h2>
            Danger Zone
          </Text>
          <Flex column alignItems="start">
            <Text large semibold css={{ mb: '$lg' }}>
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
