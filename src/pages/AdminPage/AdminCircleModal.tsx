import React, { MouseEvent, useState } from 'react';

import clsx from 'clsx';

import { makeStyles } from '@material-ui/core';

import {
  ApeAvatar,
  FormModal,
  ApeTextField,
  ApeToggle,
  FormAutocomplete,
} from 'components';
import isFeatureEnabled from 'config/features';
import { useApiAdminCircle, useContracts } from 'hooks';
import { UploadIcon, EditIcon } from 'icons';
import { useSelectedCircle } from 'recoilState/app';
import { Flex, Button } from 'ui';
import { getCircleAvatar } from 'utils/domain';

import { AdminIntegrations } from './AdminIntegrations';

import { ICircle } from 'types';

const DOCS_HREF = 'https://docs.coordinape.com/welcome/admin_info';
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

export const AdminCircleModal = ({
  circle,
  onClose,
  visible,
}: {
  visible: boolean;
  onClose: () => void;
  circle: ICircle;
}) => {
  const classes = useStyles();
  const { circleId } = useSelectedCircle();
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
  const [circleName, setCircleName] = useState(circle.name);
  const [vouching, setVouching] = useState(circle.vouching);
  const [tokenName, setTokenName] = useState(circle.tokenName);
  const [minVouches, setMinVouches] = useState(circle.min_vouches);
  const [teamSelText, setTeamSelText] = useState(circle.teamSelText);
  const [teamSelection, setTeamSelection] = useState(circle.team_selection);
  const [nominationDaysLimit, setNominationDaysLimit] = useState(
    circle.nomination_days_limit
  );
  const [allocText, setAllocText] = useState(circle.allocText);
  const [allowEdit, setAllowEdit] = useState(false);
  const [webhook, setWebhook] = useState('');
  const [defaultOptIn, setDefaultOptIn] = useState(circle.default_opt_in);
  const [vouchingText, setVouchingText] = useState(circle.vouchingText);
  const [fixedPaymentToken, setFixedPaymentToken] = useState(
    circle.fixed_payment_token_type ?? 'Disabled'
  );
  const [onlyGiverVouch, setOnlyGiverVouch] = useState(circle.only_giver_vouch);
  const [autoOptOut, setAutoOptOut] = useState(circle.auto_opt_out);

  // onChange Logo
  const onChangeLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
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
      setWebhook(_webhook);
      setAllowEdit(true);
    } catch (e) {
      console.warn(e);
    }
  };

  const onChangeWith =
    (set: (v: string) => void) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
    ) =>
      set(e.target.value);

  const onChangeNumberWith =
    (set: (v: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) =>
      set(Math.max(0, parseInt(e.target.value) || 0));

  const onSubmit = async () => {
    try {
      if (logoData.avatarRaw) {
        await updateCircleLogo(logoData.avatarRaw);
        setLogoData({
          ...logoData,
          avatarRaw: null,
        });
      }

      if (
        circleName !== circle.name ||
        vouching !== circle.vouching ||
        tokenName !== circle.tokenName ||
        minVouches !== circle.min_vouches ||
        teamSelText !== circle.teamSelText ||
        allocText !== circle.allocText ||
        allowEdit ||
        defaultOptIn !== circle.default_opt_in ||
        nominationDaysLimit !== circle.nomination_days_limit ||
        allocText !== circle.allocText ||
        vouchingText !== circle.vouchingText ||
        onlyGiverVouch !== circle.only_giver_vouch ||
        teamSelection !== circle.team_selection ||
        autoOptOut !== circle.auto_opt_out ||
        fixedPaymentToken !== circle.fixed_payment_token_type
      ) {
        await updateCircle({
          circle_id: circle.id,
          name: circleName,
          vouching: vouching,
          token_name: tokenName,
          min_vouches: minVouches,
          team_sel_text: teamSelText,
          nomination_days_limit: nominationDaysLimit,
          alloc_text: allocText,
          discord_webhook: webhook,
          default_opt_in: defaultOptIn,
          vouching_text: vouchingText,
          only_giver_vouch: onlyGiverVouch,
          team_selection: teamSelection,
          auto_opt_out: autoOptOut,
          update_webhook: allowEdit,
          fixed_payment_token_type: fixedPaymentToken,
        }).then(() => {
          onClose();
        });
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const circleDirty =
    logoData.avatarRaw ||
    circleName !== circle.name ||
    vouching !== circle.vouching ||
    tokenName !== circle.tokenName ||
    minVouches !== circle.min_vouches ||
    teamSelText !== circle.teamSelText ||
    allocText !== circle.allocText ||
    allowEdit ||
    defaultOptIn !== circle.default_opt_in ||
    nominationDaysLimit !== circle.nomination_days_limit ||
    allocText !== circle.allocText ||
    vouchingText !== circle.vouchingText ||
    onlyGiverVouch !== circle.only_giver_vouch ||
    teamSelection !== circle.team_selection ||
    autoOptOut !== circle.auto_opt_out ||
    fixedPaymentToken !== circle.fixed_payment_token_type;
  return (
    <FormModal
      title="Edit Circle Settings"
      submitDisabled={!circleDirty}
      onSubmit={onSubmit}
      open={visible}
      onClose={onClose}
      size="medium"
    >
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
        onChange={onChangeLogo}
        style={{ display: 'none' }}
        type="file"
      />
      <div className={classes.quadGrid}>
        <ApeTextField
          label="Circle name"
          value={circleName}
          onChange={onChangeWith(setCircleName)}
          fullWidth
        />
        <ApeToggle
          value={vouching}
          onChange={val => setVouching(val)}
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
        <ApeTextField
          label="Token name"
          value={tokenName}
          onChange={onChangeWith(setTokenName)}
          fullWidth
        />
        <div className={clsx(classes.vouchingItem, !vouching && 'disabled')}>
          <ApeTextField
            label="Mininum vouches to add member"
            value={minVouches}
            onChange={onChangeNumberWith(setMinVouches)}
            fullWidth
            disabled={!vouching}
          />
        </div>
        <ApeTextField
          label="Teammate selection page text"
          value={teamSelText}
          onChange={onChangeWith(setTeamSelText)}
          multiline
          rows={4}
          inputProps={{
            maxLength: 280,
          }}
          fullWidth
        />
        <div className={clsx(classes.vouchingItem, !vouching && 'disabled')}>
          <ApeTextField
            label="Length of nomination period"
            value={nominationDaysLimit}
            helperText="(# of days)"
            onChange={onChangeNumberWith(setNominationDaysLimit)}
            fullWidth
            disabled={!vouching}
          />
        </div>
        <ApeTextField
          label="Allocation page text"
          value={allocText}
          onChange={onChangeWith(setAllocText)}
          multiline
          rows={5}
          inputProps={{
            maxLength: 280,
          }}
          fullWidth
        />
        <div className={clsx(classes.vouchingItem, !vouching && 'disabled')}>
          <ApeTextField
            label="Vouching text"
            placeholder="This is a custom note we can optionally display to users on the vouching page, with guidance on who to vouch for and how."
            value={vouchingText}
            onChange={onChangeWith(setVouchingText)}
            multiline
            rows={5}
            inputProps={{
              maxLength: 280,
            }}
            fullWidth
            disabled={!vouching}
          />
        </div>
        <ApeToggle
          value={defaultOptIn}
          onChange={val => setDefaultOptIn(val)}
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
          value={onlyGiverVouch}
          onChange={val => setOnlyGiverVouch(val)}
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
          value={teamSelection}
          onChange={val => setTeamSelection(val)}
          label="Team Selection Enabled"
          infoTooltip={
            <YesNoTooltip
              yes="Members select a team during allocation and make allocations only to that team"
              no="Members make allocations to anyone in the circle"
            />
          }
        />
        <ApeToggle
          value={autoOptOut}
          onChange={val => setAutoOptOut(val)}
          label="Auto Opt Out?"
        />
        {isFeatureEnabled('fixed_payments') && (
          <FormAutocomplete
            value={fixedPaymentToken}
            onChange={(v: string) => {
              setFixedPaymentToken(v);
            }}
            options={tokens}
            label="Fixed Payment Token"
            fullWidth
          />
        )}
      </div>
      <AdminIntegrations />
      <div className={classes.bottomContainer}>
        <p className={classes.subTitle}>Discord Webhook</p>
        {allowEdit && (
          <input
            readOnly={!allowEdit}
            className={classes.input}
            onChange={onChangeWith(setWebhook)}
            value={webhook}
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
    </FormModal>
  );
};

export default AdminCircleModal;
