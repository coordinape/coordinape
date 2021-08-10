import React, { useState } from 'react';

import clsx from 'clsx';

import { makeStyles, Button } from '@material-ui/core';

import { ApeAvatar, FormModal, ApeTextField } from 'components';
import { useAdminApi } from 'hooks';
import { UploadIcon, EditIcon } from 'icons';
import { getAvatarPath } from 'utils/domain';

import { ICircle } from 'types';

const useStyles = makeStyles((theme) => ({
  logoContainer: {
    position: 'relative',
    width: 96,
    height: 96,
    margin: 'auto',
    borderRadius: 30,
    fontSize: 12,
    fontWeight: 400,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(8),
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
    marginTop: theme.spacing(1),
    left: 'calc(1% - 40px)',
    width: 178,
    height: 40,
    borderRadius: 8,
    background: 'rgba(81, 99, 105, 0.7)',
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
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: 'auto auto',
    columnGap: theme.spacing(3),
    rowGap: theme.spacing(2),
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
}));

export const EditCircleModal = ({
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
  const [tokenName, setTokenName] = useState<string>(circle.tokenName);
  const [teamSelText, setTeamSelText] = useState<string>(circle.teamSelText);
  const [allocText, setAllocText] = useState<string>(circle.allocText);
  const [allowEdit, setAllowEdit] = useState<boolean>(false);
  const [webhook, setWebhook] = useState<string>('');
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
    const _webhook = await getDiscordWebhook();
    setWebhook(_webhook);
    setAllowEdit(true);
  };

  const onChangeWith = (set: (v: string) => void) => (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => set(e.target.value);

  const onSubmit = async () => {
    if (logoData.avatarRaw) {
      await updateCircleLogo(logoData.avatarRaw);
      setLogoData({
        ...logoData,
        avatarRaw: null,
      });
    }

    if (
      circleName !== circle.name ||
      tokenName !== circle.tokenName ||
      teamSelText !== circle.teamSelText ||
      allocText !== circle.allocText ||
      webhook
    ) {
      updateCircle({
        name: circleName,
        token_name: tokenName,
        team_sel_text: teamSelText,
        alloc_text: allocText,
        discord_webhook: webhook,
      });
    }
  };

  const circleDirty =
    logoData.avatarRaw ||
    circleName !== circle.name ||
    tokenName !== circle.tokenName ||
    teamSelText !== circle.teamSelText ||
    allocText !== circle.allocText ||
    webhook;

  return (
    <FormModal
      title="Edit Circle Settings"
      submitDisabled={!circleDirty}
      onSubmit={onSubmit}
      visible={visible}
      onClose={onClose}
      size="small"
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
        <ApeTextField
          label="Token name"
          value={tokenName}
          onChange={onChangeWith(setTokenName)}
          fullWidth
        />
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
        <ApeTextField
          label="Allocation page text"
          value={allocText}
          onChange={onChangeWith(setAllocText)}
          multiline
          rows={4}
          inputProps={{
            maxLength: 280,
          }}
          fullWidth
        />
      </div>
      <div className={classes.bottomContainer}>
        <p className={classes.subTitle}>Discord Webhook</p>
        <input
          readOnly={!allowEdit}
          className={classes.input}
          onChange={onChangeWith(setWebhook)}
          value={webhook}
        />
        <div className={classes.webhookButtonContainer}>
          {!allowEdit ? (
            <Button
              onClick={editDiscordWebhook}
              variant="contained"
              size="small"
              startIcon={<EditIcon />}
            >
              Edit WebHook
            </Button>
          ) : (
            ''
          )}
        </div>
      </div>
    </FormModal>
  );
};

export default EditCircleModal;
