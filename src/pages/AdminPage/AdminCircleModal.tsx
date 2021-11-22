import React, { useState } from 'react';

import clsx from 'clsx';
import { transparentize } from 'polished';

import { makeStyles, Button } from '@material-ui/core';

import { ApeAvatar, FormModal, ApeTextField, ApeToggle } from 'components';
import { useAdminApi } from 'hooks';
import { UploadIcon, EditIcon } from 'icons';
import { getAvatarPath } from 'utils/domain';

import { ICircle } from 'types';

const DOCS_HREF = 'https://docs.coordinape.com/welcome/admin_info';
const DOCS_TEXT = 'See the docs...';

const useStyles = makeStyles(theme => ({
  logoContainer: {
    position: 'relative',
    width: 96,
    height: 96,
    margin: 'auto',
    borderRadius: 30,
    fontSize: 12,
    fontWeight: 400,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(10),
    '&:after': {
      content: `" "`,
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      borderRadius: '50%',
      background: 'rgba(0,0,0,0.6)',
      opacity: 0.7,
      transition: 'all 0.5s',
      '-webkit-transition': 'all 0.5s',
    },
    '&:hover': {
      '&:after': {
        opacity: 1,
      },
      '& .upload-image-icon': {
        background: 'rgba(81, 99, 105, 0.9)',
      },
    },
  },
  logoAvatar: {
    width: 96,
    height: 96,
    border: '4px solid #FFFFFF',
    borderRadius: '50%',
  },
  uploadImageIconWrapper: {
    position: 'absolute',
    marginTop: theme.spacing(2),
    left: 'calc(1% - 40px)',
    width: 178,
    height: 32,
    borderRadius: 8,
    background: transparentize(0.5, theme.colors.text),
    boxShadow: '0px 6.5px 9.75px rgba(181, 193, 199, 0.3)',
    cursor: 'pointer',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 600,
    paddingLeft: 8,
    '& > svg': {
      // fontSize: 14,
      marginRight: theme.spacing(1),
    },
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
    background: theme.colors.background,
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
    color: theme.colors.linkBlue,
  },
}));

const YesNoToolTip = ({ yes = '', no = '', href = '', anchorText = '' }) => {
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
  const { updateCircle, updateCircleLogo, getDiscordWebhook } = useAdminApi();
  const [logoData, setLogoData] = useState<{
    avatar: string;
    avatarRaw: File | null;
  }>({ avatar: getAvatarPath(circle.logo), avatarRaw: null });
  const [circleName, setCircleName] = useState<string>(circle.name);
  const [vouching, setVouching] = useState<number>(circle.vouching);
  const [tokenName, setTokenName] = useState<string>(circle.tokenName);
  const [minVouches, setMinVouches] = useState<number>(circle.min_vouches);
  const [teamSelText, setTeamSelText] = useState<string>(circle.teamSelText);
  const [teamSelection, setTeamSelection] = useState<number>(
    circle.team_selection
  );
  const [nominationDaysLimit, setNominationDaysLimit] = useState<number>(
    circle.nomination_days_limit
  );
  const [allocText, setAllocText] = useState<string>(circle.allocText);
  const [allowEdit, setAllowEdit] = useState<boolean>(false);
  const [webhook, setWebhook] = useState<string>('');
  const [defaultOptIn, setDefaultOptIn] = useState<number>(
    circle.default_opt_in
  );
  const [vouchingText, setVouchingText] = useState<string>(circle.vouchingText);
  const [onlyGiverVouch, setOnlyGiverVouch] = useState<number>(
    circle.only_giver_vouch
  );
  const [autoOptOut, setAutoOptOut] = useState<number>(circle.auto_opt_out);

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

  const editDiscordWebhook = async () => {
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
        autoOptOut !== circle.auto_opt_out
      ) {
        await updateCircle({
          name: circleName,
          vouching: vouching,
          token_name: tokenName,
          min_vouches: minVouches,
          team_sel_text: teamSelText,
          nomination_days_limit: nominationDaysLimit,
          alloc_text: allocText,
          discord_webhook: webhook,
          update_webhook: allowEdit ? 1 : 0,
          default_opt_in: defaultOptIn,
          vouching_text: vouchingText,
          only_giver_vouch: onlyGiverVouch,
          team_selection: teamSelection,
          auto_opt_out: autoOptOut,
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
    autoOptOut !== circle.auto_opt_out;
  return (
    <FormModal
      title="Edit Circle Settings"
      submitDisabled={!circleDirty}
      onSubmit={onSubmit}
      open={visible}
      onClose={onClose}
      size="medium"
    >
      <div className={classes.logoContainer}>
        <label htmlFor="upload-logo-button">
          <ApeAvatar path={logoData.avatar} className={classes.logoAvatar} />
          <div
            className={clsx(
              classes.uploadImageIconWrapper,
              'upload-image-icon'
            )}
          >
            <UploadIcon />
            <span>Upload Circle Logo</span>
          </div>
        </label>
        <input
          id="upload-logo-button"
          onChange={onChangeLogo}
          style={{ display: 'none' }}
          type="file"
        />
      </div>
      <div className={classes.quadGrid}>
        <ApeTextField
          label="Circle name"
          value={circleName}
          onChange={onChangeWith(setCircleName)}
          fullWidth
        />
        <ApeToggle
          value={vouching === 1}
          onChange={val => setVouching(val ? 1 : 0)}
          label="Enable Vouching?"
          infoTooltip={
            <YesNoToolTip
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
        <div
          className={clsx(classes.vouchingItem, vouching === 0 && 'disabled')}
        >
          <ApeTextField
            label="Mininum vouches to add member"
            value={minVouches}
            onChange={onChangeNumberWith(setMinVouches)}
            fullWidth
            disabled={vouching === 0}
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
        <div
          className={clsx(classes.vouchingItem, vouching === 0 && 'disabled')}
        >
          <ApeTextField
            label="Length of nomination period"
            value={nominationDaysLimit}
            helperText="(# of days)"
            onChange={onChangeNumberWith(setNominationDaysLimit)}
            fullWidth
            disabled={vouching === 0}
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
        <div
          className={clsx(classes.vouchingItem, vouching === 0 && 'disabled')}
        >
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
            disabled={vouching === 0}
          />
        </div>
        <ApeToggle
          value={defaultOptIn === 1}
          onChange={val => setDefaultOptIn(val ? 1 : 0)}
          label="Default Opt In?"
          infoTooltip={
            <YesNoToolTip
              yes="All new members are eligible to receive GIVE"
              no="New members need to log into Coordinape and opt in to receiving GIVE"
              href={DOCS_HREF}
              anchorText={DOCS_TEXT}
            />
          }
        />
        <ApeToggle
          value={onlyGiverVouch === 1}
          onChange={val => setOnlyGiverVouch(val ? 1 : 0)}
          className={clsx(classes.vouchingItem, vouching === 0 && 'disabled')}
          label="Only Givers can vouch"
          infoTooltip={
            <YesNoToolTip
              yes="Only members who are eligible to send GIVE can vouch for new members"
              no="Anyone in the circle can vouch for new members"
              href={DOCS_HREF}
              anchorText={DOCS_TEXT}
            />
          }
        />
        <ApeToggle
          value={teamSelection === 1}
          onChange={val => setTeamSelection(val ? 1 : 0)}
          label="Team Selection Enabled"
          infoTooltip={
            <YesNoToolTip
              yes="Members select a team during allocation and make allocations only to that team"
              no="Members make allocations to anyone in the circle"
            />
          }
        />
        <ApeToggle
          value={autoOptOut === 1}
          onChange={val => setAutoOptOut(val ? 1 : 0)}
          label="Auto Opt Out?"
        />
      </div>
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
              variant="contained"
              size="small"
              startIcon={<EditIcon />}
            >
              Edit WebHook
            </Button>
          )}
        </div>
      </div>
    </FormModal>
  );
};

export default AdminCircleModal;
