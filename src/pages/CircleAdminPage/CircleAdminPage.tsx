import React, { MouseEvent, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import isEmpty from 'lodash/isEmpty';
import { useForm, SubmitHandler, useController } from 'react-hook-form';
import * as z from 'zod';

import { makeStyles } from '@material-ui/core';

import {
  ApeAvatar,
  ApeTextField,
  ApeToggle,
  FormAutocomplete,
} from 'components';
import isFeatureEnabled from 'config/features';
import { useApiAdminCircle, useContracts } from 'hooks';
import { UploadIcon, EditIcon, SaveIcon } from 'icons';
import { useSelectedCircle } from 'recoilState/app';
import { Form, Flex, Button, Box } from 'ui';
import { getCircleAvatar } from 'utils/domain';

import { AdminIntegrations } from './AdminIntegrations';

const DOCS_HREF = 'https://docs.coordinape.com/get-started/admin';
const DOCS_TEXT = 'See the docs...';

const useStyles = makeStyles(theme => ({
  logoContainer: {
    position: 'relative',
    margin: 'auto',
    borderRadius: 30,
    fontSize: 12,
    fontWeight: 400,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(10),
  },
  errorColor: {
    color: theme.palette.error.main,
  },
  logoAvatar: {
    width: 96,
    height: 96,
    border: '4px solid #FFFFFF',
    borderRadius: '50%',
  },
  uploadImageTitle: {},
  quadGrid: {
    marginBottom: theme.spacing(2),
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: 'auto auto',
    columnGap: theme.spacing(6),
    rowGap: theme.spacing(3),
  },
  vouchingItem: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    '&.disabled': {
      opacity: 0.3,
      pointerEvents: 'none',
    },
  },
  bottomContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: theme.colors.text,
    textAlign: 'center',
  },
  input: {
    width: 500,
    padding: theme.spacing(1.5),
    fontSize: 15,
    fontWeight: 500,
    color: theme.colors.text,
    background: theme.colors.surface,
    borderRadius: theme.spacing(1),
    border: 0,
    outline: 'none',
    textAlign: 'center',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  webhookButtonContainer: {
    position: 'relative',
    textAlign: 'center',
    marginTop: theme.spacing(2),
  },
  tooltipLink: {
    display: 'block',
    margin: theme.spacing(2, 0, 0),
    textAlign: 'center',
    color: theme.colors.link,
  },
  body: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 8,
    padding: theme.spacing(0, 8, 3),
    overflowY: 'auto',
    maxHeight: '100vh',
  },
  medium: {
    maxWidth: 820,
  },
  closeButton: {
    color: theme.colors.secondaryText,
    top: 0,
    right: 0,
    position: 'absolute',
  },
  errors: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    margin: 0,
    minHeight: 45,
    color: theme.colors.alert,
  },
  title: {
    margin: theme.spacing(3, 0, 2),
    fontSize: 30,
    fontWeight: 700,
    lineHeight: 1.2,
    color: theme.colors.text,
    textAlign: 'center',
    maxWidth: '100%',
    display: 'block',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
}));

const YesNoTooltip = ({ yes = '', no = '', href = '', anchorText = '' }) => {
  const classes = useStyles();
  return (
    <>
      <strong>Yes</strong> - {yes}
      <br />
      <strong>No</strong> - {no}
      <br />
      {href && (
        <a
          className={classes.tooltipLink}
          rel="noreferrer"
          target="_blank"
          href={href}
        >
          {anchorText}
        </a>
      )}
    </>
  );
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
  auto_opt_out: z.boolean(),
  default_opt_in: z.boolean(),
  discord_webhook: z.optional(z.string().url().or(z.literal(''))),
  min_vouches: z.optional(
    z.number().min(1, {
      message: 'Number of vouchers can not be 0',
    })
  ),
  nomination_days_limit: z.optional(
    z.number().min(1, {
      message: 'nomination period should be 1 day al least',
    })
  ),
  only_giver_vouch: z.boolean(),
  team_sel_text: z.string().optional(),
  team_selection: z.boolean(),
  token_name: z.optional(
    z
      .string()
      .max(255, {
        message: 'Token name length can 255 characters long at max',
      })
      .refine(val => val.trim().length >= 3, {
        message: 'Token name length must be between 3 and 255.',
      })
  ),
  update_webhook: z.boolean().optional(),
  vouching: z.boolean(),
  vouching_text: z.optional(
    z.string().refine(val => val.trim().length >= 20, {
      message: 'Vouching Text must be at least 20 characters long.',
    })
  ),
  fixed_payment_token_type: z.optional(
    z.optional(
      z.string().max(200, {
        message: 'Fixed payment token type can be 200 characters at most',
      })
    )
  ),
  circleLogo: z.instanceof(File).optional(),
});

type CircleAdminFormSchema = z.infer<typeof schema>;

export const CircleAdminPage = () => {
  const classes = useStyles();
  const { circleId, circle } = useSelectedCircle();
  const contracts = useContracts();
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
    formState: { isDirty, errors },
  } = useForm<CircleAdminFormSchema>({
    resolver: zodResolver(schema),
    mode: 'all',
  });

  const { field: circleName } = useController({
    name: 'circle_name',
    control,
    defaultValue: circle.name,
  });
  const { field: vouching } = useController({
    name: 'vouching',
    control,
    defaultValue: circle.vouching,
  });
  const { field: tokenName } = useController({
    name: 'token_name',
    control,
    defaultValue: circle.tokenName,
  });
  const { field: minVouches } = useController({
    name: 'min_vouches',
    control,
    defaultValue: circle.min_vouches,
  });
  const { field: teamSelText } = useController({
    name: 'team_sel_text',
    control,
    defaultValue: circle.teamSelText,
  });
  const { field: teamSelection } = useController({
    name: 'team_selection',
    control,
    defaultValue: circle.team_selection,
  });
  const { field: nominationDaysLimit } = useController({
    name: 'nomination_days_limit',
    control,
    defaultValue: circle.nomination_days_limit,
  });

  const { field: allocText } = useController({
    name: 'alloc_text',
    control,
    defaultValue: circle.allocText,
  });
  const { field: defaultOptIn } = useController({
    name: 'default_opt_in',
    control,
    defaultValue: circle.default_opt_in,
  });
  const { field: vouchingText } = useController({
    name: 'vouching_text',
    control,
    defaultValue: circle.vouchingText,
  });
  const { field: fixedPaymentToken } = useController({
    name: 'fixed_payment_token_type',
    control,
    defaultValue: circle.fixed_payment_token_type ?? 'Disabled',
  });
  const { field: onlyGiverVouch } = useController({
    name: 'only_giver_vouch',
    control,
    defaultValue: circle.only_giver_vouch,
  });
  const { field: autoOptOut } = useController({
    name: 'auto_opt_out',
    control,
    defaultValue: circle.auto_opt_out,
  });
  const { field: discordWebhook } = useController({
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
        setLogoData({
          ...logoData,
          avatarRaw: null,
        });
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
        default_opt_in: data.default_opt_in,
        vouching_text: data.vouching_text,
        only_giver_vouch: data.only_giver_vouch,
        team_selection: data.team_selection,
        auto_opt_out: data.auto_opt_out,
        update_webhook: data.update_webhook,
        fixed_payment_token_type: data.fixed_payment_token_type,
      });
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <Form
      css={{ m: 'auto' }}
      className={clsx([classes['medium']], classes.body)}
      onSubmit={handleSubmit(onSubmit)}
    >
      <h3 className={classes.title}>Circle Settings</h3>
      <Flex
        css={{
          flexDirection: 'column',
          alignItems: 'center',
          gap: '$xs',
          mb: '$lg',
        }}
      >
        <ApeAvatar path={logoData.avatar} className={classes.logoAvatar} />
        <label htmlFor="upload-logo-button">
          <Button as="div" color="neutral" outlined>
            <UploadIcon />
            Upload Circle Logo
          </Button>
        </label>
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
      <Box className={classes.quadGrid}>
        <ApeTextField label="Circle name" {...circleName} fullWidth />
        <ApeToggle
          {...vouching}
          label="Enable Vouching?"
          infoTooltip={
            <YesNoTooltip
              yes="Circle members can invite new people to the
          circle; they become new members if enough other members vouch for
          them"
              no="Only circle admins may add new members"
              href={DOCS_HREF}
              anchorText={DOCS_TEXT}
            />
          }
        />
        <ApeTextField label="Token name" {...tokenName} fullWidth />
        <div
          className={clsx(classes.vouchingItem, !vouching.value && 'disabled')}
        >
          <ApeTextField
            label="Mininum vouches to add member"
            {...minVouches}
            fullWidth
            disabled={!vouching.value}
          />
        </div>
        <ApeTextField
          label="Teammate selection page text"
          {...teamSelText}
          multiline
          rows={4}
          inputProps={{
            maxLength: 280,
          }}
          fullWidth
        />
        <div
          className={clsx(classes.vouchingItem, !vouching.value && 'disabled')}
        >
          <ApeTextField
            label="Length of nomination period"
            {...nominationDaysLimit}
            helperText="(# of days)"
            fullWidth
            disabled={!vouching.value}
          />
        </div>
        <ApeTextField
          label="Allocation page text"
          {...allocText}
          multiline
          rows={5}
          inputProps={{
            maxLength: 280,
          }}
          fullWidth
        />
        <div
          className={clsx(classes.vouchingItem, !vouching.value && 'disabled')}
        >
          <ApeTextField
            label="Vouching text"
            placeholder="This is a custom note we can optionally display to users on the vouching page, with guidance on who to vouch for and how."
            {...vouchingText}
            multiline
            rows={5}
            inputProps={{
              maxLength: 280,
            }}
            fullWidth
            disabled={!vouching.value}
          />
        </div>
        <ApeToggle
          {...defaultOptIn}
          label="Default Opt In?"
          infoTooltip={
            <YesNoTooltip
              yes={`All new members are eligible to receive ${
                circle.tokenName || 'GIVE'
              }`}
              no={`New members need to log into Coordinape and opt in to receiving ${
                circle.tokenName || 'GIVE'
              }`}
              href={DOCS_HREF}
              anchorText={DOCS_TEXT}
            />
          }
        />
        <ApeToggle
          {...onlyGiverVouch}
          className={clsx(classes.vouchingItem, !vouching && 'disabled')}
          label="Only Givers can vouch"
          infoTooltip={
            <YesNoTooltip
              yes={`Only members who are eligible to send ${
                circle.tokenName || 'GIVE'
              } can vouch for new members`}
              no="Anyone in the circle can vouch for new members"
              href={DOCS_HREF}
              anchorText={DOCS_TEXT}
            />
          }
        />
        <ApeToggle
          {...teamSelection}
          label="Team Selection Enabled"
          infoTooltip={
            <YesNoTooltip
              yes="Members select a team during allocation and make allocations only to that team"
              no="Members make allocations to anyone in the circle"
            />
          }
        />
        <ApeToggle {...autoOptOut} label="Auto Opt Out?" />
        {isFeatureEnabled('fixed_payments') && (
          <FormAutocomplete
            {...fixedPaymentToken}
            options={tokens}
            label="Fixed Payment Token"
            fullWidth
          />
        )}
      </Box>
      <AdminIntegrations />
      <div className={classes.bottomContainer}>
        <p className={classes.subTitle}>Discord Webhook</p>
        {allowEdit && (
          <input
            readOnly={!allowEdit}
            className={classes.input}
            {...discordWebhook}
          />
        )}
        <div className={classes.webhookButtonContainer}>
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
      </div>
      {!isEmpty(errors) && (
        <Box
          css={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            margin: 0,
            color: '$alert',
          }}
        >
          {Object.values(errors).map((error, i) => (
            <div key={i}>{error.message}</div>
          ))}
        </Box>
      )}
      <Button
        css={{ mt: '$lg', gap: '$xs' }}
        color="primary"
        size="medium"
        disabled={!isDirty}
      >
        {<SaveIcon />}
        {'Save'}
      </Button>
    </Form>
  );
};

export default CircleAdminPage;
