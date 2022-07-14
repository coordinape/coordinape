import React, { MouseEvent, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { useForm, SubmitHandler, useController } from 'react-hook-form';
import * as z from 'zod';

import { FormAutocomplete, FormInputField, FormRadioGroup } from 'components';
import isFeatureEnabled from 'config/features';
import { useApeSnackbar, useApiAdminCircle, useContracts } from 'hooks';
import { EditIcon } from 'icons';
import { useSelectedCircle } from 'recoilState/app';
import { paths } from 'routes/paths';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Link,
  Flex,
  Form,
  FormLabel,
  Panel,
  Text,
  Tooltip,
  CheckBox,
  AppLink,
} from 'ui';
import { SingleColumnLayout } from 'ui/layouts';
import { getCircleAvatar } from 'utils/domain';

import { AdminIntegrations } from './AdminIntegrations';

const labelStyles = {
  fontWeight: '$bold',
  textAlign: 'center',
  mb: '$sm',
};

const panelStyles = {
  display: 'grid',
  gridTemplateColumns: '23fr 77fr',
  gap: '$md',
  width: '100%',
  '@md': { display: 'flex' },
  mb: '$lg',
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
  return val === 'true' ? true : false;
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
  circleLogo: z.instanceof(File).optional(),
});

type CircleAdminFormSchema = z.infer<typeof schema>;

export const CircleAdminPage = () => {
  const { circleId, circle } = useSelectedCircle();
  const contracts = useContracts();
  const { showInfo } = useApeSnackbar();
  const tokens = ['Disabled'].concat(
    contracts ? contracts.getAvailableTokens() : []
  );

  const { updateCircle, updateCircleLogo, getDiscordWebhook } =
    useApiAdminCircle(circleId);
  const [logoData, setLogoData] = useState<{
    avatar: string;
    avatarRaw: File | null;
  }>({
    avatar: getCircleAvatar({ avatar: circle.logo, circleName: circle.name }),
    avatarRaw: null,
  });

  const [allowEdit, setAllowEdit] = useState(false);

  const {
    control,
    handleSubmit,
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

  const { field: fixedPaymentToken, fieldState: fixedPaymentTokenState } =
    useController({
      name: 'fixed_payment_token_type',
      control,
      defaultValue: circle.fixed_payment_token_type ?? 'Disabled',
    });

  const { field: discordWebhook, fieldState: discordWebhookState } =
    useController({
      name: 'discord_webhook',
      control,
      defaultValue: '',
    });
  const { field: circleLogo } = useController({
    name: 'circleLogo',
    control,
    defaultValue: undefined,
  });

  // onChange Logo
  const onChangeLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      circleLogo.onChange(e.target.files[0]);
      setLogoData({
        ...logoData,
        avatar: URL.createObjectURL(e.target.files[0]),
        avatarRaw: e.target.files[0],
      });
    }
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

  const onSubmit: SubmitHandler<CircleAdminFormSchema> = async data => {
    try {
      if (logoData.avatarRaw) {
        await updateCircleLogo(logoData.avatarRaw);
        setLogoData({ ...logoData, avatarRaw: null });
      }
      await updateCircle({
        circle_id: circle.id,
        name: data.circle_name,
        vouching: data.vouching,
        token_name: data.token_name,
        min_vouches: data.min_vouches,
        team_sel_text: data.team_sel_text,
        nomination_days_limit: data.nomination_days_limit,
        alloc_text: data.alloc_text,
        discord_webhook: data.discord_webhook,
        vouching_text: data.vouching_text,
        only_giver_vouch: data.only_giver_vouch,
        team_selection: data.team_selection,
        auto_opt_out: data.auto_opt_out,
        fixed_payment_token_type: data.fixed_payment_token_type,
      });

      showInfo('Saved changes');
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <Form id="circle_admin">
      <SingleColumnLayout>
        <Flex
          css={{
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            mb: '$lg',
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
          <Text inline bold h2 font="inter">
            General
          </Text>
          <Panel nested>
            <Text h3 semibold css={{ mb: '$md' }}>
              Circle Settings
            </Text>
            <Text css={{ display: 'block' }}>
              Coordinape circles allow you to collectively reward circle members
              through equitable and transparent payments.{' '}
              <span>
                <a
                  href="https://docs.coordinape.com/get-started/admin/update-circle-settings"
                  rel="noreferrer"
                  target="_blank"
                >
                  Learn More
                </a>
              </span>
            </Text>
            <Flex
              css={{
                justifyItems: 'start',
                flexWrap: 'wrap',
                mt: '$md',
                mb: '$lg',
                gap: '$xl',
              }}
            >
              <FormInputField
                id="circle_name"
                name="circle_name"
                control={control}
                defaultValue={circle.name}
                label="Circle Name"
                infoTooltip="This will be the circle name that your users will select"
                css={{ alignItems: 'flex-start', minWidth: '224px' }}
                inputProps={{ css: { height: '$1xl', width: '100%' } }}
                showFieldErrors
              />

              <Flex
                column
                css={{ alignItems: 'flex-start', minWidth: '224px' }}
              >
                <FormLabel type="label" css={{ ...labelStyles }}>
                  Circle Logo{' '}
                  {
                    <Tooltip content={<div>Upload a logo to your circle</div>}>
                      <InfoCircledIcon />
                    </Tooltip>
                  }
                </FormLabel>
                <Flex
                  row
                  css={{ alignItems: 'center', gap: '$sm', width: '100%' }}
                >
                  <Avatar size="medium" margin="none" path={logoData.avatar} />
                  <FormLabel
                    htmlFor="upload-logo-button"
                    css={{ flexGrow: '1' }}
                  >
                    <Button
                      as="div"
                      css={{
                        height: '$1xl',
                        minHeight: '$1xl',
                        width: '100%',
                        fontSize: '$large',
                        fontWeight: '$semibold',
                        lineHeight: '$short',
                        borderRadius: '$3',
                      }}
                      color="primary"
                      outlined
                    >
                      Upload File
                    </Button>
                  </FormLabel>
                </Flex>
                <input
                  id="upload-logo-button"
                  onBlur={circleLogo.onBlur}
                  ref={circleLogo.ref}
                  name={circleLogo.name}
                  onChange={onChangeLogo}
                  style={{ display: 'none' }}
                  type="file"
                />
              </Flex>
              <FormInputField
                id="token_name"
                name="token_name"
                control={control}
                defaultValue={circle.token_name}
                label="Token Name"
                infoTooltip="This will be the token name displayed to all the circle users"
                css={{ alignItems: 'flex-start', minWidth: '224px' }}
                inputProps={{ css: { height: '$1xl', width: '100%' } }}
                showFieldErrors
              />
            </Flex>
            <Flex
              row
              css={{
                justifyContent: 'flex-start',
                flexWrap: 'wrap',
                gap: '$lg',
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
            </Flex>
            <Divider css={{ mt: '$1xl', mb: '$lg' }} />
            <Text h3 semibold css={{ mb: '$md' }}>
              Epoch Timing
            </Text>
            <Text css={{ display: 'block' }}>
              Edit your epoch timing on the
              <AppLink to={paths.history(circleId)}> Epoch Overview</AppLink> by
              creating or editing an epoch
            </Text>
          </Panel>
        </Panel>
        <Panel css={panelStyles}>
          <Text inline bold h2 font="inter">
            Fixed Payment
          </Text>
          <Panel nested>
            <Flex css={{ justifyContent: 'flex-start' }}>
              {isFeatureEnabled('fixed_payments') && (
                <FormAutocomplete
                  {...fixedPaymentToken}
                  options={tokens}
                  label="Fixed Payment Token"
                  error={true}
                  errorText={fixedPaymentTokenState.error?.message}
                  style={{ maxWidth: '180px' }}
                />
              )}
            </Flex>
          </Panel>
        </Panel>
        <Panel css={panelStyles}>
          <Text inline bold h2 font="inter">
            Customization
          </Text>
          <Panel nested>
            <Text h3 semibold css={{ mb: '$md' }}>
              Rewards Placeholder Text
            </Text>
            <Text>
              Change the default text contributors see during epoch allocation
            </Text>
            <Flex css={{ mt: '$lg', flexWrap: 'wrap', gap: '$1xl' }}>
              <FormInputField
                id="contribution_text"
                name="team_sel_text"
                control={control}
                defaultValue={circle.teamSelText}
                css={{ flexGrow: 1, textAlign: 'flex-start' }}
                label="Contribution Help Text"
                description="Change the default text contributors see on team selection"
                showFieldErrors
              />

              <FormInputField
                id="alloc_text"
                name="alloc_text"
                control={control}
                defaultValue={circle.allocText}
                css={{ flexGrow: 1, textAlign: 'flex-start' }}
                label="Reward Help Text"
                description="Change the default text contributors see during epoch allocation"
                showFieldErrors
              />
            </Flex>
          </Panel>
        </Panel>
        <Panel css={panelStyles}>
          <Text inline bold h2 font="inter">
            Vouching
          </Text>
          <Panel nested>
            <Text h3 semibold css={{ mb: '$sm' }}>
              Vouching Settings
            </Text>
            <Text css={{ display: 'block' }}>
              Vouching default text and settings.{' '}
              <span>
                <a
                  href="https://docs.coordinape.com/get-started/admin/enable-vouching"
                  rel="noreferrer"
                  target="_blank"
                >
                  Learn More
                </a>
              </span>
            </Text>
            <Flex column css={{ mt: '$lg', gap: '$lg' }}>
              <Flex column css={{ alignItems: 'flex-start', gap: '$sm' }}>
                <FormLabel type="label" css={{ fontWeight: '$bold' }}>
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
                    <InfoCircledIcon />
                  </Tooltip>
                </FormLabel>
                <CheckBox {...vouching} label="Yes" />
              </Flex>
              <Flex
                css={{
                  justifyContent: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '$1xl',
                }}
              >
                <FormInputField
                  id="min_vouches"
                  name="min_vouches"
                  control={control}
                  defaultValue={circle.min_vouches}
                  number
                  inputProps={{ type: 'number' }}
                  css={{
                    alignItems: 'flex-start',
                    flexGrow: 1,
                    maxWidth: '50%',
                  }}
                  disabled={!vouching.value}
                  label="Mininum vouches to add member"
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
                  css={{
                    alignItems: 'flex-start',
                    flexGrow: 1,
                    maxWidth: '50%',
                  }}
                  disabled={!vouching.value}
                  label="Length of Nomination Period"
                  infoTooltip="Set the length of Nomination period in days"
                  showFieldErrors
                />
              </Flex>
              <Flex
                css={{
                  gap: '$lg',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                }}
              >
                <FormInputField
                  textArea
                  id="vouching_text"
                  name="vouching_text"
                  control={control}
                  areaProps={{
                    placeholder:
                      'This is a custom note we can optionally display to users on the vouching page, with guidance on who to vouch for and how.',
                  }}
                  css={{ maxWidth: '50%' }}
                  disabled={!vouching.value}
                  defaultValue={circle.vouchingText}
                  label="Vouching Text"
                  description="Change the default text contributors see in vouching page"
                  showFieldErrors
                />
              </Flex>
            </Flex>
          </Panel>
        </Panel>
        <Panel css={panelStyles}>
          <Text inline bold h2 font="inter">
            Integration
          </Text>
          <Panel nested>
            <AdminIntegrations circleId={circleId} />
            <Box>
              <Text bold css={{ mt: '$lg', mb: '$md' }}>
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
                  <Button
                    onClick={editDiscordWebhook}
                    color="neutral"
                    size="medium"
                    outlined
                  >
                    <EditIcon />
                    Edit WebHook
                  </Button>
                )}
              </div>
            </Box>
          </Panel>
        </Panel>
        <Panel css={panelStyles}>
          <Text inline bold h2 font="inter">
            Danger Zone
          </Text>
          <Panel nested></Panel>
        </Panel>
      </SingleColumnLayout>
    </Form>
  );
};

export default CircleAdminPage;
