import React, { useState, useEffect } from 'react';

import clsx from 'clsx';

import { Button, Hidden, Modal, makeStyles } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import { ReactComponent as SaveAdminSVG } from 'assets/svgs/button/save-admin.svg';
import { ApeAvatar } from 'components';
import { useAdminApi } from 'hooks';
import { useSelectedCircle } from 'recoilState';
import { getAvatarPath } from 'utils/domain';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: theme.spacing(2.5, 6),
    width: 648,
    height: 640,
    borderRadius: theme.spacing(1),
    outline: 'none',
    background: theme.colors.white,
  },
  title: {
    fontSize: 30,
    fontWeight: 700,
    color: theme.colors.text,
    textAlign: 'center',
  },
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
  },
  uploadImageContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadImageTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: '#FFFFFF',
    paddingLeft: 8,
  },
  subContent: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  container: {
    width: '47%',
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
  textarea: {
    padding: theme.spacing(1, 1.5),
    height: 97,
    resize: 'none',
    fontSize: 15,
    fontWeight: 500,
    color: theme.colors.text,
    background: theme.colors.background,
    borderRadius: theme.spacing(1),
    border: 0,
    outline: 'none',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  saveButton: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: theme.spacing(6),
    padding: theme.spacing(1.5, 3),
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'none',
    color: theme.colors.white,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    background: theme.colors.red,
    borderRadius: theme.spacing(1),
    filter: 'drop-shadow(2px 3px 6px rgba(81, 99, 105, 0.33))',
    '&:hover': {
      background: theme.colors.red,
      filter: 'drop-shadow(2px 3px 6px rgba(81, 99, 105, 0.5))',
    },
    '&:disabled': {
      color: theme.colors.lightRed,
      background: theme.colors.mediumRed,
    },
  },
  saveAdminIconWrapper: {
    width: theme.spacing(1.25),
    height: theme.spacing(2),
    marginRight: theme.spacing(1),
  },
}));

export const EditCircleModal = ({
  onClose,
  visible,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const classes = useStyles();
  const { updateCircle, updateCircleLogo } = useAdminApi();
  const circle = useSelectedCircle();

  const [logoData, setLogoData] = useState<{
    avatar: string;
    avatarRaw: File | null;
  }>({ avatar: '', avatarRaw: null });

  const [circleName, setCircleName] = useState<string>('');
  const [tokenName, setTokenName] = useState<string>('');
  const [teamSelText, setTeamSelText] = useState<string>('');
  const [allocText, setAllocText] = useState<string>('');

  const circleChanged =
    circleName !== circle?.name ||
    tokenName !== circle?.token_name ||
    teamSelText !== circle?.team_sel_text ||
    allocText !== circle?.alloc_text;
  const logoOrCircleChanged = logoData.avatarRaw || circleChanged;

  useEffect(() => {
    if (circle !== undefined) {
      setCircleName(circle.name);
      setTokenName(circle.tokenName);
      setTeamSelText(circle.teamSelText);
      setAllocText(circle.allocText);
      setLogoData({ avatar: getAvatarPath(circle.logo), avatarRaw: null });
    }
  }, [circle]);

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

  // onChange CircleName
  const onChangeCircleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCircleName(e.target.value);
  };

  // onChange TokenName
  const onChangeTokenName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTokenName(e.target.value);
  };

  // onChange TeamSelText
  const onChangeTeamSelText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTeamSelText(e.target.value);
  };

  // onChange AllocText
  const onChangeAllocText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAllocText(e.target.value);
  };

  // onClick SaveCircle
  const onClickSaveCircle = async () => {
    if (circle === undefined) {
      return; // this shouldn't happen but it is for the typechecker
    }
    if (logoData.avatarRaw) {
      await updateCircleLogo(logoData.avatarRaw);
    }

    if (
      circleName !== circle.name ||
      tokenName !== circle.token_name ||
      teamSelText !== circle.team_sel_text ||
      allocText !== circle.alloc_text
    ) {
      updateCircle({
        name: circleName,
        token_name: tokenName,
        team_sel_text: teamSelText,
        alloc_text: allocText,
      });
    }
  };

  return (
    <Modal className={classes.modal} onClose={onClose} open={visible}>
      <div className={classes.content}>
        <p className={classes.title}>Edit Circle Settings</p>
        <div className={classes.logoContainer}>
          <label htmlFor="upload-logo-button">
            <ApeAvatar path={logoData.avatar} className={classes.logoAvatar} />
            <div
              className={clsx(
                classes.uploadImageIconWrapper,
                'upload-image-icon'
              )}
            >
              <div className={classes.uploadImageContainer}>
                <CloudUploadIcon style={{ color: '#FFFFFF' }} />
                <p className={classes.uploadImageTitle}>Upload Circle Logo</p>
              </div>
            </div>
          </label>
          <input
            id="upload-logo-button"
            onChange={onChangeLogo}
            style={{ display: 'none' }}
            type="file"
          />
        </div>
        <div className={classes.subContent}>
          <div className={classes.container}>
            <p className={classes.subTitle}>Circle name</p>
            <input
              className={classes.input}
              onChange={onChangeCircleName}
              value={circleName}
            />
          </div>
          <div className={classes.container}>
            <p className={classes.subTitle}>Token name</p>
            <input
              className={classes.input}
              onChange={onChangeTokenName}
              value={tokenName}
            />
          </div>
        </div>
        <div className={classes.subContent}>
          <div className={classes.container}>
            <p className={classes.subTitle}>Teammate selection page text</p>
            <textarea
              className={classes.textarea}
              maxLength={280}
              onChange={onChangeTeamSelText}
              value={teamSelText}
            />
          </div>
          <div className={classes.container}>
            <p className={classes.subTitle}>Allocation page text</p>
            <textarea
              className={classes.textarea}
              maxLength={280}
              onChange={onChangeAllocText}
              value={allocText}
            />
          </div>
        </div>
        <Button
          className={classes.saveButton}
          disabled={!logoOrCircleChanged}
          onClick={onClickSaveCircle}
        >
          <Hidden smDown>
            <div className={classes.saveAdminIconWrapper}>
              <SaveAdminSVG />
            </div>
          </Hidden>
          Save
        </Button>
      </div>
    </Modal>
  );
};

export default EditCircleModal;
