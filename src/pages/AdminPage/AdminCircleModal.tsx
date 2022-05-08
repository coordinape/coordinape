import React, { useState } from 'react';

import clsx from 'clsx';
import { transparentize } from 'polished';

import { makeStyles } from '@material-ui/core';

import { ApeAvatar, ApeToggleNew } from 'components';
import { useApiAdminCircle } from 'hooks';
import { UploadIcon, EditIcon } from 'icons';
import { useSelectedCircle } from 'recoilState/app';
import {
  Box,
  Button,
  Form,
  FormLabel,
  Modal,
  Text,
  TextField,
  TextArea,
} from 'ui';
import { getCircleAvatar } from 'utils/domain';

import { AdminIntegrations } from './AdminIntegrations';

import { ICircle } from 'types';

const DOCS_HREF = 'https://docs.coordinape.com/welcome/admin_info';
const DOCS_TEXT = 'See the docs...';

const labelStyles = {
  lineHeight: '$short',
  color: '$text',
  fontSize: '$4',
  fontFamily: 'Inter',
  fontWeight: '$bold',
  textAlign: 'center',
  mb: '$sm',
};

const textAreaStyles = {
  width: '$full',
  fontWeight: '$light',
  fontSize: '$4',
  lineHeight: 'none',
};

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
  errorColor: {
    color: theme.palette.error.main,
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
    <Modal
      title="Edit Circle Settings"
      open={visible}
      onClose={onClose}
      css={{ maxWidth: 820 }}
    >
      <Form
        css={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'white',
          width: '100%',
          padding: '0 0 $lg',
          overflowY: 'auto',
          maxHeight: '100vh',
        }}
        onSubmit={onSubmit}
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
          <Box
            css={{
              display: 'flex',
              'flex-direction': 'column',
              alignItems: 'center',
            }}
          >
            <FormLabel
              htmlFor="circle_name"
              css={{ ...labelStyles, width: '$full' }}
            >
              Circle name
            </FormLabel>
            <TextField
              id="circle_name"
              value={circleName}
              onChange={onChangeWith(setCircleName)}
              css={{ width: '$full' }}
            />
          </Box>
          <ApeToggleNew
            value={vouching}
            label="Enable Vouching?"
            onChange={val => {
              if (val == 'true') {
                setVouching(true);
              } else {
                setVouching(false);
              }
            }}
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
          <Box
            css={{
              display: 'flex',
              'flex-direction': 'column',
              alignItems: 'center',
            }}
          >
            <FormLabel
              htmlFor="token_name"
              css={{ ...labelStyles, width: '$full' }}
            >
              Token name
            </FormLabel>
            <TextField
              id="token_name"
              value={tokenName}
              onChange={onChangeWith(setTokenName)}
              css={{ width: '$full' }}
            />
          </Box>
          <div className={clsx(classes.vouchingItem, !vouching && 'disabled')}>
            <Box
              css={{
                display: 'flex',
                'flex-direction': 'column',
                alignItems: 'center',
              }}
            >
              <FormLabel
                htmlFor="min_vouches"
                css={{ ...labelStyles, width: '$full' }}
              >
                Mininum vouches to add member
              </FormLabel>
              <TextField
                id="min_vouches"
                value={minVouches}
                onChange={onChangeNumberWith(setMinVouches)}
                css={{ width: '$full' }}
                disabled={!vouching}
              />
            </Box>
          </div>
          <Box
            css={{
              display: 'flex',
              'flex-direction': 'column',
              alignItems: 'center',
            }}
          >
            <FormLabel
              htmlFor="team_selection_text"
              css={{ ...labelStyles, width: '$full' }}
            >
              Teammate selection page text
            </FormLabel>
            <TextArea
              id="team_selection_text"
              value={teamSelText}
              onChange={onChangeWith(setTeamSelText)}
              css={textAreaStyles}
              rows={4}
              maxLength={280}
            />
          </Box>
          <div className={clsx(classes.vouchingItem, !vouching && 'disabled')}>
            <Box
              css={{
                display: 'flex',
                'flex-direction': 'column',
                alignItems: 'center',
              }}
            >
              <FormLabel
                htmlFor="nomination_period"
                css={{ ...labelStyles, width: '$full' }}
              >
                Length of nomination period
              </FormLabel>
              <TextField
                id="nomination_period"
                value={nominationDaysLimit}
                onChange={onChangeNumberWith(setNominationDaysLimit)}
                css={{ width: '$full' }}
                disabled={!vouching}
              />
              <Text
                css={{
                  fontSize: '$2',
                  lineHeight: '$shorter',
                  color: '$secondary',
                }}
              >
                (# of days)
              </Text>
            </Box>
          </div>
          <Box
            css={{
              display: 'flex',
              'flex-direction': 'column',
              alignItems: 'center',
            }}
          >
            <FormLabel
              htmlFor="allocaion_text"
              css={{ ...labelStyles, width: '$full' }}
            >
              Allocation page text
            </FormLabel>
            <TextArea
              id="allocaion_text"
              value={allocText}
              onChange={onChangeWith(setAllocText)}
              css={textAreaStyles}
              rows={4}
              maxLength={280}
            />
          </Box>
          <div className={clsx(classes.vouchingItem, !vouching && 'disabled')}>
            <Box
              css={{
                display: 'flex',
                'flex-direction': 'column',
                alignItems: 'center',
              }}
            >
              <FormLabel
                htmlFor="vouching_text"
                css={{ ...labelStyles, width: '$full' }}
              >
                Vouching text
              </FormLabel>
              <TextArea
                id="vouching_text"
                placeholder="This is a custom note we can optionally display to users on the vouching page, with guidance on who to vouch for and how."
                value={vouchingText}
                onChange={onChangeWith(setVouchingText)}
                css={textAreaStyles}
                rows={4}
                maxLength={280}
                disabled={!vouching}
              />
            </Box>
          </div>
          <ApeToggleNew
            value={defaultOptIn}
            onChange={val => {
              if (val == 'true') {
                setDefaultOptIn(true);
              } else {
                setDefaultOptIn(false);
              }
            }}
            label="Default Opt In?"
            infoTooltip={
              <YesNoTooltip
                yes="All new members are eligible to receive GIVE"
                no="New members need to log into Coordinape and opt in to receiving GIVE"
                href={DOCS_HREF}
                anchorText={DOCS_TEXT}
              />
            }
          />
          <ApeToggleNew
            value={onlyGiverVouch}
            onChange={val => {
              if (val == 'true') {
                setOnlyGiverVouch(true);
              } else {
                setOnlyGiverVouch(false);
              }
            }}
            label="Only Givers can vouch"
            infoTooltip={
              <YesNoTooltip
                yes="Only members who are eligible to send GIVE can vouch for new members"
                no="Anyone in the circle can vouch for new members"
                href={DOCS_HREF}
                anchorText={DOCS_TEXT}
              />
            }
            disabled={!vouching}
          />
          <ApeToggleNew
            value={teamSelection}
            onChange={val => {
              if (val == 'true') {
                setTeamSelection(true);
              } else {
                setTeamSelection(false);
              }
            }}
            label="Team Selection Enabled"
            infoTooltip={
              <YesNoTooltip
                yes="Members select a team during allocation and make allocations only to that team"
                no="Members make allocations to anyone in the circle"
              />
            }
          />
          <ApeToggleNew
            value={autoOptOut}
            onChange={val => {
              if (val == 'true') {
                setAutoOptOut(true);
              } else {
                setAutoOptOut(false);
              }
            }}
            label="Auto Opt Out?"
          />
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
              <Button onClick={editDiscordWebhook} size="small">
                <Box
                  css={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                  }}
                >
                  <i>
                    <EditIcon />
                  </i>
                  <Text css={{ color: '$white' }}>Edit WebHook</Text>
                </Box>
              </Button>
            )}
          </div>
        </div>
        <Button
          css={{ mt: '$lg', gap: '$xs' }}
          color="red"
          size="medium"
          type="submit"
          disabled={!circleDirty}
        >
          Save
        </Button>
      </Form>
    </Modal>
  );
};

export default AdminCircleModal;
